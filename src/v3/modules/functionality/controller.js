const Service = require('./service');

const { ResponseHandler } = require('../../handlers');

const { TE } = require('../../../helper');

const { ERROR, SUCCESS } = ResponseHandler;

module.exports = {

  getFunctionalities: async (req, res) => {

    try {

      const params = req.query;

      const functionalities = await Service.getFunctionalities(params);

      SUCCESS(res, 200, functionalities);

    } catch (error) {

      ERROR(res, error);
    }
  },

  createSingleFunctionality: async (req, res) => {

    try {

      const fuctionality = await Service.createSingleFunctionality(req.body);

      SUCCESS(res, 201, fuctionality);

    } catch (error) {

      ERROR(res, error);
    }
  },

  createMultipleFunctionalities: async (req, res) => {

    try {
      const { functionalityList } = req.body;
      if (!functionalityList) {
        TE({ 'error': 'functionality list not available.' });
      }
      const functionalitiesList = await Service.createMultipleFunctionalities(functionalityList);

      SUCCESS(res, 201, functionalitiesList);

    } catch (error) {

      ERROR(res, error);
    }
  },


  updateFunctionality: async (req, res) => {

    try {

      const { query, updates } = req.body;

      if (!query || Object.keys(query).length === 0) TE({ 'error': 'Query not found' });

      const functionality = await Service.updateFunctionality(query, updates);

      SUCCESS(res, 200, functionality);

    } catch (error) {

      ERROR(res, error);
    }
  },
};