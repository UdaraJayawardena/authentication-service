const express = require('express');

const router = express.Router();

const authorizationMiddleware = require('../../middleware/utilityFunctions');

const Middleware = require('./middleware');

router.route('/initial').post(
  authorizationMiddleware.decodeToken,
  Middleware.generateTables,
  Middleware.generateViews
);

module.exports = router;