const Database = require('./database');

const { to, TE, parseToObject } = require('../../../helper');

module.exports = {
  getFunctionalities: async (params) => {

    const filter = (params && params.condition && parseToObject(params.condition)) || params || {};

    for (const key of Object.keys(filter)) {
      if (key && filter[key]) filter[key] = parseToObject(filter[key]);
    }

    // if (JSON.stringify(filter) === '{}') TE({ code: 404, errmsg: 'filter condition missing for the route' });


    const getFunctionalities = Database.findByQuery(filter);

    const [err, result] = await to(getFunctionalities);

    if (err) TE(err);

    if (!result) TE('Result not found');

    return result;
  },

  createSingleFunctionality: async (functionality) => {

    if (!('name' in functionality)) {
      TE('name required in functionality.');
    }
    const createSingleFunctionality = Database.createSingleFunctionality(functionality);

    const [err, result] = await to(createSingleFunctionality);

    if (err) TE(err);

    if (!result) TE('Result not found');

    return result;
  },

  createMultipleFunctionalities: async (functionalityList) => {

    if (functionalityList.length > 0) {
      const filterdFunctionalities = functionalityList.filter((el) => {
        let nameAvailabe = true;
        if (!('name' in el)) {
          nameAvailabe = false;
        }

        return nameAvailabe;
      });

      if (filterdFunctionalities.length !== functionalityList.length) {
        TE('name field missing accessRights.');
      }
    }
    const createMultipleFunctionalities = Database.createMultipleFunctionalities(functionalityList);

    const [err, result] = await to(createMultipleFunctionalities);

    if (err) TE(err);

    if (!result) TE('Result not found');

    return result;
  },

  updateFunctionality: async (filter, functionalityUpdate) => {
    const updateFunctionality = Database.updateFunctionality(filter, functionalityUpdate);

    const [err, result] = await to(updateFunctionality);

    if (err) TE(err);

    if (!result) TE('Result not found');

    return result;
  },

};