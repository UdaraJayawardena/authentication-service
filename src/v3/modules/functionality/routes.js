const express = require('express');

const router = express.Router();

const Controller = require('./controller');
const authorizationMiddleware = require('../../middleware/utilityFunctions');

router.route('/').get(
  authorizationMiddleware.decodeToken,
  Controller.getFunctionalities);

router.post('/add-single-recode',
  authorizationMiddleware.decodeToken,
  Controller.createSingleFunctionality);

router.post('/add-multiple-recodes',
  authorizationMiddleware.decodeToken,
  Controller.createMultipleFunctionalities);

router.route('/update-recode').put(
  authorizationMiddleware.decodeToken,
  Controller.updateFunctionality);

module.exports = router;