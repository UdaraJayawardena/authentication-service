const { DataTypes, Model } = require('sequelize');

const { Config, Database } = require('../../../../config');

const { MYSQL_DB_NAME_V3 } = Config.APPLICATION;

const sequelize = Database.Mysql.connect(MYSQL_DB_NAME_V3);

class Populated_wireframes extends Model { }

Populated_wireframes.init({
  // Model attributes are defined here
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING
  },
  key: {
    type: DataTypes.STRING
  },
  functionalityId: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: 'functionality',
      key: 'id'
    }
  },
  functionalityName: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: 'functionality',
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
  modelName: 'populated_wireframe',
  timestamps: false
});

module.exports = Populated_wireframes;
