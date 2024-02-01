const FrontEndRoute = require('./ClusterwiseRotues');
const { isNullOrEmpty } = require('../../../../lib/utility');

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

const getRotues = (cluster, permissions) => {

  let routes = [];

  switch (cluster) {
    case 'BF_Loan_Management':
      routes = routes.concat(FrontEndRoute.CRMRoutes, FrontEndRoute.LoanInitiationRoutes, FrontEndRoute.LoanManagementRoutes);
      break;
    case 'BF_Initiation':
      routes = routes.concat(FrontEndRoute.CRMRoutes, FrontEndRoute.LoanInitiationRoutes, FrontEndRoute.LoanManagementRoutes);
      break;
    case 'BF_CRM':
      routes = routes.concat(FrontEndRoute.CRMRoutes, FrontEndRoute.LoanInitiationRoutes, FrontEndRoute.LoanManagementRoutes);
      break;
    case 'BF_Funders':
      routes = routes.concat(FrontEndRoute.FunderManagementRoutes);
      break;
    case 'BF_Foundation':
      routes = routes.concat(FrontEndRoute.FoundationManagementRoutes);
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