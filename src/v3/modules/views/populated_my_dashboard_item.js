const { DataTypes, Model } = require('sequelize');

const { Config, Database } = require('../../../../config');

const { MYSQL_DB_NAME_V3 } = Config.APPLICATION;

const sequelize = Database.Mysql.connect(MYSQL_DB_NAME_V3);

class Populated_my_dashboard_Items extends Model { }

Populated_my_dashboard_Items.init({
  // Model attributes are defined here
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  myDashboardId: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: 'my_dashboard',
      key: 'id'
    }
  },
  dashboardItemId: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: 'dashboard_item',
      key: 'id'
    }
  },
  dashboardItemName: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: 'dashboard_item',
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
  sequenceNumber: {
    type: DataTypes.INTEGER
  },
  primaryScreenIndicator: {
    type: DataTypes.BOOLEAN
  },
  active: {
    type: DataTypes.BOOLEAN
  },
  dashboardItemActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    references: {
      model: 'dashboard_item',
      key: 'active'
    }
  },
  dashboardId: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: 'dashboard',
      key: 'id'
    }
  },
  myDashboardName: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: 'dashboard',
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
  userId: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: 'user',
      key: 'id'
    }
  },
  userName: {
    type: DataTypes.STRING,
    allowNull: false,
    references: {
      model: 'user',
      key: 'name'
    }
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
  modelName: 'populated_my_dashboard_item',
  timestamps: false
});

module.exports = Populated_my_dashboard_Items;
