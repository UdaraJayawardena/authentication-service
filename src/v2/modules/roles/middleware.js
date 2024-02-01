/* eslint-disable require-atomic-updates */
const { ResponseHandler } = require('../../handlers');

const { TE, to } = require('../../../helper');

const { ERROR, SUCCESS } = ResponseHandler;

const service = require('./service');
const userService = require('../users/service');


module.exports = {

  getUsersAccordingToRole: async (req, res) => {
    try {
      const { role } = req.query;
      let assignedUsers = [];

      if (role) {
        // get role id from role service to get users from user service
        const param = { name: role };
        const [err1, roles] = await to(service.getRecodes(param));
        if (err1) {
          TE({ code: 400, message: 'given role is not valid one.' });
        }
        if (roles.length > 0) {
          const roleId = roles[0]._id;
          // get user details according to role Id
          const [err2, users] = await to(userService.getRecodes({ role: roleId, active : true }));
          if (err2) {
            throw err2;
          }
          const formattedUsers = [];
          users.forEach(user => {
            formattedUsers.push(user.name);
          });
          assignedUsers = formattedUsers;

          // assignedUsers = users;

        }

      } else {
        TE({ code: 400, message: 'Role not given.' });
      }

      SUCCESS(res, 200, { users: assignedUsers });
    } catch (error) {
      ERROR(res, error);
    }
  },


};
