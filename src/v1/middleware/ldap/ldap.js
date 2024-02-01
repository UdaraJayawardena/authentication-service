const LdapService = require('../../services/ldap');
const jwt = require('jsonwebtoken');

const { to, TE } = require('../../../helper');

const { ResponseHandler } = require('../../handlers');

const { ERROR, SUCCESS } = ResponseHandler;

module.exports = {

  login: async (req, res) => {

    try {
      const userId = req.body.userId;
      const password = req.body.password;


      const [err, response] = await to(
        LdapService.authenticate(userId, password)
      );

      if (err) TE({ code: 401, message: 'Invalid Credentials' });

      if (response) {
        const [err1, userData] = await to(LdapService.getAllUsers());
        if (err1) TE(err1);
        if (userData.results.length > 0) {

          const LoggedUser = userData.results.filter(function (user) {
            return user.username == userId;
          });

          if (LoggedUser.length > 0) {
            const role = LoggedUser[0].attributes.find((permission) => {
              return permission.name == 'role';
            });
            const userPayload = {
              userName: userId,
              email: LoggedUser[0].email,
              userId: LoggedUser[0].id,
              firstName: LoggedUser[0].firstname,
              lastName: LoggedUser[0].lastname,
              userType: LoggedUser[0].employeeType,
              permisssions: LoggedUser[0].attributes,
              role: (role) ? role.value : ''
            };
            // GENERATE TOKEN WITH EXPIRE TIME
            // const token = jwt.sign({ userPayload }, 'secret', { expiresIn: 60 });

            const token = jwt.sign({ userPayload }, 'secret');
            SUCCESS(res, 200, { token: token });

          } else {
            TE({ code: 401, message: 'No Users Found' });
          }

        } else {
          TE({ code: 401, message: 'No Users Found' });
        }
      }
      else {
        TE({ code: 401, message: 'No Users Found' });
      }
    } catch (error) {
      ERROR(res, error);
    }
  }
};