/* eslint-disable no-unused-vars */
/* eslint-disable require-atomic-updates */
const { ResponseHandler } = require('../../handlers');
const { TE, to } = require('../../../helper');

const { ERROR, SUCCESS } = ResponseHandler;

const { setRecordsToCacheInternally } = require('../permissionMatrix/middleware');

const { Config, Database } = require('../../../../config');

const { MYSQL_DB_NAME_V3 } = Config.APPLICATION;

const sequelize = Database.Mysql.connect(MYSQL_DB_NAME_V3);

const AccessRight = require('../accessRights/access-right');
const Claster = require('../cluster/cluster');
const Role = require('../roles/role');
const functionality = require('../functionality/functionality');
const permissionMatrix = require('../permissionMatrix/permissionMatrix');
const User = require('../users/user');
const Dashboard = require('../dashboard/dashboard');
const DashboardItem = require('../dashboardItem/dashboardItem');
const MyDashboard = require('../myDashboard/myDashboard');
const MyDashboardItem = require('../myDashboardItem/myDashboardItem');
const Wireframe = require('../wireframe/wireframe');
const FunctionalityWireframe = require('../functionalityWireframe/functionalityWireframe');
const AnonymousUser = require('../anonymousUser/anonymousUser');
const ForntEndPortal = require('../frontEndPortal/forntEndPortal');
const BackendService = require('../backendService/backendService');
const ServiceModule = require('../serviceModule/serviceModule');
const SearchOperator = require('../searchOperator/searchOperator');
const SearchField = require('../searchField/searchField');
const WireframeSearchField = require('../wireframeAndSearchfield/wireframeAndSearchfield');
const ServiceModuleField = require('../serviceModuleField/serviceModuleField');
const { counter } = require('../../../counter');



module.exports = {


  generateViews: async () => {
    const viewResponseArray = [];
    try {
      //

      const [populated_users] = await sequelize.query(
        `CREATE OR REPLACE VIEW populated_users AS
          select
          u.id as id,
          u.name as name,
          u.userName as userName,
          u.email as email,
          u.camundaUserId as camundaUserId,u.active,
          u.firstName as firstName,
          u.lastName as lastName,
          u.displayName as displayName,
          u.phone as phone,
          u.password as password,
          u.preferredLanguage as preferredLanguage,
          u.profileImage as profileImage,
          u.jumpcloudGroupId as jumpcloudGroupId,
          r.id as roleId, r.name as roleName
          from users as u
          inner join roles as r on u.roleId = r.id;`);
      // console.log(populated_users);

      viewResponseArray.push('populated_users view created successfully.');


      const [permission_populateds] = await sequelize.query(
        `CREATE OR REPLACE VIEW populated_permissions AS
          select
          f.id as functionalityId, f.name as functionalityName,
          a.id as accessRightId, a.name as accessRightName,
          c.id as clusterId, c.name as clusterName,
          r.id as roleId, r.name as roleName,
          p.id as id, p.permission as permission
          from permission_matrices as p
          inner join functionalities as f on f.id = p.functionalityId
          inner join access_rights as a on a.id = p.accessRightId
          inner join clusters as c on c.id = p.clusterId
          inner join roles as r on r.id = p.roleId;`);
      // console.log(permission_populateds);

      viewResponseArray.push('permission_populateds view created successfully.');

      // const [populated_dashboard_items] = await sequelize.query(
      //   `CREATE OR REPLACE VIEW populated_dashboard_items AS
      //   Select 
      //   di.id as id,
      //   d.id as dashboardId,
      //   d.name as dashboardName,
      //   f.id as functionalityId,
      //   f.name as functionalityName,
      //   di.name as name,
      //   di.sequenceNumber as sequenceNumber,
      //   di.wireframe as wireframe,
      //   di.primaryScreenIndicator as primaryScreenIndicator,
      //   di.active as active
      //   from dashboard_items as di
      //   inner join functionalities as f on f.id = di.functionalityId
      //   inner join dashboards as d on d.id = di.dashboardId;`);
      // // console.log(populated_dashboard_items);

      const [populated_dashboard_items] = await sequelize.query(
        `CREATE OR REPLACE VIEW populated_dashboard_items AS
        Select 
        di.id as id,
        d.id as dashboardId,
        d.name as dashboardName,
        f.id as functionalityId,
        f.name as functionalityName,
        di.name as name,
        di.sequenceNumber as sequenceNumber,
        w.id as wireframeId,
        w.name as wireframeName,
        c.id as clusterId,
        c.name as clusterName,
        di.primaryScreenIndicator as primaryScreenIndicator,
        di.active as active,
        fp.id as frontEndPortalId,fp.name as frontEndPortalName
        from dashboard_items as di
        Left join wireframes as w on w.id = di.wireframeId
        Left join functionalities as f on f.id = w.functionalityId
        Left join clusters as c on c.id = w.clusterId
        inner join dashboards as d on d.id = di.dashboardId
        Left join front_end_portals as fp on fp.id = d.frontEndPortalId;`);
      // console.log(populated_dashboard_items);

      viewResponseArray.push('populated_dashboard_items view created successfully.');

      const [populated_my_dashboards] = await sequelize.query(
        `CREATE OR REPLACE VIEW populated_my_dashboards AS
        select
        u.id as userId, u.name as userName,
        r.id as roleId, r.name as roleName,
        d.id as dashboardId, d.name as dashboardName,d.icon as icon, d.active as dashboardActive,d.sequenceNumber as dashboardSequenceNumber,
        md.id as id, md.sequenceNumber,
        fp.id as frontEndPortalId,fp.name as frontEndPortalName
        from my_dashboards as md
        left join users as u on u.id = md.userId
        inner join dashboards as d on d.id = md.dashboardId
        Left join front_end_portals as fp on fp.id = d.frontEndPortalId
        left join roles as r on r.id = md.roleId;`);
      // console.log(populated_my_dashboards);

      viewResponseArray.push('populated_my_dashboards view created successfully.');

      const [populated_my_dashboard_items] = await sequelize.query(
        `CREATE OR REPLACE VIEW populated_my_dashboard_items AS
        Select 
        mdi.id as id,
        md.id as myDashboardId,
        mdi.dashboardItemId as dashboardItemId,
        di.name as dashboardItemName, di.active as dashboardItemActive,
        w.id as wireframeId,
        w.name as wireframeName,
        f.id as functionalityId,
        f.name as functionalityName,
        c.id as clusterId,
        c.name as clusterName,
        mdi.sequenceNumber as sequenceNumber,
        mdi.primaryScreenIndicator as primaryScreenIndicator,
        mdi.active as active,
        d.id as  dashboardId,
        d.name as myDashboardName,
        r.id as roleId,
        r.name as roleName,
        u.id as userId,
        u.name as userName,
        fp.id as frontEndPortalId,fp.name as frontEndPortalName
        from my_dashboard_items as mdi
        inner join dashboard_items as di on di.id = mdi.dashboardItemId
        left join wireframes as w on w.id = di.wireframeId
        left join functionalities as f on f.id = w.functionalityId
        Left join clusters as c on c.id = w.clusterId
        inner join my_dashboards as md on md.id = mdi.myDashboardId
        inner join dashboards as d on d.id = md.dashboardId
        Left join front_end_portals as fp on fp.id = d.frontEndPortalId
        left join roles as r on r.id = md.roleId
        left join users as u on u.id = md.userId;`);
      // console.log(populated_my_dashboard_items);

      viewResponseArray.push('populated_my_dashboard_items view created successfully.');

      const [populated_wireframes] = await sequelize.query(
        `CREATE OR REPLACE VIEW populated_wireframes AS
        Select 
        w.id as id,
        w.name as name,
        w.key,
        f.id as functionalityId,
        f.name as functionalityName,
        c.id as clusterId,
        c.name as clusterName
        from wireframes as w
        Left join functionalities as f on f.id = w.functionalityId
        Left join clusters as c on c.id = w.clusterId`);

      viewResponseArray.push('populated_wireframes view created successfully.');

      const [populated_clusters] = await sequelize.query(
        `CREATE OR REPLACE VIEW populated_clusters AS
        Select 
        c.id as id,
        c.name as name,
        c.description,
        fp.id as frontEndPortalId,
        fp.name as frontEndPortalName
        from clusters as c
        Left join front_end_portals as fp on fp.id = c.frontEndPortalId
        `);

      viewResponseArray.push('populated_clusters view created successfully.');

      const [populated_dashboards] = await sequelize.query(
        `CREATE OR REPLACE VIEW populated_dashboards AS
        Select 
        d.id as id,
        d.name as name,
        d.icon,d.sequenceNumber,d.active,
        fp.id as frontEndPortalId,
        fp.name as frontEndPortalName
        from dashboards as d
        Left join front_end_portals as fp on fp.id = d.frontEndPortalId
        `);

      viewResponseArray.push('populated_clusters view created successfully.');

      const [populated_backend_servce] = await sequelize.query(
        `CREATE OR REPLACE VIEW populated_backend_services AS
        Select 
        bs.id, bs.name, bs.description,
        c.id as clusterId,
        c.name as clusterName,
        fp.id as frontEndPortalId,
        fp.name as frontEndPortalName
        from backend_services as bs
        Left join clusters as c on c.id = bs.clusterId
        Left join front_end_portals as fp on fp.id = c.frontEndPortalId
        `);

      viewResponseArray.push('populated_backend_services view created successfully.');

      const [populated_service_module] = await sequelize.query(
        `CREATE OR REPLACE VIEW populated_service_modules AS
        Select 
        sm.id, sm.name,
        bs.id as backendServiceId,
        bs.name as backendServiceName
        from service_modules as sm
        Left join backend_services as bs on bs.id = sm.backendServiceId
        `);

      viewResponseArray.push('populated_service_modules view created successfully.');

      const [populated_service_module_field] = await sequelize.query(
        `CREATE OR REPLACE VIEW populated_service_module_fields AS
        Select 
        smf.id, smf.name, smf.displayName,smf.isNeedToDisplay,
        sm.id as serviceModuleId, sm.name as serviceModuleName,
        bs.id as backendServiceId,
        bs.name as backendServiceName
        from service_module_fields as smf
        Left join service_modules as sm on sm.id = smf.serviceModuleId
        Left join backend_services as bs on bs.id = sm.backendServiceId
        `);

      viewResponseArray.push('populated_service_modules view created successfully.');

      const [populated_search_filed] = await sequelize.query(
        `CREATE OR REPLACE VIEW populated_search_fields AS
        Select 
        sf.id,sf.name,
        fp.id as frontEndPortalId,
        fp.name as frontEndPortalName,
        c.id as clusterId,
        c.name as clusterName,
        bs.id as backendServiceId,
        bs.name as backendServiceName,
        sm.id serviceModuleId,
        sm.name serviceModuleName
        from search_fields as sf
        inner join service_modules as sm on sm.id = sf.serviceModuleId
        Left join backend_services as bs on bs.id = sm.backendServiceId
        Left join clusters as c on c.id = bs.clusterId
        Left join front_end_portals as fp on fp.id = c.frontEndPortalId
        `);

      viewResponseArray.push('populated_service_modules view created successfully.');

      // const [populated_wireframe_and_search_field] = await sequelize.query(
      //   `CREATE OR REPLACE VIEW populated_wireframe_and_search_fields AS
      //   Select
      //   wsf.id, wsf.displayName, wsf.active, 
      //   sf.id as searchFieldId,sf.name as searchFieldName,
      //   so.id as searchOperatorId, so.name as searchOperatorName,
      //   fp.id as frontEndPortalId,
      //   fp.name as frontEndPortalName,
      //   c.id as clusterId,
      //   c.name as clusterName,
      //   bs.id as backendServiceId,
      //   bs.name as backendServiceName,
      //   sm.id serviceModuleId,
      //   sm.name serviceModuleName,
      //   w.id as wireframeId, w.name as wireframeName
      //   from wireframe_and_search_fields as wsf
      //   left join search_operators as so on so.id = wsf.searchOperatorId
      //   left join search_fields as sf on sf.id = wsf.searchFieldId
      //   left join service_modules as sm on sm.id = sf.serviceModuleId
      //   Left join backend_services as bs on bs.id = sm.backendServiceId
      //   Left join clusters as c on c.id = bs.clusterId
      //   Left join front_end_portals as fp on fp.id = c.frontEndPortalId
      //   Left join wireframes as w on w.id = wsf.wireframeId
      //   `);


      const [populated_wireframe_and_search_field] = await sequelize.query(
        `CREATE OR REPLACE VIEW populated_wireframe_and_search_fields AS
        Select
        wsf.id, wsf.displayName, wsf.active, 
        sf.id as searchFieldId,sf.name as searchFieldName,
        fp.id as frontEndPortalId,
        fp.name as frontEndPortalName,
        c.id as clusterId,
        c.name as clusterName,
        bs.id as backendServiceId,
        bs.name as backendServiceName,
        sm.id serviceModuleId,
        sm.name serviceModuleName,
        w.id as wireframeId, w.name as wireframeName
        from wireframe_and_search_fields as wsf
        left join search_fields as sf on sf.id = wsf.searchFieldId
        left join service_modules as sm on sm.id = sf.serviceModuleId
        Left join backend_services as bs on bs.id = sm.backendServiceId
        Left join clusters as c on c.id = bs.clusterId
        Left join front_end_portals as fp on fp.id = c.frontEndPortalId
        Left join wireframes as w on w.id = wsf.wireframeId
        `);

      viewResponseArray.push('populated_wireframe_and_search_fields view created successfully.');

      setRecordsToCacheInternally();

    } catch (error) {
      console.log(error);

    }
  },


  generateTables: async () => {
    try {

      await counter.sync();
      await ForntEndPortal.sync();
      await AnonymousUser.sync();
      await AccessRight.sync();
      await Claster.sync({ alter: true });
      await Role.sync();
      await functionality.sync();
      await User.sync({ alter: true });
      await permissionMatrix.sync();
      await Wireframe.sync();
      await FunctionalityWireframe.sync();
      await Dashboard.sync({ alter: true });
      await DashboardItem.sync();
      await MyDashboard.sync({ alter: true });
      await MyDashboardItem.sync();
      await BackendService.sync({ alter: true });
      await ServiceModule.sync();
      await SearchOperator.sync();
      await SearchField.sync();
      await ServiceModuleField.sync({ alter: true });
      await WireframeSearchField.sync({ alter: true });




    } catch (error) {
      console.log(error);
    }
  }


};