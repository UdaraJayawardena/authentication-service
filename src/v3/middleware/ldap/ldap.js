/* eslint-disable */
const LdapService = require('../../services/ldap');
const jwt = require('jsonwebtoken');
const passwordGenerator = require('generate-password');

const { to, TE } = require('../../../helper');

const { ResponseHandler } = require('../../handlers');

const { ERROR, SUCCESS } = ResponseHandler;

const AnonymousUserDatabase = require('../../modules/anonymousUser/database');
const userDatabase = require('../../modules/users/database');

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
        const [err1, userData] = await to(LdapService.getUser(userId));
        if (err1) TE(err1);
        if (userData.results.length > 0) {

          const LoggedUser = userData.results.filter(function (user) {
            return user.username == userId;
          });

          if (LoggedUser.length > 0) {
            const role = LoggedUser[0].attributes.find((permission) => {
              return permission.name == 'role';
            });

            const profileImage = LoggedUser[0].attributes.find((permission) => {
              return permission.name == 'profileImage';
            });

            const availbleUser = await userDatabase.findByQuery({ where: { userName: userId } });
            let userIdNeedToSet = null;
            if (availbleUser.length > 0) {
              // user avalilable in the system
              userIdNeedToSet = availbleUser[0].id;
            }

            const userPayload = {
              userName: userId,
              email: LoggedUser[0].email,
              userId: userIdNeedToSet,//LoggedUser[0].id,
              firstName: LoggedUser[0].firstname,
              lastName: LoggedUser[0].lastname,
              userType: LoggedUser[0].employeeType,
              permisssions: LoggedUser[0].attributes,
              role: (role) ? role.value : '',
              profileImage: (profileImage) ? profileImage.value : null
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
          const profileImage = attributes.find(sa => sa.name == 'profileImage');
          // roles available users need for camunda
          if (role) {
            const userObj = {
              id: singleUser.id,
              username: singleUser.username,
              firstname: singleUser.firstname,
              lastname: singleUser.lastname,
              email: singleUser.email,
              role: role.value,
              camundaPassword: camundaPassword ? camundaPassword.value : '',
              profileImage: profileImage ? profileImage.value : null

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

      // filter by active users
      const activeUsers = await userDatabase.findByQuery({ where: { active: true } });
      let needAnonymousUsers = false;
      if (req.query.needAnonymousUsers && req.query.needAnonymousUsers == 1) {
        needAnonymousUsers = true;
      }

      let usersArray = [];
      if (activeUsers.length > 0) {
        for (let i = 0; i < users.length; i++) {
          const su = users[i];
          if (su.role == 'Anonymous') {
            if (needAnonymousUsers) {
              usersArray.push(su);
            }
          } else {
            const selectedActiveUser = activeUsers.find((e) => { return (e.userName === su.username); });
            if (selectedActiveUser) {
              usersArray.push(su);
            }
          }

        }
      } else if (needAnonymousUsers) {
        usersArray = users.filter((SCU) => { return SCU.role == 'Anonymous'; });
      }


      // sort users by role
      usersArray.sort((a, b) => {
        // Use toUpperCase() to ignore character casing
        const RoleA = a.role.toUpperCase();
        const RoleB = b.role.toUpperCase();

        let comparison = 0;
        if (RoleA > RoleB) {
          comparison = 1;
        } else if (RoleA < RoleB) {
          comparison = -1;
        }
        return comparison;
      });
      const finalUserArray = usersArray;

      SUCCESS(res, 200, { users: finalUserArray });
    } catch (error) {
      ERROR(res, error);
    }
  },

  createJumpCloudUser: async (req, res) => {
    try {
      const data = req.body;
      if (data) {

        const userData = {
          username: data.userName,
          firstname: data.firstName,
          lastname: data.lastName,
          displayname: data.displayName,
          email: data.email,
          password: data.password,
          ldap_binding_user: true,
          phoneNumbers: [
            {
              number: data.phone,
              type: 'phone'
            }
          ],
          attributes: [
            {
              name: 'profileImage',
              value: data.profileImage
            },
            {
              name: 'roleId',
              value: data.roleId
            },
            {
              name: 'role',
              value: data.roleName
            },
            {
              name: 'PreferredLanguage',
              value: data.preferredLanguage
            },
            {
              name: 'camundaPassword',
              value: data.password
            }

          ]
        };

        const [err, response] = await to(LdapService.createUser(userData));

        if (err) {
          TE({ code: 401, message: `Error: ${err.response.data.message}` });
        }

        if (!response) {
          TE({ code: 401, message: 'Error creating user in jumpcloud!' });
        }


        SUCCESS(res, 200, { jumpcloudUser: response, LoggedUser: req.user });

      }

    } catch (err) {
      ERROR(res, err);
    }
  },

  createLdapAssiociation: async (req, res, next) => {
    try {

      const userId = req.body.jumpcloudUserId;
      const assciationdata = {
        op: 'add',
        type: 'user',
        id: userId
      };

      const [err] = await to(LdapService.createLdapAssiociation(assciationdata));
      if (err) TE({ code: 401, message: 'Error assign user to directory!' });

      return next();

    } catch (err) {
      ERROR(res, err);
    }
  },

  bindUsersToUserGroups: async (req, res) => {
    try {
      const data = req.body.user;
      const userId = req.body.jumpcloudUserId;
      const reqData = {
        groupId: data.group,
        userData: {
          op: 'add',
          type: 'user',
          id: userId
        }
      };

      const [err] = await to(LdapService.manageUsersInUserGroups(reqData));
      if (err) {

        TE({ code: 401, message: 'Error assign user to group!' });
      }

      return SUCCESS(res, 200, { user: data });

    } catch (err) {
      ERROR(res, err);
    }
  },

  getUserGroups: async (req, res) => {
    try {
      const [err, response] = await to(LdapService.getUserGroups());
      if (err) TE({ code: 401, message: 'Error fetching user groups!' });

      return SUCCESS(res, 200, response);

    } catch (err) {
      ERROR(res, err);
    }
  },

  deleteJumpcloudUser: async (req, res) => {
    try {
      const userName = req.body.userName;
      let userId = '';

      if (userName) {
        const [err, userData] = await to(LdapService.getUser(userName));	

        if (err) TE({ code: 401, message: `Error: ${err.userData.data.message}` });	
        if (!userData.results) TE({ code: 401, message: 'Error getting user!' });	
        
        const userObj = userData.results[0];	
        userId = userObj._id;

        if (userId && userId !== '') {
          const [err, response] = await to(LdapService.deleteJumpcloudUser(userId));

          if (err) TE({ code: 401, message: `Error: ${err.response.data.message}` });
          
          SUCCESS(res, 200, { deletedUser: response });

        } else {
          TE({ code: 401, message: 'UserId not found' });
        }

      } else {
        TE({ code: 401, message: 'UserName required!' });
      }

    } catch (err) {
      ERROR(res, err);
    }
  },

  getUserGroupsByUser: async (req, res) => {
    try {

      const { userName } = req.body;
      let userId = "";

      const [err, userData] = await to(LdapService.getUser(userName));	

      if (err) TE({ code: 401, message: `Error: ${err.userData.data.message}` });	

      if (!userData.results) TE({ code: 401, message: 'Error getting user!' });	

      const userObj = userData.results[0];	
      userId = userObj._id;

      if (userId && userId !== '') {
        const [err, response] = await to(LdapService.getUserGroupsByUser(userId));
        if (err) TE({ code: 401, message: `Error: ${err.response.data.message}` });
        let structuredGroup = {
          id: response[0].id,
          userId: userId
        }

        SUCCESS(res, 200, structuredGroup);
      }

    } catch (err) {
      ERROR(res, err);
    }
  },

  updateJumpcloudUser: async (req, res) => {
    try {
      const updates = req.body;
      const userName = updates.userName;
      let userId = "";
      let oldAttributes = [];

     const [err, userData] = await to(LdapService.getUser(userName));	

      if (err) TE({ code: 401, message: `Error: ${err.userData.data.message}` });	

      if (!userData.results) TE({ code: 401, message: 'Error getting user!' });	

      const userObj = userData.results[0];	
      
      userId = userObj._id;	
      oldAttributes = userObj.attributes;

      if (userId && userId !== '') {

        let updateObj = {
          selector: userId,
          updates: {
            firstname: updates.firstName,
            lastname: updates.lastName,
            email: updates.email,
            displayname: updates.displayName,
            phoneNumbers: [
              {
                number: updates.phone,
                type: 'phone'
              }
            ],
            attributes: [
              {
                name: 'profileImage',
                value: updates.profileImage
              },
              {
                name: 'roleId',
                value: updates.roleId
              },
              {
                name: 'role',
                value: updates.roleName
              },
              {
                name: 'PreferredLanguage',
                value: updates.preferredLanguage
              }
            ]
          }
        };

        if (updates.password !== '') {
          updateObj.updates.password = updates.password;
          updateObj.updates.attributes.push({
            name: 'camundaPassword',
            value: updates.password
          });

        } else {
          oldAttributes.forEach((item) => {
            if (item.name === 'camundaPassword') {
              updateObj.updates.attributes.push(item);
              updateObj.updates.password = item.value;
            };
          })
        }

        const [err, response] = await to(LdapService.updateJumpcloudUser(updateObj));
        if (err) TE({ code: 401, message: `Error: ${err.response.data.error}` });

        SUCCESS(res, 200, { updated: response });

      } else {
        TE({ code: 401, message: 'UserId not found' });
      }

    } catch (err) {
      ERROR(res, err);
    }
  },

  updateJumpcloudUserGroup: async (req, res) => {
    try {
      const userGroup = req.body;
      if (userGroup) {

        const oldGroup = userGroup.oldGroup;
        const newGroup = userGroup.newGroup;
        const userId = userGroup.userId;

        const removeUser = {
          groupId: oldGroup,
          userData: {
            op: 'remove',
            type: 'user',
            id: userId
          }
        };

        // remove from current group
        const [err] = await to(LdapService.manageUsersInUserGroups(removeUser));
        if (err) TE({ code: 401, message: 'Error removing user from group!' });

        // add to new group
        const addUser = {
          groupId: newGroup,
          userData: {
            op: 'add',
            type: 'user',
            id: userId
          }
        };

        const [err2] = await to(LdapService.manageUsersInUserGroups(addUser));
        if (err2) TE({ code: 401, message: 'Error assign user to group!' });

        return SUCCESS(res, 200, { success: true });

      } else {
        TE({ code: 401, message: 'user group not found' });
      }

    } catch (err) {
      ERROR(res, err);
    }
  }

};