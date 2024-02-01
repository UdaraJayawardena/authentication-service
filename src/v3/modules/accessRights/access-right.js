const { DataTypes, Model } = require('sequelize');

const { Config, Database } = require('../../../../config');

const { MYSQL_DB_NAME_V3 } = Config.APPLICATION;

const sequelize = Database.Mysql.connect(MYSQL_DB_NAME_V3);

class AccessRight extends Model { }

AccessRight.init({
  // Model attributes are defined here
  id: {
    type: DataTypes.STRING(10),
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(30)
  },
  description: {
    type: DataTypes.STRING(50)
  }
}, {
  sequelize,
  modelName: 'access_right',
  timestamps: false
});


module.exports = AccessRight;
