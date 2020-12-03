const router = require('express').Router();
const { Cursos } = require('../models/cursos');
const { User } = require('../models/user');


module.exports = {
  users: require('./users'),
  cursos: require('./cursos'),
};