const { DataTypes, Model } = require('sequelize');

const { Config, Database } = require('../../../../config');

const { MYSQL_DB_NAME_V3 } = Config.APPLICATION;

const sequelize = Database.Mysql.connect(MYSQL_DB_NAME_V3);

const Role = require('../roles/role');

class User extends Model { }

User.init({
  // Model attributes are defined here
  id: {
    type: DataTypes.STRING(10),
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(255),
  },
  camundaUserId: {
    type: DataTypes.STRING(50)
  },
  userName: {
    type: DataTypes.STRING(20)
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  roleId: {
    type: DataTypes.STRING(10),
    allowNull: false,
    references: {
      model: 'roles',
      key: 'id'
    }
  },
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  firstName: {
    type: DataTypes.STRING(100),
  },
  lastName: {
    type: DataTypes.STRING(100),
  },
  phone: {
    type: DataTypes.STRING(10),
    allowNull: true
  },
  displayName: {
    type: DataTypes.STRING(100),
  },
  profileImage: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  preferredLanguage: {
    type: DataTypes.STRING(3),
  },
  password: {
    type: DataTypes.STRING(50),
  },
  jumpcloudGroupId: {
    type: DataTypes.STRING(50),
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'user',
  timestamps: false
});

User.belongsTo(Role);
// User.belongsTo(Role, {
//   through: 'role',
//   as: 'role',
//   foreignKey: 'roleId'
// });

module.exports = User;
