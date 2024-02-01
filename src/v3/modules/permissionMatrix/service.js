const Database = require('./database');

const { to, TE, parseToObject } = require('../../../helper');

module.exports = {
  getRecodes:

    async (params) => {

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
    if (!data) {
      TE('data required in permission.');
    }
    if (!('roleId' in data)) {
      TE('role id required.');
    }
    if (!('functionalityId' in data)) {
      TE('functionality id required.');
    }
    if (!('accessRightId' in data)) {
      TE('access right id required.');
    }
    if (!('clusterId' in data)) {
      TE('cluster id required.');
    }
    const createSingleRecode = Database.createSingleRecode(data);

    const [err, result] = await to(createSingleRecode);

    if (err) TE(err);

    if (!result) TE('Result not found');

    return result;
  },

  createMultipleRecodes: async (dataList) => {
    if (!dataList) TE('dataList missing in permission matrix.');
    if (dataList.length > 0) {
      const filterdDataList = dataList.filter((el) => {
        let correctFormatDataAvailabe = true;
        if (!('functionalityId' in el && 'roleId' in el && 'accessRightId' in el && 'clusterId' in el)) {
          correctFormatDataAvailabe = false;
        }

        return correctFormatDataAvailabe;
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
    const updateRecode = Database.updateRecode({ where: filter }, updateData);

    const [err, result] = await to(updateRecode);

    if (err) TE(err);

    if (!result) TE('Result not found');

    return await Database.findByQuery({ where: filter });
  },

};