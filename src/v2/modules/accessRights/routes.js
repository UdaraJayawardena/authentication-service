const express = require('express');

const router = express.Router();

const Controller = require('./controller');

router.route('/').get(Controller.getAccessRights);

router.post('/add-single-recode', Controller.createAccessRight);

router.post('/add-multiple-recodes', Controller.createMultipleAccessRights);

router.route('/update-recode').put(Controller.updateAccessRight);

module.exports = router;