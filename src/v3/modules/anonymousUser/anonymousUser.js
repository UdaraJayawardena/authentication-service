const { DataTypes, Model } = require('sequelize');

const { Config, Database } = require('../../../../config');

const { MYSQL_DB_NAME_V3 } = Config.APPLICATION;

const sequelize = Database.Mysql.connect(MYSQL_DB_NAME_V3);

class AnonymousUser extends Model { }

AnonymousUser.init({
  // Model attributes are defined here
  id: {
    type: DataTypes.STRING(10),
    primaryKey: true,
    unique: true,
    allowNull: false
  },
  firstName: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  lastName: {
    type: DataTypes.STRING(50),
    unique: true,
    allowNull: false
  },
  permissionKey: {
    type: DataTypes.STRING(100),
    unique: true,
    allowNull: false
  },
  userName: {
    type: DataTypes.STRING(50),
    unique: true,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(100),
    unique: true
  },
  organization: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('active', 'in-active', 'deleted'),
    defaultValue: 'active'
  },
  discription: {
    type: DataTypes.STRING(100)
  },
  camundaUserId: {
    type: DataTypes.STRING(100),
    unique: true,
    allowNull: false
  },
  camundaPassword: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
}, {
  sequelize,
  modelName: 'anonymous_user',
  timestamps: false
});


module.exports = AnonymousUser;
