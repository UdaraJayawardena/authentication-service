const express = require('express');

const router = express.Router();

const Controller = require('./controller');
const authorizationMiddleware = require('../../middleware/utilityFunctions');
const Middleware = require('./middleware');

router.route('/').get(
  authorizationMiddleware.decodeToken,
  Controller.getRecodes);

router.route('/get-my-dashboards-self').get(
  authorizationMiddleware.decodeToken,
  Controller.getRecodesForSelf);

router.post('/add-single-recode',
  authorizationMiddleware.decodeToken,
  Controller.createRecode);

router.post('/add-multiple-recodes',
  authorizationMiddleware.decodeToken,
  Controller.createMultipleRecodes);

router.route('/update-recode').put(
  authorizationMiddleware.decodeToken,
  Controller.updateRecode);

router.post('/add-or-delete-multiple-dashboards-for-roles-and-users-by-Admin',
  authorizationMiddleware.decodeToken,
  Middleware.validateInputsForAdminInputDashboards,
  Middleware.compaireWithCurrentAvailbleDashboards,
  Middleware.doRemoveDashboardTasks,
  Middleware.doAddDashboardTask,
  Middleware.createInputDashboardsIfNewUsersAvailable,
  Middleware.updateSequenceNumberAfterDashboardChange,
  Middleware.dashboardSuccess
);

router.post('/add-or-delete-multiple-dashboards-for-roles-and-users-by-user',
  authorizationMiddleware.decodeToken,
  Middleware.validateInputsForUserInputDashboards,
  Middleware.compaireWithCurrentAvailbleDashboards,
  Middleware.doRemoveDashboardTasks,
  Middleware.doAddDashboardTask,
  Middleware.createInputDashboardsIfNewUsersAvailable,
  Middleware.updateSequenceNumberAfterDashboardChange,
  Middleware.dashboardSuccess
);

router.post('/seed_dashboard_sequence_numbers',
  authorizationMiddleware.decodeToken,
  Middleware.seedSequenceNumbers,
);

router.post('/add-dashboards-to-created-user',
  authorizationMiddleware.decodeToken,
  Middleware.validateNewUserDashboardCreationInputs,
  Middleware.AddDashboardsToNewUser,
  Middleware.sendSuccseeResponse
);

router.post('/add-dashboards-to-user-when-role-change',
  authorizationMiddleware.decodeToken,
  Middleware.validateUserRoleChangeDashboardInputs,
  Middleware.RemoveExsistingDashboardsAndAddDashboardsWhenUserRoleChange,
  Middleware.sendSuccseeResponse
);



module.exports = router;