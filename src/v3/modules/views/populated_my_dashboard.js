const { DataTypes, Model } = require('sequelize');

const { Config, Database } = require('../../../../config');

const { MYSQL_DB_NAME_V3 } = Config.APPLICATION;

const sequelize = Database.Mysql.connect(MYSQL_DB_NAME_V3);

class Populated_my_dashboard extends Model { }

Populated_my_dashboard.init({
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
  icon: {
    type: DataTypes.STRING(50),
    allowNull: false,
    references: {
      model: 'dashboard',
      key: 'icon'
    }
  },
  dashboardActive: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    references: {
      model: 'dashboard',
      key: 'active'
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
  sequenceNumber: {
    type: DataTypes.INTEGER
  },
  dashboardSequenceNumber: {
    type: DataTypes.INTEGER
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
  modelName: 'populated_my_dashboard',
  timestamps: false
});

module.exports = Populated_my_dashboard;
