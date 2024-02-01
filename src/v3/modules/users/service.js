/* eslint-disable no-unused-vars */
const Database = require('./database');
const md5 = require('md5');
const { to, TE, parseToObject } = require('../../../helper');
const LdapService = require('../../services/ldap/index');

module.exports = {
  getRecodes: async (params) => {

    const filter = (params && params.condition && parseToObject(params.condition)) || params || {};

    for (const key of Object.keys(filter)) {
      if (key && filter[key]) filter[key] = parseToObject(filter[key]);
    }

    // if (JSON.stringify(filter) === '{}') TE({ code: 404, errmsg: 'filter condition missing for the route' });


    const getRecodes = Database.findByQuery({ where: filter });

    const [err, result] = await to(getRecodes);

    if (err) TE(err);

    if (!result) TE('Result not found');

    return result;
  },

  createSingleRecode: async (req) => {
    const data = req.body;

    if (!('name' in data)) {
      TE('name required in user.');
    }

    if (!('roleId' in data)) {
      TE('role id required.');
    }

    if (!('password' in data)) {
      TE('password required.');
    }

    if (!('email' in data)) {
      TE('email required.');
    }

    if (!('userName' in data)) {
      TE('userName required.');
    }

    const user = {...data};

    user.password = md5(user.password);

    const createSingleRecode = Database.createSingleRecode(user);

    const [err, result] = await to(createSingleRecode);

    if (err) TE(err);

    if (!result) TE('Result not found');

    data.userId = result.id;

    return {user : data, LoggedUser : req.user};

  },

  createMultipleRecodes: async (dataList) => {

    if (dataList.length > 0) {
      const filterdDataList = dataList.filter((el) => {
        let correctFormatDataAvailabe = true;
        if (!('name' in el && 'roleId' in el && 'userName' in el)) {
          correctFormatDataAvailabe = false;
        }

        return correctFormatDataAvailabe;
      });

      if (filterdDataList.length !== dataList.length) {
        TE('name field missing users.');
      }
    }
    const createMultipleRecodes = Database.createMultipleRecodes(dataList);

    const [err, result] = await to(createMultipleRecodes);

    if (err) TE(err);

    if (!result) TE('Result not found');

    return result;
  },

  updateRecode: async (req, filter, updateData) => {

    if (!updateData.password) {

      delete updateData.password;
    }else{
      updateData.password = md5(updateData.password);
    }

    const updateRecode = Database.updateRecode({ where: filter }, updateData);

    const [err, result] = await to(updateRecode);

    if (err) TE(err);

    if (!result) TE('Result not found');

    const user = await Database.findByQuery({ where: filter });
    return {user : user[0], LoggedUser : req.user};

  },

  deleteSingleRecode: async (req) => {
    const data = req.body;

    const deleteSingleRecode = Database.deleteSingleRecode(data);

    const [err, result] = await to(deleteSingleRecode);

    if (err) TE(err);

    if(!result) TE('Result not found');

    return result;
  },

  updateJumpcloudData: async (userDataArr) => {

    const updatedResultsArr = [];

    for (let index = 0; index < userDataArr.length; index++) {

      const element = userDataArr[index];
      const userName = element.userName;
      const id = element.id;

      const fetchLdapUser = await new Promise((resolve, reject) => {
        LdapService.getUser(userName).then((getUserbyUserName) => {
          const userObj = getUserbyUserName.results[0];
          const userId = userObj._id;

          resolve({ message: 'success', userId });
        }).catch((error) => {
          resolve({ message: 'failed', userId: 0 });
        });
      });

      if (fetchLdapUser.userId !== 0) {
        const returnUserId = fetchLdapUser.userId;

        const fetchLdapUserGroup = await new Promise((resolve, reject) => {
          LdapService.getUserGroupsByUser(returnUserId).then((jumpcloudUserData) => {
            if (jumpcloudUserData[0].id !== undefined || jumpcloudUserData[0].id !== '') {
              const jumpcloudGroupId = jumpcloudUserData[0].id;

              const updatedUserObj = {
                userName: userName,
                jumpcloudGroupId: jumpcloudGroupId
              };

              resolve({ message: 'success', updatedUserObj });
            }
          }).catch((error) => {
            resolve({ message: 'failed', updatedUserObj: {} });
          });
        });

        const updatedUserResult = await new Promise((resolve, reject) => {
          const jumpcloudGroupId = fetchLdapUserGroup.updatedUserObj.jumpcloudGroupId;
          const currentUserId = id;

          const updateData = { jumpcloudGroupId: jumpcloudGroupId };
          const updateFilter = { id: currentUserId };

          Database.updateRecode({ where: updateFilter }, updateData).then((updatedResult) => {

            resolve({ message: 'user-updated', result: updatedResult, data: currentUserId });
          }).catch((error) => {

            resolve({ message: 'user-update-failed', result: {}, data: currentUserId });
          });
        });

        updatedResultsArr.push(updatedUserResult);
      }
    }

    return updatedResultsArr;
  },
};