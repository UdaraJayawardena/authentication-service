const Service = require('./service');

const { ResponseHandler } = require('../../handlers');

const { TE } = require('../../../helper');

const { ERROR, SUCCESS } = ResponseHandler;

module.exports = {

  getRecodes: async (req, res) => {

    try {

      const params = req.query;

      const data = await Service.getRecodes(params);

      SUCCESS(res, 200, data);

    } catch (error) {

      ERROR(res, error);
    }
  },

  getRecodesForSelf: async (req, res) => {

    try {

      const params = req.query;
      const user = req.user;

      const data = await Service.getRecodesForSelf(params, user);

      SUCCESS(res, 200, data);

    } catch (error) {

      ERROR(res, error);
    }
  },

  createRecode: async (req, res) => {

    try {

      const dataList = await Service.createSingleRecode(req.body);

      SUCCESS(res, 201, dataList);

    } catch (error) {

      ERROR(res, error);
    }
  },

  createMultipleRecodes: async (req, res) => {

    try {
      const { myDashboardList } = req.body;
      if (!myDashboardList) {
        TE({ 'error': 'myDashboardList list not available.' });
      }
      const dataList = await Service.createMultipleRecodes(myDashboardList);

      SUCCESS(res, 201, dataList);

    } catch (error) {

      ERROR(res, error);
    }
  },


  updateRecode: async (req, res) => {

    try {

      const { query, updates, frontEndPortalId } = req.body;

      if (!query || Object.keys(query).length === 0) TE({ 'error': 'Query not found' });
      if (!frontEndPortalId) TE({ 'error': 'frontEndPortalId required.' });

      const updatedData = await Service.updateRecode(query, updates, frontEndPortalId);

      SUCCESS(res, 200, updatedData);

    } catch (error) {

      ERROR(res, error);
    }
  },
};