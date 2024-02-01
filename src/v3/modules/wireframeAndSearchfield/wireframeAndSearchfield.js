const { DataTypes, Model } = require('sequelize');

const { Config, Database } = require('../../../../config');

const { MYSQL_DB_NAME_V3 } = Config.APPLICATION;

const sequelize = Database.Mysql.connect(MYSQL_DB_NAME_V3);

class WireframeAndSearchField extends Model { }

WireframeAndSearchField.init({
  // Model attributes are defined here
  id: {
    type: DataTypes.STRING(10),
    primaryKey: true,
  },
  displayName: {
    type: DataTypes.STRING(50)
  },
  wireframeId: {
    type: DataTypes.STRING(10),
    allowNull: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    references: {
      model: 'wireframes',
      key: 'id'
    }
  },
  searchFieldId: {
    type: DataTypes.STRING(10),
    allowNull: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    references: {
      model: 'search_fields',
      key: 'id'
    }
  },
  // searchOperatorId: {
  //   type: DataTypes.STRING(10),
  //   allowNull: true,
  //   onUpdate: 'CASCADE',
  //   onDelete: 'CASCADE',
  //   references: {
  //     model: 'search_operators',
  //     key: 'id'
  //   }
  // },
  active: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  sequelize,
  modelName: 'wireframe_and_search_field',
  timestamps: false
});

module.exports = WireframeAndSearchField;
