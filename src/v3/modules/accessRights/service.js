const Database = require('./database');

const { to, TE, parseToObject } = require('../../../helper');

module.exports = {
  getAccessRights: async (params) => {

    const filter = (params && params.condition && parseToObject(params.condition)) || params || {};

    for (const key of Object.keys(filter)) {
      if (key && filter[key]) filter[key] = parseToObject(filter[key]);
    }

    // if (JSON.stringify(filter) === '{}') TE({ code: 404, errmsg: 'filter condition missing for the route' });


    const getAccessRights = Database.findByQuery({ 'where': filter });

    const [err, result] = await to(getAccessRights);

    if (err) TE(err);

    if (!result) TE('Result not found');

    return result;
  },

  createSingleAccessRight: async (accessRight) => {

    if (!('name' in accessRight)) {
      TE('name required in access right.');
    }
    const createSingleAccessRight = Database.createSingleAccessRight(accessRight);

    const [err, result] = await to(createSingleAccessRight);

    if (err) TE(err);

    if (!result) TE('Result not found');

    return result;
  },

  createMultipleAccessRights: async (accessRightList) => {

    if (accessRightList.length > 0) {
      const filterdAccesRights = accessRightList.filter((el) => {
        let nameAvailabe = true;
        if (!('name' in el)) {
          nameAvailabe = false;
        }

        return nameAvailabe;
      });

      if (filterdAccesRights.length !== accessRightList.length) {
        TE('name field missing accessRights.');
      }
    }
    const createMultipleAccessRights = Database.createMultipleAccessRights(accessRightList);

    const [err, result] = await to(createMultipleAccessRights);

    if (err) TE(err);

    if (!result) TE('Result not found');

    return result;
  },

  updateAccessRight: async (filter, accessRightUpdate) => {
    const updatedAccessRight = Database.updateAccessRight({ where: filter }, accessRightUpdate);

    const [err, result] = await to(updatedAccessRight);

    if (err) TE(err);

    if (!result) TE('Result not found');

    return await Database.findByQuery({ where: filter });
  },

};