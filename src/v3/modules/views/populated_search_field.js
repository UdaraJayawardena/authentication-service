const { DataTypes, Model } = require('sequelize');

const { Config, Database } = require('../../../../config');

const { MYSQL_DB_NAME_V3 } = Config.APPLICATION;

const sequelize = Database.Mysql.connect(MYSQL_DB_NAME_V3);

class Populated_search_field extends Model { }

Populated_search_field.init({
  // Model attributes are defined here
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING
  },
  frontEndPortalId: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: 'front_end_portal',
      key: 'id'
    }
  },
  frontEndPortalName: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: 'front_end_portal',
      key: 'name'
    }
  },
  clusterId: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: 'cluster',
      key: 'id'
    }
  },
  clusterName: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: 'cluster',
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
  }
}, {
  sequelize,
  modelName: 'populated_search_field',
  timestamps: false
});

module.exports = Populated_search_field;
