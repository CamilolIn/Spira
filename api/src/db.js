var Sequelize = require('sequelize');
var DataTypes = Sequelize.DataTypes;
const S = Sequelize;
var db = new Sequelize('postgres://postgres:102627912ca@localhost:5433/spira', {
  logging: false,
});

module.exports = {db}
