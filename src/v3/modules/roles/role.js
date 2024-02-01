const { DataTypes, Model } = require('sequelize');

const { Config, Database } = require('../../../../config');

const { MYSQL_DB_NAME_V3 } = Config.APPLICATION;

const sequelize = Database.Mysql.connect(MYSQL_DB_NAME_V3);

class Role extends Model { }

Role.init({
  // Model attributes are defined here
  id: {
    type: DataTypes.STRING(10),
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(45)
  },
  description: {
    type: DataTypes.STRING(50)
  }
}, {
  sequelize,
  modelName: 'role',
  timestamps: false
});

module.exports = Role;
