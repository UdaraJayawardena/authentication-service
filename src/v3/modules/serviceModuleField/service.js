/* eslint-disable no-unused-vars */
const Database = require('./database');

const { to, TE, parseToObject } = require('../../../helper');

module.exports = {
  getRecodes: async (params) => {

    const filter = (params && params.condition && parseToObject(params.condition)) || params || {};

    for (const key of Object.keys(filter)) {
      if (key && filter[key]) filter[key] = parseToObject(filter[key]);
    }


    const getRecodes = Database.findByQuery({ where: filter });

    const [err, result] = await to(getRecodes);

    if (err) TE(err);

    if (!result) TE('Result not found');

    return result;
  },

  createSingleRecode: async (data) => {

    if (!('name' in data)) {
      TE('name required in service module.');
    }
    if (!('serviceModuleId' in data)) {
      TE('serviceModuleId required in service module.');
    }
    if (!('displayName' in data)) {
      TE('displayName required in service module.');
    }

    const createSingleRecode = Database.createSingleRecode(data);

    const [err, result] = await to(createSingleRecode);

    if (err) TE(err);

    if (!result) TE('Result not found');

    return result;
  },

  createMultipleRecodes: async (dataList) => {

    if (dataList.length > 0) {
      const filterdDataList = dataList.filter((el) => {
        let nameAvailabe = true;
        let serviceModuleIdAvailable = true;
        let displayNameAvaliable = true;
        if (!('name' in el)) {
          nameAvailabe = false;
        }
        if (!('serviceModuleId' in el)) {
          serviceModuleIdAvailable = false;
        }
        if (!('displayName' in el)) {
          displayNameAvaliable = false;
        }

        return nameAvailabe && serviceModuleIdAvailable && displayNameAvaliable;
      });

      if (filterdDataList.length !== dataList.length) {
        TE('required fields missing.');
      }
    }
    const createMultipleRecodes = Database.createMultipleRecodes(dataList);

    const [err, result] = await to(createMultipleRecodes);

    if (err) TE(err);

    if (!result) TE('Result not found');

    return result;
  },

  updateRecode: async (filter, updateData) => {
    if ('id' in updateData) delete updateData.id;
    const updateRecode = Database.updateRecode({ where: filter }, updateData);

    const [err, result] = await to(updateRecode);

    if (err) TE(err);

    if (!result) TE('Result not found');

    return await Database.findByQuery({ where: filter });
  },

};