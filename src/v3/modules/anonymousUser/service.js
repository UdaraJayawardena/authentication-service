const Database = require('./database');
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


    const getRecodes = Database.findByQuery({ where: filter });

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

    if (!('permissionKey' in data)) {
      const time = new Date().getTime();
      const message = time + data.organization + data.userName;
      data.permissionKey = CryptoJS.HmacSHA1(message, 'Seacret key').toString();
    }

    if (!('camundaPassword' in data)) {
      data.camundaPassword = passwordGenerator.generate({ length: 10, numbers: true });
    }


    data.camundaUserId = data.userName;


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

    if ('id' in updateData) {
      // id
      delete updateData['id'];
    }

    const updateRecode = Database.updateRecode({ where: filter }, updateData);

    const [err, result] = await to(updateRecode);

    if (err) TE(err);

    if (!result) TE('Result not found');

    return await Database.findByQuery({ where: filter });
  },

};