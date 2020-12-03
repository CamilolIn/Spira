const {db} =  require('../db') 
var Sequelize = require('sequelize');
var DataTypes = Sequelize.DataTypes;
const S = Sequelize;
const {User} = require('./user')
 

const Cursos = db.define('cursos', {
    name:{
      type: DataTypes.TEXT,
      allowNull: false,
      unique:true
    },
    intensidad: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

},{
  timestamps: false
});

User.belongsToMany(Cursos, { through: 'User_Curso' });
Cursos.belongsToMany(User, { through: 'User_Curso' });


module.exports = {Cursos}