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


      const getRecodes = Database.findByQuery(filter);

      const [err, result] = await to(getRecodes);

      if (err) TE(err);

      if (!result) TE('Result not found');

      return result;
    },

  createSingleRecode: async (data) => {
    if (!data) {
      TE('data required in permission.');
    }
    if (!('role' in data)) {
      TE('role id required.');
    }
    if (!('functionality' in data)) {
      TE('functionality id required.');
    }
    if (!('accessRight' in data)) {
      TE('access right id required.');
    }
    if (!('cluster' in data)) {
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
        if (!('functionality' in el && 'role' in el && 'accessRight' in el && 'cluster' in el)) {
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
    const updateRecode = Database.updateRecode(filter, updateData);

    const [err, result] = await to(updateRecode);

    if (err) TE(err);

    if (!result) TE('Result not found');

    return result;
  },

};