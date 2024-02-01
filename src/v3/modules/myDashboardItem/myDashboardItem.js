const { DataTypes, Model } = require('sequelize');

const { Config, Database } = require('../../../../config');

const { MYSQL_DB_NAME_V3 } = Config.APPLICATION;

const sequelize = Database.Mysql.connect(MYSQL_DB_NAME_V3);

class MyDashboardItem extends Model { }

MyDashboardItem.init({
  // Model attributes are defined here
  id: {
    type: DataTypes.STRING(10),
    primaryKey: true,
  },
  myDashboardId: {
    type: DataTypes.STRING(10),
    allowNull: false,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    references: {
      model: 'my_dashboards',
      key: 'id'
    }
  },
  // functionalityId: {
  //   type: DataTypes.STRING(10),
  //   allowNull: true,
  //   onUpdate: 'CASCADE',
  //   onDelete: 'CASCADE',
  //   references: {
  //     model: 'functionalities',
  //     key: 'id'
  //   }
  // },
  dashboardItemId: {
    type: DataTypes.STRING(10),
    allowNull: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    references: {
      model: 'dashboard_items',
      key: 'id'
    }
  },
  sequenceNumber: {
    type: DataTypes.INTEGER
  },
  primaryScreenIndicator: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  sequelize,
  modelName: 'my_dashboard_item',
  timestamps: false
});

module.exports = MyDashboardItem;
