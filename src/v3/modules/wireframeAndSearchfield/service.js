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

    if (!('displayName' in data)) {
      TE('displayName required for wireframe_and_search_field table.');
    }
    if (!('wireframeId' in data)) {
      TE('wireframeId required for wireframe_and_search_field table');
    }
    if (!('searchFieldId' in data)) {
      TE('searchFieldId required for wireframe_and_search_field table');
    }
    // if (!('searchOperatorId' in data)) {
    //   TE('searchOperatorId required for wireframe_and_search_field table');
    // }

    const createSingleRecode = Database.createSingleRecode(data);

    const [err, result] = await to(createSingleRecode);

    if (err) TE(err);

    if (!result) TE('Result not found');

    return result;
  },

  createMultipleRecodes: async (dataList) => {

    if (dataList.length > 0) {
      const filterdDataList = dataList.filter((el) => {
        let displayNameAvailabe = true;
        let wireframeIdAvailable = true;
        let searchfieldAvailable = true;
        const searchOperatorIdAvailable = true;
        if (!('displayName' in el)) {
          displayNameAvailabe = false;
        }
        if (!('wireframeId' in el)) {
          wireframeIdAvailable = false;
        }
        if (!('searchFieldId' in el)) {
          searchfieldAvailable = false;
        }
        // if (!('searchOperatorId' in el)) {
        //   searchOperatorIdAvailable = false;
        // }

        return displayNameAvailabe && wireframeIdAvailable && searchfieldAvailable && searchOperatorIdAvailable;
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