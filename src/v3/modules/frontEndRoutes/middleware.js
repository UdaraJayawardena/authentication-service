const { ResponseHandler } = require('../../handlers');
const { ERROR } = ResponseHandler;

const getMergedClusters = (req, res, next) => {
  try {

    if (!req.query.cluster) return next();

    const mergedClusters = [
      ['BF_Loan_Management', 'BF_Initiation', 'BF_CRM']
    ];

    let clusters = [];
    for (const mergedCluster of mergedClusters) {
      if (mergedCluster.includes(req.query.cluster)) clusters = mergedCluster;
    }

    req.clusters = clusters;

    next();
  } catch (error) {
    ERROR(res, error);
  }
};

module.exports = {
  getMergedClusters,
};