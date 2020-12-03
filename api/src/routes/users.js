const { User } = require('../models/user');
const { Cursos } = require('../models/cursos');
const server = require('express').Router(); //Import router from express module.
const passport = require('passport');


server.post('/', function (req, res) {
	const { email, password, phone, role, name } = req.body;
	console.log(req.body);
	User.create({ name, email, password, role, phone })
		.then((user) => {
			console.log(user);
			return res.status(200).json({
				message: 'Usuario creado exitosamente!',
				data: user,
			});
		})
		.catch((err) => {
			return res.status(400).json({
				message: 'Error al crear usuario',
				data: err,
			});
		});
});

// GET USERS
server.get('/', (req, res) => {
	User.findAll({include:{model: Cursos}})
		.then((users) => {
			users.sort(function (a, b) {
				return a.id - b.id;
			});
			return res.status(200).json({
				message: 'Success',
				data: users,
			});
		})
		.catch((err) => {
			return res.status(500).json({
				message: 'Hubo un error en el servidor',
				data: err,
			});
		});
});

// DELETE USER
server.delete('/', (req, res) => {
	console.log('**********');
	console.log(req.query);
	const { id } = req.query;
	User.findOne({ where: { id } })
		.then((deletedUser) => {
			console.log('voy a eliminar un usuario');
			deletedUser.destroy();
			return res.status(200).json({
				message: 'Usuario eliminado',
				data: deletedUser,
			});
		})
		.catch((err) => {
			console.log('Se me complico la eliminada');
			console.log(err);
			return res.status(500).json({
				message: 'Error al eliminar usuario',
				data: err,
			});
		});
});

// MODIFICAR DATOS DEL USER
server.put('/', (req, res) => {
	console.log(req.body);
	const { email, id, role, resetPassword } = req.body;

	if (resetPassword) {
		var newRandomNumber = '';
		// Se genera un numero aleatorio con crypto.randomBytes
		newRandomNumber = crypto.randomBytes(10, (err, buf) => {
			if (err) throw err;
			console.log(`${buf.length} bytes of random data: ${buf.toString('hex')}`);
			// Se asigna el numero aleatorio a la variable newRandomNumber
			// Ademas se utiliza la funcion encryptPassword de bcrypt para la encriptacion
			newRandomNumber = User.encryptPassword(buf.toString('hex'));
		});
	}

	User.findOne({ where: { email } })
		.then((user) => {
			console.log('Dentro del .then');
			console.log(newRandomNumber);
			// Se actualizan los datos
			// resetPassword es 'true' solo cuando se aprieta el boton de resetear password, sino es 'false'
			if (resetPassword) {
				user.password = newRandomNumber;
			}
			user.role = role;
			// Se guardan los datos
			user.save();
			// IMPORTANTE: la contraseña aleatoria numerica que se pone mas arriba (newRandomNumber) luego se encripta y por el diseño del modelo no se muestra en queries. (en la base de datos solo se puede ver una encriptacion de la contraseña).
			console.log(user.dataValues);
			return res.status(OK).json({
				message: `El usuario se ha actualizado correctamente!`,
				data: user,
			});
		})
		.catch((err) => {
			return res.status(ERROR).json({
				message: 'Error al modificar en la ruta del usuario',
				data: err,
			});
		});
});

server.put('/:user_id/curso/:curso_id', (req, res, next)=>{
	console.log(req)
	const { user_id, curso_id } = req.params;

	Promise.all([ User.findByPk(user_id), Cursos.findByPk(curso_id) ])
		.then(data =>{
			data[0].addCursos(data[1])
				.then(() => {
					User.findOne({
						where: {id: user_id},
						include: [{model:Cursos}]
					})
						.then((data) => {
							console.log(data)
							res.json({
								message: 'Curso añadida correctamente!', 
								data: data 
						})
				})})
				.catch(next)
		});
})

server.get('/:id', (req, res, next) => {
	const { id } = req.params;
	User.findAll({ where: { id }, include: { model: Cursos} }).then((user) => {
		console.log(user);
		res.json({
				data: user,
			})
			.catch((err) => {
				return res.status(400).json({
					message: 'Error al buscar User',
					data: err,
				});
			});
	});
});


/*********LOGIN ************* */
server.post('/singin', function (req, res, next) {
	passport.authenticate('local', function (err, user, info) {
		if (err) {
			return res.send({ message: 'User or Email incorrect' });
		}
		if (!user) {
			return res.send({ message: 'User or Email incorrect' });
		}
		req.logIn(user, function (err) {
			if (err) {
				return next(err);
			}
			return res.send({
				data: user,
			});
		});
	})(req, res, next);
});

server.get('/log/logout', (req, res) => {
	req.logOut();
	res.send({ message: 'logout' });
});

server.get('/log/logout', (req, res) => {
	req.logOut();
	res.send({ message: 'logout' });
});

module.exports = server;