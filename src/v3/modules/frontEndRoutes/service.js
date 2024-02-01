/* eslint-disable no-nested-ternary */
/* eslint-disable prefer-const */
/* eslint-disable no-unused-vars */
/* eslint-disable quotes */
const FrontEndRoute = require('./ClusterwiseRotues');
const { isNullOrEmpty } = require('../../../../lib/utility');
const dashboardDatabase = require('../../modules/myDashboard/database');
const clusterDatabase = require('../../modules/cluster/database');
const { route } = require('./routes');

const _checkRoutePermission = (routes, permissions) => {

  const permittedRotues = [];

  for (const route of routes) {
    if (!isNullOrEmpty(route.permission)) {
      const selectedPermission = permissions.find(permission => (permission.functionality === route.permission && permission.accessRight === 'View'));
      if (isNullOrEmpty(selectedPermission)) continue;
      if (!selectedPermission.permission) continue;
    }
    if (route.children) {
      route.children = _checkRoutePermission(route.children, permissions);
      if (route.children.length === 0 && isNullOrEmpty(route.component)) continue;
    }
    permittedRotues.push(route);
  }
  return permittedRotues;
};

const filterPermittedRoutes = (routes, permissions) => {

  let filterdRoutes = [];

  if (permissions) {
    filterdRoutes = filterdRoutes.concat(_checkRoutePermission(routes, permissions));
  }
  else {
    filterdRoutes = routes;
  }

  return filterdRoutes;
};

// eslint-disable-next-line complexity
const getDashboardRoutes = async (req, cluster, permissions) => {
  const routes = [];
  const dashboardFindQuery = { where: { dashboardActive: true } };
  if (req.user) {
    if (req.user.role) dashboardFindQuery.where.roleName = req.user.role;
    if (req.user.userId) {
      dashboardFindQuery.where.userId = req.user.userId;
    } else {
      dashboardFindQuery.where.userId = null;
    }
  }

  // get cluster related portal
  const clusterDetails = await clusterDatabase.findByQuery({ where: { name: cluster } });
  if (clusterDetails.length > 0) {
    const relatedCluster = clusterDetails[0];
    if (relatedCluster.frontEndPortalId) {
      dashboardFindQuery.where.frontEndPortalId = relatedCluster.frontEndPortalId;
    }
  }

  const dashboards = await dashboardDatabase.findByQuery(dashboardFindQuery);
  dashboards.sort((a, b) => a.sequenceNumber < b.sequenceNumber ? -1 : 1);

  // set route cluster name
  let culsterName = '';
  if (cluster == 'BF_Loan_Management' || cluster == 'BF_Initiation' || cluster == 'BF_CRM') {
    culsterName = 'CRM';
  } else if (cluster == 'BF_Foundation') {
    culsterName = 'FoundationManagement';
  } else if (cluster == 'BF_Funders') {
    culsterName = 'FunderManagement';
  }

  for (let i = 0; i < dashboards.length; i++) {
    const singleDashboard = dashboards[i];

    const obj = {
      children: null,
      cluster: culsterName,
      component: 'GenericTabContainer',
      hide: false,
      icon: singleDashboard.icon,
      layout: "/user",
      name: singleDashboard.dashboardName,
      path: `/${singleDashboard.dashboardName}`,
      rtlName: ""
    };

    routes.push(obj);

  }

  let userSideChildrenRoutes = [];
  let adminSideChildrenRoutes = [];

  const userSideOtherDashboard = {
    cluster: culsterName,
    hide: false,
    icon: 'Beenhere',
    layout: "/user",
    name: 'Other',
    rtlName: "",
    children: null
  };

  const adminSideOtherDashboard = {
    cluster: culsterName,
    hide: false,
    icon: 'Beenhere',
    layout: "/admin",
    name: 'Other',
    rtlName: "",
    children: null
  };

  if (cluster == 'BF_Loan_Management' || cluster == 'BF_Initiation' || cluster == 'BF_CRM') {
    // need to add Other dashboard  for user side and admin side

    // CRM routes
    if (FrontEndRoute.CRMRoutes && FrontEndRoute.CRMRoutes.length > 0) {
      // CRM user routes available
      userSideChildrenRoutes.push(FrontEndRoute.CRMRoutes[0]);
      if (FrontEndRoute.CRMRoutes.length > 1) {
        adminSideChildrenRoutes.push(FrontEndRoute.CRMRoutes[1]);
      }
    }


    // Loan initation 
    if (FrontEndRoute.LoanInitiationRoutes && FrontEndRoute.LoanInitiationRoutes.length > 0) {
      // Loan initation  user routes available
      userSideChildrenRoutes.push(FrontEndRoute.LoanInitiationRoutes[0]);
      if (FrontEndRoute.LoanInitiationRoutes.length > 1) {
        adminSideChildrenRoutes.push(FrontEndRoute.LoanInitiationRoutes[1]);
      }
    }


    // Loan management 
    if (FrontEndRoute.LoanManagementRoutes && FrontEndRoute.LoanManagementRoutes.length > 0) {
      // Loan management user routes available
      userSideChildrenRoutes.push(FrontEndRoute.LoanManagementRoutes[0]);
      if (FrontEndRoute.LoanManagementRoutes.length > 1) {
        adminSideChildrenRoutes.push(FrontEndRoute.LoanManagementRoutes[1]);
      }
    }

  }

  if (cluster == 'BF_Foundation') {
    // need to add Other dashboard  for user side and admin side
    // Bridgefun foundation routes
    if (FrontEndRoute.FoundationManagementRoutes && FrontEndRoute.FoundationManagementRoutes.length > 0) {
      // Bridgefun foundation user or admin routes available
      userSideChildrenRoutes = FrontEndRoute.FoundationManagementRoutes.filter(sr => sr.layout === '/user');
      adminSideChildrenRoutes = FrontEndRoute.FoundationManagementRoutes.filter(sr => sr.layout === '/admin');
    }


  }

  if (cluster == 'BF_Foundation') {
    routes.push(
      {
        name: 'User Management',
        icon: 'AccountCircle',
        rtlName: '',
        layout: '/admin',
        path: '/UserManagement',
        component: 'UserManagement',
        cluster: 'FoundationManagement',
        permission: 'BFF-user-management',
        hide: false
      }
    );

    routes.push(
      {
        name: 'Dashboard Creation Overview',
        icon: 'CallToAction',
        rtlName: '',
        layout: '/admin',
        path: '/DashboardCreation',
        component: 'DashboardCreation',
        cluster: 'FoundationManagement',
        permission: 'BFF-dashboard-creation-overview',
        hide: false
      }
    );

    routes.push(
      {
        name: 'Currency Rates',
        icon: 'EuroSymbol',
        rtlName: '',
        layout: '/admin',
        path: '/CurrencyRates',
        component: 'CurrencyRatesOverview',
        cluster: 'FoundationManagement',
        permission: 'Currency Rates',
        hide: false
      }
    );
  }


  if (userSideChildrenRoutes.length > 0) {
    userSideOtherDashboard.children = userSideChildrenRoutes;
    routes.push(userSideOtherDashboard);
  }

  // my dashboard route for user
  routes.push({
    children: null,
    cluster: culsterName,
    component: 'MyDashboard',
    hide: false,
    icon: "Dashboard",
    layout: "/admin",
    name: 'My dashboard',
    path: `/my-dashboard`,
    rtlName: ""
  });

  if (adminSideChildrenRoutes.length > 0) {
    adminSideOtherDashboard.children = adminSideChildrenRoutes;
    routes.push(adminSideOtherDashboard);
  }







  return routes;

};

const getRotues = async (cluster, permissions, req) => {

  let routes = [];



  switch (cluster) {
    case 'BF_Loan_Management':
      routes = await getDashboardRoutes(req, cluster, permissions);
      //routes.concat(FrontEndRoute.CRMRoutes, FrontEndRoute.LoanInitiationRoutes, FrontEndRoute.LoanManagementRoutes);
      break;
    case 'BF_Initiation':
      routes = await getDashboardRoutes(req, cluster, permissions);
      //routes.concat(FrontEndRoute.CRMRoutes, FrontEndRoute.LoanInitiationRoutes, FrontEndRoute.LoanManagementRoutes);
      break;
    case 'BF_CRM':
      routes = await getDashboardRoutes(req, cluster, permissions);
      //routes.concat(FrontEndRoute.CRMRoutes, FrontEndRoute.LoanInitiationRoutes, FrontEndRoute.LoanManagementRoutes);
      break;
    case 'BF_Funders':
      routes = routes.concat(FrontEndRoute.FunderManagementRoutes);
      break;
    case 'BF_Foundation':
      routes = await getDashboardRoutes(req, cluster, permissions);
      // routes = routes.concat(FrontEndRoute.FoundationManagementRoutes);
      break;
    default:
      Object.values(FrontEndRoute).map(val => routes.push(...val));
      break;
  }

  routes = JSON.parse(JSON.stringify(routes));
  routes = filterPermittedRoutes(routes, permissions);

  return routes;
};

module.exports = {
  getRotues,
};