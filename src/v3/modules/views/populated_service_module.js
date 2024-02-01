const { DataTypes, Model } = require('sequelize');

const { Config, Database } = require('../../../../config');

const { MYSQL_DB_NAME_V3 } = Config.APPLICATION;

const sequelize = Database.Mysql.connect(MYSQL_DB_NAME_V3);

class Populated_service_module extends Model { }

Populated_service_module.init({
  // Model attributes are defined here
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING
  },
  backendServiceId: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: 'backend_service',
      key: 'id'
    }
  },
  backendServiceName: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: 'backend_service',
      key: 'name'
    }
  }
}, {
  sequelize,
  modelName: 'populated_service_module',
  timestamps: false
});

module.exports = Populated_service_module;
