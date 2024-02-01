const { DataTypes, Model } = require('sequelize');

const { Config, Database } = require('../../../../config');

const { MYSQL_DB_NAME_V3 } = Config.APPLICATION;

const sequelize = Database.Mysql.connect(MYSQL_DB_NAME_V3);

class Populated_backend_service extends Model { }

Populated_backend_service.init({
  // Model attributes are defined here
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING
  },
  description: {
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
  }
}, {
  sequelize,
  modelName: 'populated_backend_service',
  timestamps: false
});

module.exports = Populated_backend_service;
