const { DataTypes, Model } = require('sequelize');

const { Config, Database } = require('../../../../config');

const { MYSQL_DB_NAME_V3 } = Config.APPLICATION;

const sequelize = Database.Mysql.connect(MYSQL_DB_NAME_V3);

class FrontEndPortal extends Model { }

FrontEndPortal.init({
  // Model attributes are defined here
  id: {
    type: DataTypes.STRING(10),
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(100)
  },
  key: {
    type: DataTypes.STRING(50)
  }
}, {
  sequelize,
  modelName: 'front_end_portal',
  timestamps: false
});


module.exports = FrontEndPortal;
