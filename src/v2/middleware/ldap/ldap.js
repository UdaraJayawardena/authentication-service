const LdapService = require('../../services/ldap');
const jwt = require('jsonwebtoken');
const passwordGenerator = require('generate-password');

const { to, TE } = require('../../../helper');

const { ResponseHandler } = require('../../handlers');

const { ERROR, SUCCESS } = ResponseHandler;

const AnonymousUserDatabase = require('../../modules/anonymousUser/database');

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
            //   const token = jwt.sign({ userPayload }, 'secret',{ expiresIn: 60 });

            const token = jwt.sign({ userPayload }, 'secret');
            return SUCCESS(res, 200, { token: token });

          }

          TE({ code: 401, message: 'No Users Found' });


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
  },

  getUsersForCamunda: async (req, res) => {

    try {
      const users = [];
      const [err, userData] = await to(LdapService.getAllUsers());
      if (err) TE(err);
      if (userData.results.length > 0) {

        const promArray = [];
        const allUpdatedUsers = [];
        for (let i = 0; i < userData.results.length; i++) {
          const singleUser = userData.results[i];
          const attributes = [...singleUser.attributes];
          const role = attributes.find(sa => sa.name == 'role');
          const camundaPassword = attributes.find(sa => sa.name == 'camundaPassword');
          // roles available users need for camunda
          if (role) {
            const userObj = {
              id: singleUser.id,
              username: singleUser.username,
              firstname: singleUser.firstname,
              lastname: singleUser.lastname,
              email: singleUser.email,
              role: role.value,
              camundaPassword: camundaPassword ? camundaPassword.value : ''
            };
            users.push(userObj);
          }

          // need to camunda password if not avialable roles availabe users.
          if (role && !camundaPassword) {
            // need to add password
            const password = passwordGenerator.generate({ length: 10, numbers: true });
            attributes.push({ name: 'camundaPassword', value: password });
            const id = singleUser.id;
            const updateObj = {
              attributes: attributes
            };


            const updateUser = async (id, updateObj) => {
              const updatedUser = await LdapService.updateUser(id, updateObj);
              allUpdatedUsers.push(updatedUser);
              return;
            };

            promArray.push(updateUser(id, updateObj));

          }


        }
        // update camunda password that not available camundaPassword
        await Promise.all(promArray);
        for (let i = 0; i < users.length; i++) {
          const user = users[i];
          if (user.camundaPassword == '') {
            // need to upadate with user new camunda password
            const updatedUserDeatils = allUpdatedUsers.find(el => el.id == user.id);
            if (updatedUserDeatils) {
              const attributes = updatedUserDeatils.attributes;
              const updatedUserCamundaPassword = attributes.find(sa => sa.name == 'camundaPassword');
              if (updatedUserCamundaPassword) {
                user.camundaPassword = updatedUserCamundaPassword.value;
              }
            }
          }

        }

      }
      // bind anonymous users 
      const anonymousUsers = await AnonymousUserDatabase.findByQuery({});
      if (anonymousUsers.length > 0) {
        for (let i = 0; i < anonymousUsers.length; i++) {
          const singleAU = anonymousUsers[i];
          const userObj = {
            id: singleAU.id,
            username: singleAU.userName,
            firstname: singleAU.firstName,
            lastname: singleAU.lastName,
            email: singleAU.email,
            role: 'Anonymous',
            camundaPassword: singleAU.camundaPassword
          };
          users.push(userObj);

        }
      }


      if (users.length == 0) {
        TE({ code: 401, message: 'No Users Found' });
      }


      SUCCESS(res, 200, { users: users });
    } catch (error) {
      ERROR(res, error);
    }
  },


};