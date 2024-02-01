/* eslint-disable indent */
const express = require('express');

const router = express.Router();

const Controller = require('./controller');
const authorizationMiddleware = require('../../middleware/utilityFunctions');
const middleware = require('./middleware');

router.route('/').get(
  authorizationMiddleware.decodeToken,
  Controller.getRecodes);

router.route('/query-with-search-recodes-display-fields').get(
  authorizationMiddleware.decodeToken,
  middleware.getSearchFieldsWithDisplayData).post(
    authorizationMiddleware.decodeToken,
    middleware.getSearchFieldsWithDisplayData);

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