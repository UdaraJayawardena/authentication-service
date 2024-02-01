const express = require('express');

const router = express.Router();

const Controller = require('./controller');
const middleware = require('./middleware');
// const { route } = require('../roles/routes');
const authorizationMiddleware = require('../../middleware/utilityFunctions');

router.route('/').get(
  authorizationMiddleware.decodeToken,
  Controller.getRecodes,
);

router.route('/add-single-recode').post(
  authorizationMiddleware.decodeToken,
  Controller.createRecode
);

router.post('/add-multiple-recodes',
  authorizationMiddleware.decodeToken,
  Controller.createMultipleRecodes);

router.route('/update-recode').put(
  authorizationMiddleware.decodeToken,
  Controller.updateRecode);

router.route('/set-permissions-to-cache').post(
  authorizationMiddleware.decodeToken,
  middleware.setRecordsToCache);

router.route('/get-permissions-from-cache').get(
  middleware.validateUserPermissionRequest,
  authorizationMiddleware.decodeToken,
  middleware.getRecordsFromCache
);

module.exports = router;