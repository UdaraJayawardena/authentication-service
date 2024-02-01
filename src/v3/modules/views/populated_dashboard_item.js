const { DataTypes, Model } = require('sequelize');

const { Config, Database } = require('../../../../config');

const { MYSQL_DB_NAME_V3 } = Config.APPLICATION;

const sequelize = Database.Mysql.connect(MYSQL_DB_NAME_V3);

class Populated_dashboard_Items extends Model { }

Populated_dashboard_Items.init({
  // Model attributes are defined here
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  dashboardId: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: 'dashboard',
      key: 'id'
    }
  },
  dashboardName: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: 'dashboard',
      key: 'name'
    }
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
  name: {
    type: DataTypes.STRING
  },
  sequenceNumber: {
    type: DataTypes.INTEGER
  },
  wireframeId: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: 'wireframe',
      key: 'id'
    }
  },
  wireframeName: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: 'wireframe',
      key: 'name'
    }
  },
  primaryScreenIndicator: {
    type: DataTypes.BOOLEAN
  },
  active: {
    type: DataTypes.BOOLEAN
  },
  frontEndPortalId: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: 'front_end_portal',
      key: 'id'
    }
  },
  frontEndPortalName: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: 'front_end_portal',
      key: 'name'
    }
  }

}, {
  sequelize,
  modelName: 'populated_dashboard_item',
  timestamps: false
});

module.exports = Populated_dashboard_Items;
