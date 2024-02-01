const { DataTypes, Model } = require('sequelize');

const { Config, Database } = require('../../../../config');

const { MYSQL_DB_NAME_V3 } = Config.APPLICATION;

const sequelize = Database.Mysql.connect(MYSQL_DB_NAME_V3);

class BackendService extends Model { }

BackendService.init({
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
  // frontEndPortalId: {
  //   type: DataTypes.STRING(10),
  //   allowNull: true,
  //   onUpdate: 'CASCADE',
  //   onDelete: 'SET NULL',
  //   references: {
  //     model: 'front_end_portals',
  //     key: 'id'
  //   }
  // },
  clusterId: {
    type: DataTypes.STRING(10),
    allowNull: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    references: {
      model: 'clusters',
      key: 'id'
    }
  }
}, {
  sequelize,
  modelName: 'backend_service',
  timestamps: false
});

module.exports = BackendService;
