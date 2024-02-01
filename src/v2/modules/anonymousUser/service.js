const Database = require('./database');
const moment = require('moment');
// const jwt = require('jsonwebtoken');
const CryptoJS = require('crypto-js');

const passwordGenerator = require('generate-password');

const { to, TE, parseToObject } = require('../../../helper');

module.exports = {
  getRecodes: async (params) => {

    const filter = (params && params.condition && parseToObject(params.condition)) || params || {};

    for (const key of Object.keys(filter)) {
      if (key && filter[key]) filter[key] = parseToObject(filter[key]);
    }

    // if (JSON.stringify(filter) === '{}') TE({ code: 404, errmsg: 'filter condition missing for the route' });


    const getRecodes = Database.findByQuery(filter);

    const [err, result] = await to(getRecodes);

    if (err) TE(err);

    if (!result) TE('Result not found');

    return result;
  },

  createSingleRecode: async (data) => {

    if (!('userName' in data)) {
      TE('userName required for anonymus user.');
    }
    if (!('email' in data)) {
      TE('email required for anonymus user.');
    }
    if (!('organization' in data)) {
      TE('organization required for anonymus user.');
    }

    if (!('firstName' in data)) {
      TE('firstName required for anonymus user.');
    }

    if (!('lastName' in data)) {
      TE('lastName required for anonymus user.');
    }

    const time = new Date().getTime();
    const message = time + data.organization + data.userName;
    data.permissionKey = CryptoJS.HmacSHA1(message, 'Seacret key').toString();
    data.camundaUserId = data.userName;
    data.camundaPassword = passwordGenerator.generate({ length: 10, numbers: true });

    const createSingleRecode = Database.createSingleRecode(data);

    const [err, result] = await to(createSingleRecode);

    if (err) TE(err);

    if (!result) TE('Result not found');

    return result.permissionKey;
  },

  // createMultipleRecodes: async (dataList) => {

  //   if (dataList.length > 0) {
  //     const filterdDataList = dataList.filter((el) => {
  //       let nameAvailabe = true;
  //       if (!('name' in el)) {
  //         nameAvailabe = false;
  //       }

  //       return nameAvailabe;
  //     });

  //     if (filterdDataList.length !== dataList.length) {
  //       TE('name field missing cluster.');
  //     }
  //   }
  //   const createMultipleRecodes = Database.createMultipleRecodes(dataList);

  //   const [err, result] = await to(createMultipleRecodes);

  //   if (err) TE(err);

  //   if (!result) TE('Result not found');

  //   return result;
  // },

  updateRecode: async (filter, updateData) => {
    const dataNeedToUpdate = { $set: {} };

    if ('_id' in updateData) {
      delete updateData['_id'];
    }

    if ('statusHistory' in updateData) {
      delete updateData['statusHistory'];
    }

    if ('id' in updateData) {
      // id
      delete updateData['id'];
    }

    // data set and get
    if ('status' in updateData) {
      // need to add status history
      dataNeedToUpdate.$set.status = updateData.status;
      dataNeedToUpdate.$push = {
        statusHistory: {
          status: updateData.status,
          createdAt: moment().format('YYYY-MM-DD')
        },
      };
    }

    if ('userName' in updateData) {
      // userName
      dataNeedToUpdate.$set.userName = updateData.userName;
    }
    if ('email' in updateData) {
      // email
      dataNeedToUpdate.$set.email = updateData.email;
    }
    if ('organization' in updateData) {
      // userName
      dataNeedToUpdate.$set.organization = updateData.organization;
    }

    if ('firstName' in updateData) {
      dataNeedToUpdate.$set.firstName = updateData.firstName;
    }

    if ('lastName' in updateData) {
      dataNeedToUpdate.$set.lastName = updateData.lastName;
    }

    if ('camundaUserId' in updateData) {
      dataNeedToUpdate.$set.camundaUserId = updateData.camundaUserId;
    }

    if ('camundaPassword' in updateData) {
      dataNeedToUpdate.$set.camundaPassword = updateData.camundaPassword;
    }



    const updateRecode = Database.updateRecode(filter, dataNeedToUpdate);

    const [err, result] = await to(updateRecode);

    if (err) TE(err);

    if (!result) TE('Result not found');

    return result;
  },

};