const {db} =  require('../db') 
var Sequelize = require('sequelize');
var DataTypes = Sequelize.DataTypes;
const S = Sequelize;


const User = db.define('users', {
    name:{
        type: DataTypes.TEXT,
        allowNull: false
      },
    email: {
        type: DataTypes.TEXT,
        validate:{
          isEmail: true
        },
        allowNull: false,
        unique: true
      },
    phone:{
          type: DataTypes.TEXT,
          allowNull: false
      },
    password:{
          type: DataTypes.TEXT,
          allowNull: false
      },
    role: {
        type: DataTypes.ENUM('user', 'admin',),
        defaultValue: 'user',
        allowNull: false,
    },
},{
  timestamps: false
});


module.exports = {User}