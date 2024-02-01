const jwt = require('jsonwebtoken');

const { TE } = require('../../../helper');

const { ResponseHandler } = require('../../handlers');

const { ERROR } = ResponseHandler;

module.exports = {

  decodeToken: async (req, res, next) => {
    try {
      const { authorization } = req.headers;

      if (authorization) {
        const tokenData = authorization.split(' ')[1];
        let decodeToken;
        jwt.verify(tokenData, 'secret', (err, decoded) => {
          if (err) {
            TE({ code: 401, message: 'Failed to authenticate token.' });
          } else {
            decodeToken = decoded;
          }
        });
        req.user = decodeToken.userPayload;
      } else {
        TE({ code: 401, message: 'authenticate token not available.' });
      }

      next();
    } catch (error) {
      ERROR(res, error);
    }
  },
};