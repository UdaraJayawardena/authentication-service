/* eslint-disable require-atomic-updates */
const { ResponseHandler } = require('../../handlers');

const { TE, to } = require('../../../helper');

const { ERROR, SUCCESS } = ResponseHandler;

const clusterDatabase = require('../cluster/database');
const database = require('./database');

const { Op } = require('sequelize');


module.exports = {

  validateWireframesAccordingToPortal: async (req, res) => {
    try {
      const { portalId } = req.query;
      if (!portalId) TE({ code: 400, message: 'portalId required.' });
      // get clusters according to portal
      const [err, clusters] = await to(clusterDatabase.findByQuery({ where: { frontEndPortalId: portalId } }));
      if (err) TE(err);
      if (clusters.length == 0) TE({ code: 400, message: 'Maching wireframes not availble.' });
      // prepair clusterIds
      const clusterIds = [];
      for (let i = 0; i < clusters.length; i++) {
        const c = clusters[i];
        clusterIds.push(c.id);
      }

      // get wireframes
      const [err1, wireFrames] = await to(database.findByQuery({ where: { clusterId: { [Op.in]: clusterIds } } }));
      if (err1) TE(err1);

      SUCCESS(res, 200, wireFrames);
    } catch (error) {
      ERROR(res, error);
    }
  },


};
