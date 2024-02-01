/* eslint-disable require-atomic-updates */
const { ResponseHandler } = require('../../handlers');

const { TE, to } = require('../../../helper');

const { ERROR, SUCCESS } = ResponseHandler;

const clusterService = require('../cluster/service');
const database = require('./database');
const dashboardDatabase = require('../dashboard/database');

// const { Op } = require('sequelize');

const frontEndPortalList = [
  { 'name': 'Bridgefund portal', 'key': 'BFP' },
  { 'name': 'Bridgefund funder management portal', 'key': 'BFFMP' },
  { 'name': 'Bridgefund foundation portal', 'key': 'BFFP' },
];

const clustersUpdateArray = [
  { query: { 'name': 'BF_Loan_Management' }, updates: { frontEndPortalId: 'Bridgefund portal' } },
  { query: { 'name': 'BF_Initiation' }, updates: { frontEndPortalId: 'Bridgefund portal' } },
  { query: { 'name': 'BF_CRM' }, updates: { frontEndPortalId: 'Bridgefund portal' } },
  { query: { 'name': 'BF_Funders' }, updates: { frontEndPortalId: 'Bridgefund funder management portal' } },
  { query: { 'name': 'BF_Foundation' }, updates: { frontEndPortalId: 'Bridgefund foundation portal' } }
];


module.exports = {

  seedPortals: async (req, res) => {
    try {
      const messages = [];
      // get clusters according to portal
      const [err1, availablePortals] = await to(database.findByQuery({}));
      if (err1) TE(err1);
      if (availablePortals.length == 0) {
        // this meean portals not seed yet so need to seed data.
        const [err2, portals] = await to(database.createMultipleRecodes(frontEndPortalList));
        if (err2) TE(err2);
        if (portals.length > 0) {
          // portals has been seeds
          messages.push('portals are seed.(need to update clusters)');
          // need update clusters according to portals
          for (let i = 0; i < clustersUpdateArray.length; i++) {
            const CUA = clustersUpdateArray[i];
            const selectedPortal = portals.find(p => p.name == CUA.updates.frontEndPortalId);
            if (selectedPortal) {
              CUA.updates.frontEndPortalId = selectedPortal.id;
              const [err3, updatedCluster] = await to(clusterService.updateRecode(CUA.query, CUA.updates));
              if (err3) TE(err3);
              if (updatedCluster) messages.push(`${updatedCluster[0].name} cluster update portal ${updatedCluster[0].frontEndPortalName}`);
            }
          }

          // need to update current dashboards portal field
          const selectedPortalForDashboards = portals.find(p => p.name == frontEndPortalList[0].name);
          if (selectedPortalForDashboards) {
            const [err4, updatedDahboards] = await to(dashboardDatabase.updateRecode({ where: { frontEndPortalId: null } }, { frontEndPortalId: selectedPortalForDashboards.id }));
            if (err4) TE(err4);
            if (updatedDahboards.length > 0) {
              messages.push('All dashboards portalId field also updated.');
            }
          }

        }

      } else {
        messages.push('There are some portals availble currently so seed wont proceed.');
      }


      SUCCESS(res, 200, messages);
    } catch (error) {
      ERROR(res, error);
    }
  },


};
