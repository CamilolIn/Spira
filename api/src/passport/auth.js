const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { User } = require('../models/user');
const url = 'localhost:3001';
//${url}/users/singin`


/*************************** Serializarion de User ****************************** */
passport.serializeUser((user, done) => {
	console.log('serializacion');
	console.log(user);
	console.log('serializacion');

	done(null, user.id);
});

passport.deserializeUser((id, done) => {
	User.findOne({
		where: { id },
	})
		.then((user) => {
			console.log('todo bien con la serializacion');
			if (user) {
				return done(null, user);
			} else {
				return done(new Error('User no encontrado'));
			}
		})
		.catch((err) => {
			console.log('error de serializacion');
			console.log(err);
			return done(new Error('Internal Error'));
		});
});
/******************************************************************* */

/***************************  Configuracion de estrategia Local  ****************************** */
passport.use(
	new LocalStrategy(
		// Este objeto sirve para cambiar los nombres de las variables, nada mas
		{ usernameField: 'email', passwordField: 'password' },
		(email, password, done) => {
			console.log('Email: ' + email);
			console.log('Password: ' + password);
			User.findOne({ where: { email: email } })
				.then((user) => {
					console.log('Entre al THEN');
					// Si el usuario existe
					if (user) {
						// Si las contrasenias matchean (comparePassword esta en el modelo 'user', devuelve true o false)
						if (password === user.password) {
							console.log(user.password + 'Entre al IF');
							// Se llama a la funcion done con 'user' (autenticacion exitosa)
							return done(null, {
								email: user.email,
								id: user.id,
								role: user.role,
                                name: user.name,
								phone:user.phone,
								log:true
							});
							// Si las contrasenias NO matchean
						} else {
							console.log('Password incorrect');
							// Se llama a la funcion done con 'null' (autenticacion fallida)
							return done(new Error('Password incorrect'));
						}
						// Si el usuario NO existe
					} else {
						console.log('User not Found');
						// Se llama a la funcion done con 'null' (autenticacion fallida)
						return done(new Error('User not found'), null);
					}
				})
				.catch((err) => {
					console.error(err);
					return done(new Error('Internal error'), null);
				});
		}
	)
);
