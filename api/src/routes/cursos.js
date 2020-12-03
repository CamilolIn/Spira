const { Cursos } = require('../models/cursos');
const server = require('express').Router();

server.post('/', function (req, res) {
	const { name, intensidad} = req.body;
	console.log(req.body);
	Cursos.create({ name, intensidad })
		.then((curso) => {
			console.log(curso);
			return res.status(200).json({
				message: 'Curso creado exitosamente!',
				data: curso,
			});
		})
		.catch((err) => {
			return res.status(400).json({
				message: 'Error al crear Curso',
				data: err,
			});
		});
});

server.get('/', (req, res) => {
	Cursos.findAll()
		.then((cursos) => {
			cursos.sort(function (a, b) {
				return a.id - b.id;
			});
			return res.status(200).json({
				message: 'Success',
				data: cursos,
			});
		})
		.catch((err) => {
			return res.status(500).json({
				message: 'Hubo un error en el servidor',
				data: err,
			});
		});
});

module.exports = server;