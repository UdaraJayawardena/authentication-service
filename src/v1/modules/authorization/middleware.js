/* eslint-disable require-atomic-updates */
const { ResponseHandler } = require('../../handlers');

const { TE } = require('../../../helper');

const { ERROR, SUCCESS } = ResponseHandler;



const { Config } = require('../../../../config');
const jwt = require('jsonwebtoken');

module.exports = {

  validateLoginDetails: async (req, res, next) => {
    try {
      const loginData = req.body;

      if (!loginData.userId) TE({ code: 400, message: 'userId required.' });

      if (!loginData.password)
        TE({ code: 400, message: 'need Password' });

      next();
    } catch (error) {
      ERROR(res, error);
    }
  },

  validateAutenticateDetails: async (req, res, next) => {
    try {
      const authenticateData = req.body;
      const { authorization } = req.headers;

      if (!authenticateData.type) TE({ code: 400, message: 'type required.' });

      if (!authorization)
        TE({ code: 400, message: 'need authoriization token' });

      next();
    } catch (error) {
      ERROR(res, error);
    }
  },

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


  validateUserAuthorization: async (req, res, next) => {
    try {
      const userData = req.user;
      const userType = Config.ACCESS_LEVELS.primary;

      if (userData) {
        if (userType.includes(userData.userType)) {
          return next();
          // eslint-disable-next-line no-else-return
        } else {
          TE({ code: 403, message: 'You cannot access for this.' });
        }
      } else {
        TE({ code: 403, message: 'Failed to check access token.' });
      }

      // next();
    } catch (error) {
      ERROR(res, error);
    }
  },

  sendAuthorizeSuccess: async (req, res) => {
    try {
      const language = req.user.permisssions ? req.user.permisssions
        .find(singlePermission => singlePermission.name == 'PreferredLanguage') : null;

      const userDetails = {
        email: req.user.email,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        userType: req.user.userType,
        preferredLanguage: language ? language.value : ''
      };
      SUCCESS(res, 200, { hasAuthorize: true, userDetails: userDetails });

      // next();
    } catch (error) {
      ERROR(res, error);
    }
  },


  isAuthenticate: async (req, res) => {
    try {
      const data = req.body;
      const type = data.type;
      const user = req.user;


      if (user.userType == 'superAdmin') {
        return SUCCESS(res, 200, { hasPermission: true });
      }
      else if (user.permisssions) {
        // need to check given operation has permission to this user
        let permission = [];
        // check type is array or single permission type
        if (Array.isArray(type)) {
          // there are many types give permissions
          type.forEach(element => {
            const tempArr = user.permisssions.filter(function (singlePermission) {
              return singlePermission.name == element;
            });
            permission.push.apply(permission, tempArr);
          });
        } else {
          permission = user.permisssions.filter(function (singlePermission) {
            return singlePermission.name == type;
          });
        }

        if (permission.length > 0) {
          // permission has set
          // need to check user can do that operation
          let count = 0;
          permission.forEach(sp => {
            if (sp.value == '1') {
              count++;
            }
          });
          // check permission has set to even one.
          if (count > 0) {
            return SUCCESS(res, 200, { hasPermission: true });
            // eslint-disable-next-line no-else-return
          } else {
            // user cannot do that operation
            TE({ code: 403, message: 'You don\'t have permission' });
          }
        } else {
          // this user has not set that operation even
          TE({ code: 403, message: 'You don\'t have permission' });
        }

      } else {
        // given user has not any permission
        TE({ code: 403, message: 'You don\'t have permission' });
      }
    } catch (error) {
      ERROR(res, error);
    }
  },


};
