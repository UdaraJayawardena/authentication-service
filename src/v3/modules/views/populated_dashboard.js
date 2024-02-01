const { DataTypes, Model } = require('sequelize');

const { Config, Database } = require('../../../../config');

const { MYSQL_DB_NAME_V3 } = Config.APPLICATION;

const sequelize = Database.Mysql.connect(MYSQL_DB_NAME_V3);

class Populated_dashboard extends Model { }

Populated_dashboard.init({
  // Model attributes are defined here
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  icon: {
    type: DataTypes.STRING
  },
  name: {
    type: DataTypes.STRING
  },
  sequenceNumber: {
    type: DataTypes.STRING
  },
  active: {
    type: DataTypes.BOOLEAN
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
  modelName: 'populated_dashboard',
  timestamps: false
});

module.exports = Populated_dashboard;
