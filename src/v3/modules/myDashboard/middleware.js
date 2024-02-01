/* eslint-disable no-unused-vars */
/* eslint-disable require-atomic-updates */
const { ResponseHandler } = require('../../handlers');

const { TE, to } = require('../../../helper');

const { ERROR, SUCCESS } = ResponseHandler;

const roleDatabase = require('../roles/database');
const userDatabase = require('../users/database');
const myDashboardDatabase = require('./database');
const myDashboardService = require('./service');

const frontEndPortalDatabase = require('../frontEndPortal/database');
const myDashboardModel = require('./myDashboard');

const { ROLES_CAN_MANAGE_OTHERS_DASHBOARDS } = require('../../../../config/config.js');


module.exports = {

  validateInputsForAdminInputDashboards: async (req, res, next) => {
    try {
      if (!ROLES_CAN_MANAGE_OTHERS_DASHBOARDS.includes(req.user.role)) TE({ code: 400, message: 'You cannot do this task.' });

      const data = req.body;
      let userBasedDashboardInput = false;
      if (!data.roleId) TE({ code: 400, message: 'RoleId required.' });
      if (!('dashboardIdList' in data)) TE({ code: 400, message: 'dashboardIdList required.' });
      if (!('frontEndPortalId' in data)) TE({ code: 400, message: 'frontEndPortalId required.' });
      if (data.userId) {
        // user base dashboard input
        userBasedDashboardInput = true;
      }
      req.userBasedDashboardInput = userBasedDashboardInput;

      // unique input dashboard ids
      const distinctInputDashboards = data.dashboardIdList.filter(function (item, index) {
        if (data.dashboardIdList.indexOf(item) == index)
          return item;
      });

      req.body.dashboardIdList = distinctInputDashboards;

      next();
    } catch (error) {
      ERROR(res, error);
    }
  },


  validateInputsForUserInputDashboards: async (req, res, next) => {
    try {
      const data = req.body;
      const userBasedDashboardInput = true;
      if (!('dashboardIdList' in data)) TE({ code: 400, message: 'dashboardIdList required.' });
      if (!('frontEndPortalId' in data)) TE({ code: 400, message: 'frontEndPortalId required.' });
      req.userBasedDashboardInput = userBasedDashboardInput;

      // unique input dashboard ids
      const distinctInputDashboards = data.dashboardIdList.filter(function (item, index) {
        if (data.dashboardIdList.indexOf(item) == index)
          return item;
      });

      req.body.dashboardIdList = distinctInputDashboards;

      // get user id
      if (!req.user.userId) TE({ code: 400, message: 'Please contact administrator to create account.' });

      // get role id
      const [err1, roleData] = await to(roleDatabase.findByQuery({ where: { name: req.user.role } }));
      if (err1) TE(err1);
      if (roleData.length > 0) {
        req.body.roleId = roleData[0].id;
      } else {
        TE({ code: 400, message: 'your role not available' });
      }

      req.body.userId = req.user.userId;

      next();
    } catch (error) {
      ERROR(res, error);
    }
  },

  compaireWithCurrentAvailbleDashboards: async (req, res, next) => {
    try {
      const data = req.body;
      if (req.userBasedDashboardInput) {
        //  get related all my dashboards specific user
        const [err1, allMyDashboardsForRoleIdAndUserId] = await to(myDashboardDatabase.findByQuery({ where: { roleId: data.roleId, userId: data.userId, frontEndPortalId: data.frontEndPortalId } }));
        if (err1) TE(err1);
        req.allMyDashboardsForRoleIdAndUserId = allMyDashboardsForRoleIdAndUserId;

        const userAndRoleSpecificDashboardsIds = [];

        for (let i = 0; i < allMyDashboardsForRoleIdAndUserId.length; i++) {
          const sd = allMyDashboardsForRoleIdAndUserId[i];
          userAndRoleSpecificDashboardsIds.push(sd.dashboardId);
        }
        // unique dashboard ids
        const userAndRoleSpecificUniqueDashboardsIds = userAndRoleSpecificDashboardsIds.filter(function (item, index) {
          if (userAndRoleSpecificDashboardsIds.indexOf(item) == index)
            return item;
        });

        const compairData = compairDashboards(data.dashboardIdList, userAndRoleSpecificUniqueDashboardsIds);
        req.addDashboards = compairData.addDashboards;
        req.removeDashboards = compairData.removeDashboards;

      } else {
        // this is for a role (multiple user)
        //first get users according to role (future use)
        const [err1, usersAccordingToRole] = await to(userDatabase.findByQuery({ where: { roleId: data.roleId } }));
        if (err1) TE(err1);
        // get related all my dashboards
        const [err2, allMyDashboardsForRoleId] = await to(myDashboardDatabase.findByQuery({ where: { roleId: data.roleId, frontEndPortalId: data.frontEndPortalId } }));
        if (err2) TE(err2);

        req.usersAccordingToRole = usersAccordingToRole;
        req.allMyDashboardsForRoleId = allMyDashboardsForRoleId;

        const roleSpecificDashboards = allMyDashboardsForRoleId.filter(sd => (sd.roleId == data.roleId && sd.userId == null));
        const roleSpecificDashboardsIds = [];

        for (let i = 0; i < roleSpecificDashboards.length; i++) {
          const sd = roleSpecificDashboards[i];
          roleSpecificDashboardsIds.push(sd.dashboardId);
        }

        const roleSpecificUniqueDashboards = roleSpecificDashboardsIds.filter(function (item, index) {
          if (roleSpecificDashboardsIds.indexOf(item) == index)
            return item;
        });

        // Dashboard availble user generations
        const dashboardAvalilbleUsers = [];
        const userSpecificDashboards = allMyDashboardsForRoleId.filter(sd => (sd.roleId == data.roleId && sd.userId !== null));
        for (let i = 0; i < userSpecificDashboards.length; i++) {
          const sd = userSpecificDashboards[i];
          dashboardAvalilbleUsers.push(sd.userId);
        }
        const dashboardAvalilbleUniquUsers = dashboardAvalilbleUsers.filter(function (item, index) {
          if (dashboardAvalilbleUsers.indexOf(item) == index)
            return item;
        });

        // compair values
        const compairData = compairDashboards(data.dashboardIdList, roleSpecificUniqueDashboards);
        req.addDashboards = compairData.addDashboards;
        req.removeDashboards = compairData.removeDashboards;
        req.dashboardAvalilbleUniquUsers = dashboardAvalilbleUniquUsers;
      }

      next();
    } catch (error) {
      ERROR(res, error);
    }
  },

  doRemoveDashboardTasks: async (req, res, next) => {
    try {
      const data = req.body;
      if (req.userBasedDashboardInput) {
        // remove dashboards for specific user
        if (req.removeDashboards.length > 0) {
          const [err1] = await to(myDashboardDatabase.deleteRecodes({ where: { roleId: data.roleId, userId: data.userId, dashboardId: req.removeDashboards } }));
          if (err1) TE(err1);
        }

      } else {
        // this is for a role (multiple user)
        if (req.removeDashboards.length > 0) {
          const [err1, deletedRecodes] = await to(myDashboardDatabase.deleteRecodes({ where: { roleId: data.roleId, userId: null, dashboardId: req.removeDashboards } }));
          if (err1) TE(err1);
          // console.log(deletedRecodes);
          if (req.dashboardAvalilbleUniquUsers.length > 0) {
            const [err2] = await to(myDashboardDatabase.deleteRecodes({ where: { roleId: data.roleId, userId: req.dashboardAvalilbleUniquUsers, dashboardId: req.removeDashboards } }));
            if (err2) TE(err2);
          }

        }

      }

      next();
    } catch (error) {
      ERROR(res, error);
    }
  },

  doAddDashboardTask: async (req, res, next) => {
    try {
      const data = req.body;
      //const promArray = [];
      const addDashboardResult = [];

      if (req.userBasedDashboardInput) {
        // remove dashboards for specific user
        if (req.addDashboards.length > 0) {
          // const [err1] = await to(myDashboardDatabase.deleteRecodes({ where: { roleId: data.roleId, userId: data.userId, dashboardId: req.removeDashboards } }));
          // if (err1) TE(err1);

          for (let i = 0; i < req.addDashboards.length; i++) {
            const creatMyDashboard = async (x) => {
              const myDashboardResult = await myDashboardService.createSingleRecodeFromAdmin(x);
              addDashboardResult.push(myDashboardResult);
              return;
            };
            await creatMyDashboard({ roleId: data.roleId, userId: data.userId, dashboardId: req.addDashboards[i] });
            // promArray.push(creatMyDashboard({ roleId: data.roleId, userId: data.userId, dashboardId: req.addDashboards[i] }));
          }

          //await Promise.all(promArray);


        }

      } else {
        // this is for a role (multiple user)
        if (req.addDashboards.length > 0) {

          for (let i = 0; i < req.addDashboards.length; i++) {
            // for role and user == null
            const creatMyDashboard = async (x) => {
              const myDashboardResult = await myDashboardService.createSingleRecodeFromAdmin(x);
              addDashboardResult.push(myDashboardResult);
              return;
            };

            await creatMyDashboard({ roleId: data.roleId, userId: null, dashboardId: req.addDashboards[i] });
            //promArray.push(creatMyDashboard({ roleId: data.roleId, userId: null, dashboardId: req.addDashboards[i] }));

            for (let j = 0; j < req.dashboardAvalilbleUniquUsers.length; j++) {
              // for role and user 
              const creatMyDashboard = async (x) => {
                const myDashboardResult = await myDashboardService.createSingleRecodeFromAdmin(x);
                addDashboardResult.push(myDashboardResult);
                return;
              };
              await creatMyDashboard({ roleId: data.roleId, userId: req.dashboardAvalilbleUniquUsers[j], dashboardId: req.addDashboards[i] });
              //promArray.push(creatMyDashboard({ roleId: data.roleId, userId: req.dashboardAvalilbleUniquUsers[j], dashboardId: req.addDashboards[i] }));

            }

          }

          //await Promise.all(promArray);

        }

      }
      req.addDashboardResult = addDashboardResult;

      next();
    } catch (error) {
      ERROR(res, error);
    }
  },


  createInputDashboardsIfNewUsersAvailable: async (req, res, next) => {
    try {
      const data = req.body;
      // const promArray = [];
      const addDashboardResult = req.addDashboardResult;

      if (!req.userBasedDashboardInput && data.dashboardIdList.length > 0) {
        // this function need work only role based dashboards assigns
        const usersNotAvailbleRoleBasedDashboards = [];

        for (let i = 0; i < req.usersAccordingToRole.length; i++) {
          const su = req.usersAccordingToRole[i];
          const userIndex = req.dashboardAvalilbleUniquUsers.indexOf(su.id);
          if (userIndex == -1) {
            // dashboard not availble in db so need to add
            usersNotAvailbleRoleBasedDashboards.push(su.id);
          }
        }

        for (let i = 0; i < data.dashboardIdList.length; i++) {
          for (let j = 0; j < usersNotAvailbleRoleBasedDashboards.length; j++) {
            const creatMyDashboard = async (x) => {
              const myDashboardResult = await myDashboardService.createSingleRecodeFromAdmin(x);
              addDashboardResult.push(myDashboardResult);
              return;
            };
            await creatMyDashboard({ roleId: data.roleId, userId: usersNotAvailbleRoleBasedDashboards[j], dashboardId: data.dashboardIdList[i] });
            //promArray.push(creatMyDashboard({ roleId: data.roleId, userId: usersNotAvailbleRoleBasedDashboards[j], dashboardId: data.dashboardIdList[i] }));
          }
        }
        //await Promise.all(promArray);
      }

      next();
    } catch (error) {
      ERROR(res, error);
    }
  },

  updateSequenceNumberAfterDashboardChange: async (req, res, next) => {
    try {
      const data = req.body;
      const sequenceNumberShouldUpdateRecodeArray = [];
      if (req.userBasedDashboardInput) {
        // user himself change dashboard (add or remove so need to update sequence numbers)
        const [err1, allMyDashboardsForSpecificUser] = await to(myDashboardDatabase.findByQuery(
          {
            where: { roleId: data.roleId, userId: data.userId, frontEndPortalId: data.frontEndPortalId },
            attributes: ['userId', 'dashboardId', 'id', 'dashboardSequenceNumber', 'sequenceNumber']
          }
        ));
        if (err1) TE(err1);
        afterMydashboardsChangeSequenceNumberUpdateCommonFunction(allMyDashboardsForSpecificUser, sequenceNumberShouldUpdateRecodeArray);

      } else {
        // Admin change dashboard (add or remove) by considering role

        const [err1, allMyDashboardsForRoleIdAndUserId] = await to(myDashboardDatabase.findByQuery(
          {
            where: { roleId: data.roleId, frontEndPortalId: data.frontEndPortalId },
            attributes: ['userId', 'dashboardId', 'id', 'dashboardSequenceNumber', 'sequenceNumber']
          }));
        if (err1) TE(err1);
        if (allMyDashboardsForRoleIdAndUserId.length > 0) {
          // role specific dashboards availble

          // first generate role specific  My dashboards sequncess
          const roleSpecificDashboards = allMyDashboardsForRoleIdAndUserId.filter(SMD => SMD.userId == null);
          afterMydashboardsChangeSequenceNumberUpdateCommonFunction(roleSpecificDashboards, sequenceNumberShouldUpdateRecodeArray);

          // then user specific my dashboards sequences

          for (let i = 0; i < req.usersAccordingToRole.length; i++) {
            const SU = req.usersAccordingToRole[i]; // single user
            const userSpecificMyDashboards = allMyDashboardsForRoleIdAndUserId.filter(SMD => SMD.userId == SU.id);
            afterMydashboardsChangeSequenceNumberUpdateCommonFunction(userSpecificMyDashboards, sequenceNumberShouldUpdateRecodeArray);

          }

        }

      }

      // dashboards sequence update 
      for (let k = 0; k < sequenceNumberShouldUpdateRecodeArray.length; k++) {
        const SUR = sequenceNumberShouldUpdateRecodeArray[k];
        const updateRecode = await myDashboardDatabase.updateRecode(SUR.query, SUR.update);
      }


      next();
    } catch (error) {
      ERROR(res, error);
    }
  },





  dashboardSuccess: async (req, res) => {
    try {
      const response = {
        message: 'dashboard related request success',
        newDashboards: req.addDashboardResult
      };
      SUCCESS(res, 201, response);

    } catch (error) {
      ERROR(res, error);
    }
  },


  // seed sequence numbers.
  seedSequenceNumbers: async (req, res, next) => {
    try {
      const [err1, allMyDashboards] = await to(myDashboardDatabase.findByQuery(
        {
          attributes: ['userId', 'dashboardId', 'id', 'dashboardSequenceNumber', 'sequenceNumber', 'frontEndPortalId'],
          order: [
            ['frontEndPortalId', 'ASC'],
            ['roleId', 'ASC'],
            ['userId', 'ASC'],
            ['dashboardSequenceNumber', 'ASC']
          ]
        }
      )
      );

      if (err1) TE(err1);

      let userId;
      let portalId;
      let count = 1;

      for (let i = 0; i < allMyDashboards.length; i++) {
        const SD = allMyDashboards[i];
        // console.log(SD.userId, SD.dashboardId, SD.id, SD.dashboardSequenceNumber, SD.sequenceNumber, SD.frontEndPortalId);
        if (i == 0) {
          // first element
          userId = SD.userId;
          portalId = SD.frontEndPortalId;
          const updateRecode = await myDashboardDatabase.updateRecode({ where: { id: SD.id } }, { sequenceNumber: count });
          count++;
        } else {
          if (userId == SD.userId && portalId == SD.frontEndPortalId) {
            // same user same portal my dashboards
            const updateRecode = await myDashboardDatabase.updateRecode({ where: { id: SD.id } }, { sequenceNumber: count });
            count++;
          } else {
            // differnt user or portal
            count = 1;
            userId = SD.userId;
            portalId = SD.frontEndPortalId;
            const updateRecode = await myDashboardDatabase.updateRecode({ where: { id: SD.id } }, { sequenceNumber: count });
            count++;

          }
        }


      }

      SUCCESS(res, 201, { message: `Sequence number seed successfull for ${allMyDashboards.length} my dashboards.` });

    } catch (error) {
      ERROR(res, error);
    }
  },

  validateNewUserDashboardCreationInputs: async (req, res, next) => {
    try {

      const data = req.body;
      if (!('userId' in data)) TE({ code: 400, message: 'userId required.' });
      if (!data.userId) TE({ code: 400, message: 'userId must be filled.' });

      next();
    } catch (error) {
      ERROR(res, error);
    }
  },

  validateUserRoleChangeDashboardInputs: async (req, res, next) => {
    try {


      const data = req.body;
      if (!('userId' in data)) TE({ code: 400, message: 'userId required.' });
      if (!data.userId) TE({ code: 400, message: 'userId must be filled.' });
      if (!('newRoleId' in data)) TE({ code: 400, message: 'newRoleId required.' });
      if (!data.newRoleId) TE({ code: 400, message: 'newRoleId must be filled.' });
      if (!('previousRoleId' in data)) TE({ code: 400, message: 'previousRoleId required.' });
      if (!data.previousRoleId) TE({ code: 400, message: 'previousRoleId must be filled.' });

      next();
    } catch (error) {
      ERROR(res, error);
    }
  },

  AddDashboardsToNewUser: async (req, res, next) => {
    try {

      const addDashboardResult = [];
      const data = req.body;

      // check user already availble in our system
      const [err1, usersAccordingToUserId] = await to(userDatabase.findByQuery({ where: { id: data.userId } }));
      if (err1) TE(err1);

      if (usersAccordingToUserId.length == 0) TE({ code: 400, message: 'user not found in the system.' });

      // get front-end portals
      const [err2, allFrontEndPortals] = await to(frontEndPortalDatabase.findByQuery({ where: {} }));
      if (err2) TE(err2);




      for (let i = 0; i < allFrontEndPortals.length; i++) {
        const sequenceNumberShouldUpdateRecodeArray = [];
        const singleFrontEndPortal = allFrontEndPortals[i];
        // get user related role specific dashboards
        const [err3, allMyDashboardsForRoleId] = await to(myDashboardDatabase.findByQuery({ where: { roleId: usersAccordingToUserId[0].roleId, userId: null, frontEndPortalId: singleFrontEndPortal.id } }));
        if (err3) TE(err3);

        // check user has already dashboards availble for selected front-end-portal
        const [err4, allMyDashboardsForRoleIdAndUserId] = await to(myDashboardDatabase.findByQuery({ where: { roleId: usersAccordingToUserId[0].roleId, userId: data.userId, frontEndPortalId: singleFrontEndPortal.id } }));
        if (err4) TE(err4);


        if (allMyDashboardsForRoleIdAndUserId.length === 0) {
          // since user accoding to current role has not assing any dashboards new dashboards will assign
          for (let j = 0; j < allMyDashboardsForRoleId.length; j++) {
            const creatMyDashboard = async (x) => {
              const myDashboardResult = await myDashboardService.createSingleRecodeFromAdmin(x);
              addDashboardResult.push(myDashboardResult);
              return;
            };
            await creatMyDashboard({ roleId: usersAccordingToUserId[0].roleId, userId: data.userId, dashboardId: allMyDashboardsForRoleId[j].dashboardId });
          }
        }


        // update sequence numbers
        const [err5, allMyDashboardsForSpecificUser] = await to(myDashboardDatabase.findByQuery(
          {
            where: { roleId: usersAccordingToUserId[0].roleId, userId: data.userId, frontEndPortalId: singleFrontEndPortal.id },
            attributes: ['userId', 'dashboardId', 'id', 'dashboardSequenceNumber', 'sequenceNumber']
          }
        ));
        if (err5) TE(err5);
        afterMydashboardsChangeSequenceNumberUpdateCommonFunction(allMyDashboardsForSpecificUser, sequenceNumberShouldUpdateRecodeArray);

        for (let k = 0; k < sequenceNumberShouldUpdateRecodeArray.length; k++) {
          const SUR = sequenceNumberShouldUpdateRecodeArray[k];
          const updateRecode = await myDashboardDatabase.updateRecode(SUR.query, SUR.update);
        }


      }


      req.addDashboardResult = addDashboardResult;


      next();
    } catch (error) {
      ERROR(res, error);
    }
  },

  RemoveExsistingDashboardsAndAddDashboardsWhenUserRoleChange: async (req, res, next) => {
    try {

      const addDashboardResult = [];
      const data = req.body;

      // check user already availble in our system
      const [err1, usersAccordingToUserId] = await to(userDatabase.findByQuery({ where: { id: data.userId } }));
      if (err1) TE(err1);

      if (usersAccordingToUserId.length == 0) TE({ code: 400, message: 'user not found in the system.' });

      // check user has same role now and before. if so no point to do bellow work
      if (data.newRoleId == data.previousRoleId) {
        req.addDashboardResult = addDashboardResult;
        return next();
      }

      // get front-end portals
      const [err2, allFrontEndPortals] = await to(frontEndPortalDatabase.findByQuery({ where: {} }));
      if (err2) TE(err2);




      for (let i = 0; i < allFrontEndPortals.length; i++) {
        const sequenceNumberShouldUpdateRecodeArray = [];
        const deleteDashboardIds = [];
        const singleFrontEndPortal = allFrontEndPortals[i];
        // get user related role specific dashboards
        const [err3, allUserMyDashboardsForPreviousRoleId] = await to(myDashboardDatabase.findByQuery({ where: { roleId: data.previousRoleId, userId: data.userId, frontEndPortalId: singleFrontEndPortal.id } }));
        if (err3) TE(err3);

        if (allUserMyDashboardsForPreviousRoleId.length > 0) {
          // dashboards available so need to remove these
          for (let k = 0; k < allUserMyDashboardsForPreviousRoleId.length; k++) {
            const dashboard = allUserMyDashboardsForPreviousRoleId[k];
            deleteDashboardIds.push(dashboard.id);
          }
          const deletedDashboards = await myDashboardModel.destroy({ where: { id: deleteDashboardIds } });
          // if (err4) TE(err4);
        }

        // get user related role specific dashboards
        const [err5, allMyDashboardsForRoleId] = await to(myDashboardDatabase.findByQuery({ where: { roleId: data.newRoleId, userId: null, frontEndPortalId: singleFrontEndPortal.id } }));
        if (err5) TE(err5);

        // check user has already dashboards availble for selected front-end-portal and new role
        const [err6, allMyDashboardsForRoleIdAndUserId] = await to(myDashboardDatabase.findByQuery({ where: { roleId: data.newRoleId, userId: data.userId, frontEndPortalId: singleFrontEndPortal.id } }));
        if (err6) TE(err6);


        if (allMyDashboardsForRoleIdAndUserId.length === 0) {
          // since user accoding to current role has not assing any dashboards new dashboards will assign
          for (let j = 0; j < allMyDashboardsForRoleId.length; j++) {
            const creatMyDashboard = async (x) => {
              const myDashboardResult = await myDashboardService.createSingleRecodeFromAdmin(x);
              addDashboardResult.push(myDashboardResult);
              return;
            };
            await creatMyDashboard({ roleId: data.newRoleId, userId: data.userId, dashboardId: allMyDashboardsForRoleId[j].dashboardId });
          }

          // update sequence numbers
          const [err7, allMyDashboardsForSpecificUser] = await to(myDashboardDatabase.findByQuery(
            {
              where: { roleId: data.newRoleId, userId: data.userId, frontEndPortalId: singleFrontEndPortal.id },
              attributes: ['userId', 'dashboardId', 'id', 'dashboardSequenceNumber', 'sequenceNumber']
            }
          ));
          if (err7) TE(err7);
          afterMydashboardsChangeSequenceNumberUpdateCommonFunction(allMyDashboardsForSpecificUser, sequenceNumberShouldUpdateRecodeArray);

          for (let k = 0; k < sequenceNumberShouldUpdateRecodeArray.length; k++) {
            const SUR = sequenceNumberShouldUpdateRecodeArray[k];
            const updateRecode = await myDashboardDatabase.updateRecode(SUR.query, SUR.update);
          }
        }




      }


      req.addDashboardResult = addDashboardResult;


      next();
    } catch (error) {
      ERROR(res, error);
    }
  },



  sendSuccseeResponse: async (req, res) => {
    try {
      const response = {
        message: 'dashboard created success',
        newDashboards: req.addDashboardResult
      };
      SUCCESS(res, 201, response);

    } catch (error) {
      ERROR(res, error);
    }
  },

};


const compairDashboards = (inputDashboards, dbDashboards) => {
  let addDashboards = [];
  let removeDashboards = [];

  if (inputDashboards.length == 0 && dbDashboards.length > 0) {
    // need to delete all dashboards
    removeDashboards = dbDashboards;
  } else if (inputDashboards.length > 0 && dbDashboards.length == 0) {
    // need to add all dashboards
    addDashboards = inputDashboards;
  } else if (inputDashboards.length > 0 && dbDashboards.length > 0) {
    // find dashboards for add
    for (let i = 0; i < inputDashboards.length; i++) {
      const sd = inputDashboards[i];
      const dbIndex = dbDashboards.indexOf(sd);
      if (dbIndex == -1) {
        // dashboard not availble in db so need to add
        addDashboards.push(sd);
      }
    }

    // find dashboards for remove
    for (let i = 0; i < dbDashboards.length; i++) {
      const sd = dbDashboards[i];
      const dbIndex = inputDashboards.indexOf(sd);
      if (dbIndex == -1) {
        // dashboard not availble in db so need to add
        removeDashboards.push(sd);
      }
    }
  }

  return { addDashboards, removeDashboards };
};

// this funcation generate correct sequence number update query after My dashboards change
const afterMydashboardsChangeSequenceNumberUpdateCommonFunction = (myDashboards, updateQueryArray) => {

  if (myDashboards.length > 0) {
    // dashboards availble
    let count = 1;
    // sort mydashboards according to sequence number
    myDashboards.sort((a, b) => {
      return a.sequenceNumber - b.sequenceNumber;
    });

    // get sequnce number = null (new dashboards) for sort by dashboardSequenceNumber
    const sequenceNullMyDashboards = myDashboards.filter(SMD => SMD.sequenceNumber == null);
    sequenceNullMyDashboards.sort((a, b) => {
      return a.dashboardSequenceNumber - b.dashboardSequenceNumber;
    });

    for (let i = 0; i < myDashboards.length; i++) {
      const SNAMD = myDashboards[i]; // sequnce number availble sorted dashboard
      if (SNAMD.sequenceNumber == null) {
        continue;
      } else {
        // const updateRecode = await myDashboardDatabase.updateRecode({ where: { id: SNAMD.id } }, { sequenceNumber: count });
        const obj = {};
        obj.query = { where: { id: SNAMD.id } };
        obj.update = { sequenceNumber: count };
        updateQueryArray.push(obj);
        count++;
      }

    }


    // update new mydashboard sequence number initially null
    for (let j = 0; j < sequenceNullMyDashboards.length; j++) {
      const SNNAMD = sequenceNullMyDashboards[j]; // sequnce number not availble sorted dashboard
      // const updateRecode = await myDashboardDatabase.updateRecode({ where: { id: SNNAMD.id } }, { sequenceNumber: count });
      const obj = {};
      obj.query = { where: { id: SNNAMD.id } };
      obj.update = { sequenceNumber: count };
      updateQueryArray.push(obj);
      count++;
    }


  }

  return updateQueryArray;
};