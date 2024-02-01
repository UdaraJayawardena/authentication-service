const { DataTypes, Model } = require('sequelize');

const { Config, Database } = require('../../../../config');

const { MYSQL_DB_NAME_V3 } = Config.APPLICATION;

const sequelize = Database.Mysql.connect(MYSQL_DB_NAME_V3);

class Dashboard extends Model { }

Dashboard.init({
  // Model attributes are defined here
  id: {
    type: DataTypes.STRING(10),
    primaryKey: true,
  },
  icon: {
    type: DataTypes.STRING(50)
  },
  name: {
    type: DataTypes.STRING(50)
  },
  sequenceNumber: {
    type: DataTypes.INTEGER
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
  },
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  sequelize,
  modelName: 'dashboard',
  timestamps: false
});


module.exports = Dashboard;
