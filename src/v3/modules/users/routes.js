const express = require('express');

const router = express.Router();

const Controller = require('./controller');
const authorizationMiddleware = require('../../middleware/utilityFunctions');
const { ldapMiddleware } = require('../../middleware');

router.route('/').get(
  authorizationMiddleware.decodeToken,
  Controller.getRecodes);

router.post('/add-single-recode',
  authorizationMiddleware.decodeToken,
  Controller.createRecode);

router.post('/create-jumpcloud-user',
  ldapMiddleware.createJumpCloudUser);

router.post('/user-associations',
  ldapMiddleware.createLdapAssiociation,
  ldapMiddleware.bindUsersToUserGroups);

router.post('/add-multiple-recodes',
  authorizationMiddleware.decodeToken,
  Controller.createMultipleRecodes);

router.route('/update-recode').put(
  authorizationMiddleware.decodeToken,
  Controller.updateRecode);

router.get('/user-groups',
  ldapMiddleware.getUserGroups);

router.post('/delete-single-user',
  authorizationMiddleware.decodeToken,
  Controller.deleteRecode);

router.post('/delete-jumpcloud-user',
  ldapMiddleware.deleteJumpcloudUser);

router.post('/user-groups-by-user',
  ldapMiddleware.getUserGroupsByUser);

router.route('/update-jumpcloud-user').put(
  ldapMiddleware.updateJumpcloudUser);

router.route('/update-jumpcloud-user-group').put(
  ldapMiddleware.updateJumpcloudUserGroup);

// user table columns update
router.route('/update-on-user-table').post(
  Controller.updateOnUserTable);

// user table jumpcloud migration
router.route('/migrate-user-Jumpcloud-data').post(
  Controller.migrateUserJumpcloudData);

module.exports = router;