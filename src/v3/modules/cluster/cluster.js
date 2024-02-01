const { DataTypes, Model } = require('sequelize');

const { Config, Database } = require('../../../../config');

const { MYSQL_DB_NAME_V3 } = Config.APPLICATION;

const sequelize = Database.Mysql.connect(MYSQL_DB_NAME_V3);

class Cluster extends Model { }

Cluster.init({
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
  },
  frontEndPortalId: {
    type: DataTypes.STRING(10),
    allowNull: true,
    onUpdate: 'CASCADE',
    onDelete: 'SET NULL',
    references: {
      model: 'front_end_portals',
      key: 'id'
    }
  }
}, {
  sequelize,
  modelName: 'cluster',
  timestamps: false
});

module.exports = Cluster;
