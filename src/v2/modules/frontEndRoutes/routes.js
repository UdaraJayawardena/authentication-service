const express = require('express');

const { PermissionMatrixMiddleware } = require('../permissionMatrix');
const { authorizationMiddleware } = require('../authorization');
const Middleware = require('./middleware');
const Controller = require('./controller');

const router = express.Router();

router.route('/').get(
  PermissionMatrixMiddleware.validateUserPermissionRequest,
  authorizationMiddleware.decodeToken,
  Middleware.getMergedClusters,
  PermissionMatrixMiddleware.getPermissionsFromCache,
  Controller.getFrontEndRoutes);

module.exports = router;