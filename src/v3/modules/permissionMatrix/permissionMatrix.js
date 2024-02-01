const { DataTypes, Model } = require('sequelize');

const { Config, Database } = require('../../../../config');

const { MYSQL_DB_NAME_V3 } = Config.APPLICATION;

const sequelize = Database.Mysql.connect(MYSQL_DB_NAME_V3);

const Role = require('../roles/role');
const Functionality = require('../functionality/functionality');
const AccessRight = require('../accessRights/access-right');
const cluster = require('../cluster/cluster');


class PermissionMatrix extends Model { }

PermissionMatrix.init({
  // Model attributes are defined here
  id: {
    type: DataTypes.STRING(10),
    primaryKey: true,
  },
  functionalityId: {
    type: DataTypes.STRING(10),
    allowNull: false,
    references: {
      model: 'functionalities',
      key: 'id'
    }
  },
  accessRightId: {
    type: DataTypes.STRING(10),
    allowNull: false,
    references: {
      model: 'access_rights',
      key: 'id'
    }
  },
  clusterId: {
    type: DataTypes.STRING(10),
    allowNull: false,
    references: {
      model: 'clusters',
      key: 'id'
    }
  },
  roleId: {
    type: DataTypes.STRING(10),
    allowNull: false,
    references: {
      model: 'roles',
      key: 'id'
    }
  },
  permission: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }

}, {
  sequelize,
  modelName: 'permission_matrix',
  timestamps: false
});

PermissionMatrix.belongsTo(Role);
PermissionMatrix.belongsTo(Functionality);
PermissionMatrix.belongsTo(AccessRight);
PermissionMatrix.belongsTo(cluster);

module.exports = PermissionMatrix;
