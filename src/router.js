const express = require('express');

const router = express.Router();

const V1Router = require('./v1/router');

const V2Router = require('./v2/router');

const V3Router = require('./v3/router');

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
  // console.log('Time: ', Date.now());
  next();
});

router.route('/').get(function (req, res) {
  console.log(req);
  res.status(200).json({

    message: 'Awesome :-), Authorization server is working properly ',

    application: process.env.APP_NAME,

    version: process.env.VERSION
  });
});

router.use('/v1', V1Router);

router.use('/v2', V2Router);

router.use('/v3', V3Router);

router.use(function (req, res, next) {
  next({ message: 'Endpoint not found' });
});

router.use(function (err, req, res) {
  res.status(err.status || 500);
  res.send(err);
});

module.exports = router;
