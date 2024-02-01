/* eslint-disable no-unused-vars */
const { Op } = require('sequelize');
const Database = require('./database');
const MyDashboardItemDatabase = require('../myDashboardItem/database');

const { to, TE, parseToObject } = require('../../../helper');

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



  getRecodesForSelf: async (params, user) => {

    const filter = (params && params.condition && parseToObject(params.condition)) || params || {};

    for (const key of Object.keys(filter)) {
      if (key && filter[key]) filter[key] = parseToObject(filter[key]);
    }

    // if (JSON.stringify(filter) === '{}') TE({ code: 404, errmsg: 'filter condition missing for the route' });
    if (user.role) {
      filter.roleName = user.role;
    }
    filter.userId = null;
    if (user.userId) {
      filter.userId = user.userId;
    }

    const getRecodes = Database.findByQuery({ where: filter });

    const [err, result] = await to(getRecodes);

    if (err) TE(err);

    if (!result) TE('Result not found');

    return result;
  },

  createSingleRecode: async (data) => {

    if (!(('roleId' in data) || ('userId' in data))) {
      TE('roleId or userId required in my dashboard.');
    }

    // if (!('userId' in data)) {
    //   TE('userId required in my dashboard.');
    // }

    if (!('dashboardId' in data)) {
      TE('dashboardId required in my dashboard.');
    }


    const createSingleRecode = Database.createSingleRecode(data);

    const [err, result] = await to(createSingleRecode);

    if (err) TE(err);

    if (!result) TE('Result not found');

    // create my dashboard items
    const [err1, myDashboardResult] = await to(MyDashboardItemDatabase.createDashboardItemsFromMyDashboard(result));

    if (err1) TE(err1);

    // if (!myDashboardResult) TE('Result not found');

    return result;
  },

  // do not use this for routes this function used in admin side dashboard creation
  createSingleRecodeFromAdmin: async (data) => {

    if (!(('roleId' in data) || ('userId' in data))) {
      TE('roleId or userId required in my dashboard.');
    }

    if (!('dashboardId' in data)) {
      TE('dashboardId required in my dashboard.');
    }


    // const createSingleRecode = Database.createSingleRecodeFromAdmins(data);

    const [err, result] = await to(Database.createSingleRecodeFromAdmins(data));
    // create my dashboard items
    if (result.isDashboardCreated) {
      const [err1, myDashboardResult] = await to(MyDashboardItemDatabase.createDashboardItemsFromMyDashboard(result.createdDashboard));
    }

    return result;
  },



  createMultipleRecodes: async (dataList) => {

    if (dataList.length > 0) {
      const filterdDataList = dataList.filter((el) => {
        let userId = true;
        let dashboardId = true;
        if (!(('roleId' in el) || ('userId' in el))) {
          userId = false;
        }


        if (!('dashboardId' in el)) {
          dashboardId = false;
        }

        return (userId && dashboardId);
      });

      if (filterdDataList.length !== dataList.length) {
        TE('fields missing in My Dashboard.');
      }
    }
    const createMultipleRecodes = Database.createMultipleRecodes(dataList);

    const [err, result] = await to(createMultipleRecodes);

    if (err) TE(err);

    if (!result) TE('Result not found');

    return result;
  },

  updateRecode: async (filter, updateData, frontEndPortalId) => {
    filter.frontEndPortalId = frontEndPortalId;
    const sequnceNUmberUpdate = await checkAndUpdateSequenceNumbers(filter, updateData);
    delete filter.frontEndPortalId;
    const updateRecode = Database.updateRecode({ where: filter }, updateData);

    const [err, result] = await to(updateRecode);

    if (err) TE(err);

    if (!result) TE('Result not found');

    return await Database.findByQuery({ where: filter });
  },

};


const checkAndUpdateSequenceNumbers = async (filter, updateData) => {
  let sequenceNumberShouldUpdateArray = [];
  const SNUDA = [];
  // first get related Mydashboard
  const getRecodes = Database.findByQuery({ where: filter });
  const [err1, result1] = await to(getRecodes);
  if (err1) TE(err1);
  if (!result1) TE('Recode not found');

  if (result1.length == 1) {
    // this means only one mydashboard available for changes
    if ('sequenceNumber' in updateData) {
      if (result1[0].sequenceNumber !== updateData.sequenceNumber) {
        // sequence number should update 
        const betweenLess = result1[0].sequenceNumber > updateData.sequenceNumber ? updateData.sequenceNumber : result1[0].sequenceNumber;
        const betweenMore = result1[0].sequenceNumber > updateData.sequenceNumber ? result1[0].sequenceNumber : updateData.sequenceNumber;

        const getRecodes = Database.findByQuery(
          {
            where: {
              frontEndPortalId: result1[0].frontEndPortalId,
              roleId: result1[0].roleId,
              userId: result1[0].userId,
              sequenceNumber: { [Op.between]: [betweenLess, betweenMore] }
            }
          });
        const [err2, result2] = await to(getRecodes);
        if (err2) TE(err2);
        if (!result2) TE('Recode not found');
        sequenceNumberShouldUpdateArray = result2;
      }
    }

  }

  if (sequenceNumberShouldUpdateArray.length > 0) {
    // this means sequence number should update recodes available
    sequenceNumberShouldUpdateArray.sort((a, b) => (a.sequenceNumber > b.sequenceNumber ? 1 : -1));
    if (result1[0].sequenceNumber > updateData.sequenceNumber) {
      // this means mydashboard come for top (ex :- 7th sequence number item come to 2nd place)
      for (let i = 0; i < sequenceNumberShouldUpdateArray.length - 1; i++) {
        const SDI = sequenceNumberShouldUpdateArray[i];
        SNUDA.push({ filter: { id: SDI.id }, updateData: { sequenceNumber: SDI.sequenceNumber + 1 } });
      }
    }
    else {
      // this means mydashboard  come for bottom (ex :- 2th sequence number item come to 7nd place)
      for (let i = 1; i < sequenceNumberShouldUpdateArray.length; i++) {
        const SDI = sequenceNumberShouldUpdateArray[i];
        SNUDA.push({ filter: { id: SDI.id }, updateData: { sequenceNumber: SDI.sequenceNumber - 1 } });
      }
    }
  }

  if (SNUDA.length > 0) {
    for (let i = 0; i < SNUDA.length; i++) {
      const singleDashboarItem = SNUDA[i];

      // eslint-disable-next-line no-unused-vars
      const updateRecode = await Database.updateRecode({ where: singleDashboarItem.filter }, singleDashboarItem.updateData);
    }
  }

  return true;
};