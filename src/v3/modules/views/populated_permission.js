const { DataTypes, Model } = require('sequelize');

const { Config, Database } = require('../../../../config');

const { MYSQL_DB_NAME_V3 } = Config.APPLICATION;

const sequelize = Database.Mysql.connect(MYSQL_DB_NAME_V3);

class PopulatedPermission extends Model { }

PopulatedPermission.init({
  // Model attributes are defined here
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
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
  accessRightId: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: 'accessRight',
      key: 'id'
    }
  },
  accessRightName: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: 'accessRight',
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
  },
  roleId: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: 'role',
      key: 'id'
    }
  },
  roleName: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: 'role',
      key: 'name'
    }
  },
  permission: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  sequelize,
  modelName: 'populated_permissions',
  timestamps: false
});

module.exports = PopulatedPermission;
