const { DataTypes, Model } = require('sequelize');

const { Config, Database } = require('../../../../config');

const { MYSQL_DB_NAME_V3 } = Config.APPLICATION;

const sequelize = Database.Mysql.connect(MYSQL_DB_NAME_V3);

class MyDashboard extends Model { }

MyDashboard.init({
  // Model attributes are defined here
  id: {
    type: DataTypes.STRING(10),
    primaryKey: true,
  },
  roleId: {
    type: DataTypes.STRING(10),
    allowNull: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    references: {
      model: 'roles',
      key: 'id'
    }
  },
  sequenceNumber: {
    type: DataTypes.INTEGER
  },
  userId: {
    type: DataTypes.STRING(10),
    allowNull: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    references: {
      model: 'users',
      key: 'id'
    }
  },
  dashboardId: {
    type: DataTypes.STRING(10),
    allowNull: false,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    references: {
      model: 'dashboards',
      key: 'id'
    }
  }
}, {
  sequelize,
  modelName: 'my_dashboard',
  timestamps: false
});

module.exports = MyDashboard;
