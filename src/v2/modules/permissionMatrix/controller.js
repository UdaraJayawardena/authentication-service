const Service = require('./service');

const { ResponseHandler } = require('../../handlers');

const { TE } = require('../../../helper');

const { ERROR, SUCCESS } = ResponseHandler;

const { setRecordsToCacheInternally } = require('./middleware');

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
      // setRecordsToCacheInternally([dataList._id]);
      setRecordsToCacheInternally();

      SUCCESS(res, 201, dataList);

    } catch (error) {

      ERROR(res, error);
    }
  },

  createMultipleRecodes: async (req, res) => {

    try {
      const { permissionList } = req.body;
      if (!permissionList) {
        TE({ 'error': 'permissionList not available.' });
      }
      const dataList = await Service.createMultipleRecodes(permissionList);
      // const permissionIdList = [];
      // for (let i = 0; i < dataList.length; i++) {
      //   const p = dataList[i];
      //   permissionIdList.push(p._id.toString());

      // }

      // setRecordsToCacheInternally(permissionIdList);
      setRecordsToCacheInternally();

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
      setRecordsToCacheInternally();

      SUCCESS(res, 200, transaction);

    } catch (error) {

      ERROR(res, error);
    }
  },






};

