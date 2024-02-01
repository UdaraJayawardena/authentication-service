/* eslint-disable no-unused-vars */
const Database = require('./database');

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

    if (!('name' in data)) {
      TE('name required in search field table.');
    }
    if (!('serviceModuleId' in data)) {
      TE('name required in search field table.');
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
        if (!('name' in el)) {
          nameAvailabe = false;
        }
        if (!('serviceModuleId' in el)) {
          serviceModuleIdAvailable = false;
        }

        return nameAvailabe && serviceModuleIdAvailable;
      });

      if (filterdDataList.length !== dataList.length) {
        TE('required fields missing search fields.');
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