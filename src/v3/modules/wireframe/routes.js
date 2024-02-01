const express = require('express');

const router = express.Router();

const Controller = require('./controller');
const authorizationMiddleware = require('../../middleware/utilityFunctions');
const middleware = require('./middleware');

router.route('/').get(
  authorizationMiddleware.decodeToken,
  Controller.getRecodes);

router.route('/get-portal-related-wireframes').get(
  authorizationMiddleware.decodeToken,
  middleware.validateWireframesAccordingToPortal,
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



module.exports = router;