const { DataTypes, Model } = require('sequelize');

const { Config, Database } = require('../../../../config');

const { MYSQL_DB_NAME_V3 } = Config.APPLICATION;

const sequelize = Database.Mysql.connect(MYSQL_DB_NAME_V3);

class Populated_service_module_field extends Model { }

Populated_service_module_field.init({
  // Model attributes are defined here
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING
  },
  displayName: {
    type: DataTypes.STRING
  },
  serviceModuleId: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: 'service_module',
      key: 'id'
    }
  },
  serviceModuleName: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: 'service_module',
      key: 'name'
    }
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
  },
  isNeedToDisplay: {
    type: DataTypes.BOOLEAN
  }
}, {
  sequelize,
  modelName: 'populated_service_module_field',
  timestamps: false
});

module.exports = Populated_service_module_field;
