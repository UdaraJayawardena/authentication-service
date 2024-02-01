const express = require('express');
const middleware = require('./middleware');
const router = express.Router();

const Controller = require('./controller');
// const { route } = require('../users/routes');
const authorizationMiddleware = require('../../middleware/utilityFunctions');

router.route('/').get(
  authorizationMiddleware.decodeToken,
  Controller.getRecodes);

router.post('/add-single-recode',
  authorizationMiddleware.decodeToken,
  Controller.createRecode);

router.post('/add-multiple-recodes',
  authorizationMiddleware.decodeToken,
  Controller.createMultipleRecodes);

router.route('/update-recode').put(
  authorizationMiddleware.decodeToken,
  Controller.updateRecode);

router.route('/get-users-based-on-role').get(
  authorizationMiddleware.decodeToken,
  middleware.getUsersAccordingToRole
);

module.exports = router;