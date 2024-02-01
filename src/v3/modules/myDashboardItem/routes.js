const express = require('express');

const router = express.Router();

const Controller = require('./controller');
const authorizationMiddleware = require('../../middleware/utilityFunctions');
const { PermissionMatrixMiddleware } = require('../permissionMatrix');

router.route('/').get(
  authorizationMiddleware.decodeToken,
  PermissionMatrixMiddleware.getRecordsFromCacheForFutureUse,
  Controller.getRecodes);


router.route('/get-by-query').get(
  authorizationMiddleware.decodeToken,
  Controller.getRecodesByQuery);


router.post('/add-single-recode',
  authorizationMiddleware.decodeToken,
  Controller.createRecode);

router.post('/add-multiple-recodes',
  authorizationMiddleware.decodeToken,
  Controller.createMultipleRecodes);

router.route('/update-recode').put(
  authorizationMiddleware.decodeToken,
  Controller.updateRecode);

module.exports = router;