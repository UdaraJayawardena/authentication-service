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

router.route('/').get(function (req, res) {

  res.status(200).json({

    message: 'Awesome :-), Authorization v2 API server is working properly a ',

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

module.exports = router;
