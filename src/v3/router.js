const express = require('express');

const router = express.Router();

const { authorizationRoutes } = require('./modules/authorization');

const { AccessRightRoutes } = require('./modules/accessRights');

const { FunctionalityRoutes } = require('./modules/functionality');

const { RoleRoutes } = require('./modules/roles');

const { UserRoutes } = require('./modules/users');

const { ClusterRoutes } = require('./modules/cluster');

const { PermissionMatrixRoutes } = require('./modules/permissionMatrix');

const { AnonymousUserRoutes } = require('./modules/anonymousUser');

const { FrontEndRoutes } = require('./modules/frontEndRoutes');

const { DashboardRoutes } = require('./modules/dashboard');

const { DashboardItemRoutes } = require('./modules/dashboardItem');

const { MyDashboardRoutes } = require('./modules/myDashboard');

const { MyDashboardItemRoutes } = require('./modules/myDashboardItem');

const { WireframeRoutes } = require('./modules/wireframe');

const { FunctionalityWireframeRoutes } = require('./modules/functionalityWireframe');

const { FrontEndPortalRoutes } = require('./modules/frontEndPortal');

const { BackendServiceRoutes } = require('./modules/backendService');

const { ServiceModuleRoutes } = require('./modules/serviceModule');

const { SearchOperatorRoutes } = require('./modules/searchOperator');

const { SearchFieldRoutes } = require('./modules/searchField');

const { WireframeAndSearchfieldRoutes } = require('./modules/wireframeAndSearchfield');

const { ServiceModuleFieldRoutes } = require('./modules/serviceModuleField');




router.route('/').get(function (req, res) {

  res.status(200).json({

    message: 'Awesome :-), Authorization v3 API server is working properly a ',

    application: process.env.APP_NAME,

    version: process.env.VERSION
  });
});

router.use('/authorization', authorizationRoutes);

router.use('/access-right', AccessRightRoutes);

router.use('/functionality', FunctionalityRoutes);

router.use('/role', RoleRoutes);

router.use('/user', UserRoutes);

router.use('/cluster', ClusterRoutes);

router.use('/permisson-matrix', PermissionMatrixRoutes);

router.use('/anonymous-user', AnonymousUserRoutes);

router.use('/front-end-routes', FrontEndRoutes);

router.use('/dashboard', DashboardRoutes);

router.use('/dashboard-item', DashboardItemRoutes);

router.use('/my-dashboard', MyDashboardRoutes);

router.use('/my-dashboard-item', MyDashboardItemRoutes);

router.use('/wireframe', WireframeRoutes);

router.use('/functionality-wireframe', FunctionalityWireframeRoutes);

router.use('/front-end-portal', FrontEndPortalRoutes);

router.use('/back-end-service', BackendServiceRoutes);

router.use('/service-module', ServiceModuleRoutes);

router.use('/search-operator', SearchOperatorRoutes);

router.use('/search-field', SearchFieldRoutes);

router.use('/wireframe-and-search-field', WireframeAndSearchfieldRoutes);

router.use('/service-module-field', ServiceModuleFieldRoutes);





module.exports = router;
