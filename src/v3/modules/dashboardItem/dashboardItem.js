const { DataTypes, Model } = require('sequelize');

const { Config, Database } = require('../../../../config');

const { MYSQL_DB_NAME_V3 } = Config.APPLICATION;

const sequelize = Database.Mysql.connect(MYSQL_DB_NAME_V3);

// const Functionality = require('../functionality/functionality');
const Wireframe = require('../wireframe/wireframe');

class DashboardItem extends Model { }

DashboardItem.init({
  // Model attributes are defined here
  id: {
    type: DataTypes.STRING(10),
    primaryKey: true,
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
  },
  // functionalityId: {
  //   type: DataTypes.STRING(10),
  //   defaultValue: null,
  //   allowNull: true,
  //   onUpdate: 'CASCADE',
  //   onDelete: 'CASCADE',
  //   references: {
  //     model: 'functionalities',
  //     key: 'id'
  //   }
  // },
  name: {
    type: DataTypes.STRING(50)
  },
  sequenceNumber: {
    type: DataTypes.INTEGER
  },
  wireframeId: {
    type: DataTypes.STRING(10),
    defaultValue: null,
    allowNull: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    references: {
      model: 'wireframes',
      key: 'id'
    }
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
  modelName: 'dashboard_item',
  timestamps: false
});

DashboardItem.belongsTo(Wireframe);

module.exports = DashboardItem;
