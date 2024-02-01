const { DataTypes, Model } = require('sequelize');

const { Config, Database } = require('../../../../config');

const { MYSQL_DB_NAME_V3 } = Config.APPLICATION;

const sequelize = Database.Mysql.connect(MYSQL_DB_NAME_V3);

class Wireframe extends Model { }

Wireframe.init({
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
  },
  functionalityId: {
    type: DataTypes.STRING(10),
    allowNull: true,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
    references: {
      model: 'functionalities',
      key: 'id'
    }
  },
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
  modelName: 'wireframe',
  timestamps: false
});


module.exports = Wireframe;
