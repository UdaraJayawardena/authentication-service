/* eslint-disable require-atomic-updates */
const { ResponseHandler } = require('../../handlers');

const { TE, to } = require('../../../helper');

const { ERROR, SUCCESS } = ResponseHandler;

const database = require('./database');
const serviceModuleFieldDatabase = require('../serviceModuleField/database');


module.exports = {

  getSearchFieldsWithDisplayData: async (req, res) => {
    try {
      // get serach fields vs wireframe
      let searchFiedsWithWireframe = [];
      // const finaldata = [];
      let query = null;
      if (req.method == 'GET') {
        query = req.query;
      } else {
        query = req.body;
      }

      const [err1, availableSearchFields] = await to(database.findByQuery({ where: query }));
      if (err1) TE(err1);
      if (availableSearchFields.length > 0) {
        // this meean wireframe with search fields available
        searchFiedsWithWireframe = JSON.parse(JSON.stringify(availableSearchFields));
        for (let i = 0; i < searchFiedsWithWireframe.length; i++) {
          const sws = searchFiedsWithWireframe[i]; // single wireframe vs search field
          let displayFields = [];
          const [err2, availableDisplayField] = await to(serviceModuleFieldDatabase.findByQuery({ where: { serviceModuleId: sws.serviceModuleId } }));
          if (err2) displayFields = [];
          if (availableDisplayField) displayFields = availableDisplayField;

          searchFiedsWithWireframe[i].displayFields = displayFields;
        }

      }

      SUCCESS(res, 200, searchFiedsWithWireframe);
    } catch (error) {
      ERROR(res, error);
    }
  },


};
