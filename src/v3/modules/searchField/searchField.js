const { DataTypes, Model } = require('sequelize');

const { Config, Database } = require('../../../../config');

const { MYSQL_DB_NAME_V3 } = Config.APPLICATION;

const sequelize = Database.Mysql.connect(MYSQL_DB_NAME_V3);

class SearchField extends Model { }

SearchField.init({
  // Model attributes are defined here
  id: {
    type: DataTypes.STRING(10),
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING(45)
  },
  serviceModuleId: {
    type: DataTypes.STRING(10),
    allowNull: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    references: {
      model: 'service_modules',
      key: 'id'
    }
  }
}, {
  sequelize,
  modelName: 'search_field',
  timestamps: false
});

module.exports = SearchField;
