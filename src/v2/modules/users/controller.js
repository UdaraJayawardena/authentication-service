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
      const { userList } = req.body;
      if (!userList) {
        TE({ 'error': 'user list not available.' });
      }
      const dataList = await Service.createMultipleRecodes(userList);

      SUCCESS(res, 201, dataList);

    } catch (error) {

      ERROR(res, error);
    }
  },


  updateRecode: async (req, res) => {

    try {

      const { query, updates } = req.body;

      if (!query || Object.keys(query).length === 0) TE({ 'error': 'Query not found' });

      const transaction = await Service.updateRecode(query, updates);

      SUCCESS(res, 200, transaction);

    } catch (error) {

      ERROR(res, error);
    }
  },
};