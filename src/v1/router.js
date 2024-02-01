const express = require('express');

const router = express.Router();

const { authorizationRoutes } = require('./modules/authorization');

router.route('/').get(function (req, res) {

  res.status(200).json({

    message: 'Awesome :-), Authorization v1 API server is working properly ',

    application: process.env.APP_NAME,

    version: process.env.VERSION
  });
});

router.use('/authorization', authorizationRoutes);

module.exports = router;
