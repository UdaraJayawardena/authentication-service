const Service = require('./service');

const { ResponseHandler } = require('../../handlers');

const { TE } = require('../../../helper');

const { ERROR, SUCCESS } = ResponseHandler;

module.exports = {

  getAccessRights: async (req, res) => {

    try {

      const params = req.query;

      const accessRights = await Service.getAccessRights(params);

      SUCCESS(res, 200, accessRights);

    } catch (error) {

      ERROR(res, error);
    }
  },

  createAccessRight: async (req, res) => {

    try {

      const accessRightList = await Service.createSingleAccessRight(req.body);

      SUCCESS(res, 201, accessRightList);

    } catch (error) {

      ERROR(res, error);
    }
  },

  createMultipleAccessRights: async (req, res) => {

    try {
      const { accessRightsList } = req.body;
      if (!accessRightsList) {
        TE({ 'error': 'access right list not available.' });
      }
      const accessRightList = await Service.createMultipleAccessRights(accessRightsList);

      SUCCESS(res, 201, accessRightList);

    } catch (error) {

      ERROR(res, error);
    }
  },


  updateAccessRight: async (req, res) => {

    try {

      const { query, updates } = req.body;

      if (!query || Object.keys(query).length === 0) TE({ 'error': 'Query not found' });

      const transaction = await Service.updateAccessRight(query, updates);

      SUCCESS(res, 200, transaction);

    } catch (error) {

      ERROR(res, error);
    }
  },
};