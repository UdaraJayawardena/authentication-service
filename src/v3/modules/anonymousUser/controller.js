const Service = require('./service');

const { ResponseHandler } = require('../../handlers');

const { to, TE } = require('../../../helper');

const { ERROR, SUCCESS } = ResponseHandler;

const jwt = require('jsonwebtoken');

const Database = require('./database');

const CryptoJS = require('crypto-js');

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

  getToken: async (req, res) => {

    try {

      const body = req.body;
      if (!(body && body.permissionKey)) TE({ 'error': 'permissionKey not given' });

      const key = { permissionKey: body.permissionKey };
      let token = null;

      const data = await Service.getRecodes(key);
      if (data.length > 0) {
        const AUR = data[0];
        if (AUR.status == 'active') {
          // account active
          const userPayload = {
            userName: AUR.userName,
            email: AUR.email,
            organization: AUR.organization,
            firstName: AUR.firstName,
            lastName: AUR.lastName,
            role: 'Anonymous',
            camundaUserId: AUR.camundaUserId,
            camundaPassword: AUR.camundaPassword
          };
          // GENERATE TOKEN WITH EXPIRE TIME
          const expiration = 60 * 60 * 48;
          token = jwt.sign({ userPayload }, 'secret', { expiresIn: expiration });

        } else {
          // account not active
          TE({ 'error': 'Account not valid' });
        }
      } else {
        TE({ 'error': 'Account not valid' });
      }

      SUCCESS(res, 200, { token: token });

    } catch (error) {

      ERROR(res, error);
    }
  },


  permissionCodeUpdate: async (req, res) => {

    try {

      const body = req.body;
      if (!(body && body.id)) TE({ 'error': 'id not given' });

      const key = { id: body.id };

      const getAccount = Database.findOneByQuery({ where: key });

      const [err, result] = await to(getAccount);

      if (err) TE(err);

      if (!result) TE({ 'error': 'Account not valid' });

      const time = new Date().getTime();
      const message = time + result.organization + result.userName;
      const newPermissionKey = CryptoJS.HmacSHA1(message, 'Seacret key').toString();

      const updateRecode = Database.updateRecode({ where: key }, { permissionKey: newPermissionKey });

      const [err1, result1] = await to(updateRecode);

      if (err1) TE(err1);

      if (!result1) TE('Result not found');

      const getAccountUpdated = Database.findOneByQuery({ where: key });

      const [err2, result2] = await to(getAccountUpdated);
      if (err2) TE(err2);

      if (!result2) TE('Result not found');

      // ""
      SUCCESS(res, 200, { newPermissionKey: result2.permissionKey });

    } catch (error) {

      ERROR(res, error);
    }

  },

};