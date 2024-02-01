const { DataTypes, Model } = require('sequelize');


const { Config, Database } = require('../../../../config');

const { MYSQL_DB_NAME_V3 } = Config.APPLICATION;

const sequelize = Database.Mysql.connect(MYSQL_DB_NAME_V3);

class Functionality extends Model { }

Functionality.init({
  // Model attributes are defined here
  id: {
    type: DataTypes.STRING(10),
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(100)
  },
  description: {
    type: DataTypes.STRING(50)
  }
}, {
  sequelize,
  modelName: 'functionality',
  timestamps: false
});

module.exports = Functionality;
