const { DataTypes, Model } = require('sequelize');

const { Config, Database } = require('../../../../config');

const { MYSQL_DB_NAME_V3 } = Config.APPLICATION;

const sequelize = Database.Mysql.connect(MYSQL_DB_NAME_V3);

class Populated_clusters extends Model { }

Populated_clusters.init({
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
  }
}, {
  sequelize,
  modelName: 'populated_cluster',
  timestamps: false
});

module.exports = Populated_clusters;
