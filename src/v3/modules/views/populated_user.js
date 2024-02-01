const { DataTypes, Model } = require('sequelize');

const { Config, Database } = require('../../../../config');

const { MYSQL_DB_NAME_V3 } = Config.APPLICATION;

const sequelize = Database.Mysql.connect(MYSQL_DB_NAME_V3);

class populated_user extends Model { }

populated_user.init({
  // Model attributes are defined here
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING
  },
  camundaUserId: {
    type: DataTypes.STRING
  },
  userName: {
    type: DataTypes.STRING
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true
  },
  roleId: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: 'roles',
      key: 'id'
    }
  },
  roleName: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: 'roles',
      key: 'name'
    }
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: true
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: true
  },
  displayName: {
    type: DataTypes.STRING,
    allowNull: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: true
  },
  preferredLanguage: {
    type: DataTypes.STRING,
    allowNull: true
  },
  profileImage: {
    type: DataTypes.STRING,
    allowNull: true
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  active: {
    type: DataTypes.BOOLEAN
  },
  jumpcloudGroupId: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'populated_user',
  timestamps: false
});

module.exports = populated_user;
