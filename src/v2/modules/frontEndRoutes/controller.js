const Service = require('./service');

const { ResponseHandler } = require('../../handlers');

const { ERROR, SUCCESS } = ResponseHandler;

const getFrontEndRoutes = async (req, res) => {

  try {

    const cluster = req.query.cluster;
    const isGetPermissions = req.query.isGetPermissions;

    const permissions = req.permissions;

    const routes = await Service.getRotues(cluster, permissions);

    const response = { routes };

    if (isGetPermissions) response.permissions = permissions;

    SUCCESS(res, 200, response);

  } catch (error) {

    ERROR(res, error);
  }
};

module.exports = {
  getFrontEndRoutes,
};