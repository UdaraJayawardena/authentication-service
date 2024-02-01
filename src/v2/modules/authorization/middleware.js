/* eslint-disable require-atomic-updates */
const { ResponseHandler } = require('../../handlers');

const { TE, to } = require('../../../helper');

const { ERROR, SUCCESS } = ResponseHandler;

const fs = require('fs');

const { AccessRightService } = require('../accessRights');
const { ClusterService } = require('../cluster');
const { FunctionalityService } = require('../functionality');
const { RoleService } = require('../roles');
const { UserService } = require('../users');
const { PermissionMatrixService } = require('../permissionMatrix');
const { setRecordsToCacheInternally } = require('../permissionMatrix/middleware');


// const { Config } = require('../../../../config');
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

  validateUserPermissionRequest: async (req, res, next) => {
    try {

      const { cluster } = req.query;
      const { authorization } = req.headers;

      if (!cluster) TE({ code: 400, message: 'Cluster required.' });

      if (!authorization)
        TE({ code: 400, message: 'need authoriization token' });

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
      // const userType = Config.ACCESS_LEVELS.primary;

      if (userData) {
        return next();
        // eslint-disable-next-line no-else-return
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

      const camundaUserId = req.user.permisssions ? req.user.permisssions
        .find(singlePermission => singlePermission.name == 'camundaUserId') : null;

      const camundaPassword = req.user.permisssions ? req.user.permisssions
        .find(singlePermission => singlePermission.name == 'camundaPassword') : null;

      const userDetails = { ...req.user };
      delete userDetails.permisssions;

      // const userDetails = {
      //   email: req.user.email,
      //   firstName: req.user.firstName ? req.user.firstName : '',
      //   lastName: req.user.lastName ? req.user.lastName : '',
      //   userType: req.user.userType ? req.user.userType : '',
      //   preferredLanguage: language ? language.value : '',
      //   camundaUserId: camundaUserId ? camundaUserId.value : ''
      // };
      // console.log(req.user);
      userDetails.preferredLanguage = language ? language.value : '';
      userDetails.camundaUserId = camundaUserId ? camundaUserId.value : '';
      userDetails.camundaPassword = camundaPassword ? camundaPassword.value : '';

      if (req.user.role == 'Anonymous') {
        userDetails.camundaUserId = req.user.camundaUserId ? req.user.camundaUserId : '';
        userDetails.camundaPassword = req.user.camundaPassword ? req.user.camundaPassword : '';
      }

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


  validateAccessMatrixFile: async (req, res, next) => {
    try {
      // check matrix file exsits first.
      if (fs.existsSync('uploads/doc.xlsx')) {
        next();
      } else {
        TE({ code: 400, message: 'matrix file not found.' });
      }

    } catch (error) {
      ERROR(res, error);
    }
  },


  addAccessRights: async (req, res, next) => {
    try {
      let accessRights = [];
      const convertedFile = req.convertedFile;
      const allSheats = Object.keys(convertedFile);
      if (allSheats.length > 0) {
        for (let i = 0; i < allSheats.length; i++) {
          const cluster = allSheats[i];
          if (cluster !== 'Business_roles') {
            accessRights = generateAccessRightsArray(convertedFile[cluster], accessRights);
          }
        }
      }
      // if ('BF_Funders' in convertedFile) {
      //   // funder access rights available
      //   accessRights = generateAccessRightsArray(convertedFile.BF_Funders, accessRights);
      // }
      // if ('BF_Foundation' in convertedFile) {
      //   // foundation access rights available
      //   accessRights = generateAccessRightsArray(convertedFile.BF_Foundation, accessRights);

      // }
      // if ('BF_Jumpcloud' in convertedFile) {
      //   // JumpCloud access rights available
      //   accessRights = generateAccessRightsArray(convertedFile.BF_Jumpcloud, accessRights);

      // }
      // if ('BF_Loan_Management' in convertedFile) {
      //   // Loan Mangement access rights available
      //   accessRights = generateAccessRightsArray(convertedFile.BF_Loan_Management, accessRights);
      // }

      // console.log(accessRights);
      const distinctAccessRights = accessRights.filter((value, index, self) => {
        return self.indexOf(value) === index;
      });
      //console.log(distinctAccessRights);
      //add accessRights to db
      const accessRightArray = [];
      if (distinctAccessRights.length > 0) {
        for (let i = 0; i < distinctAccessRights.length; i++) {
          const singleAccessRightObj = {};
          const sAR = distinctAccessRights[i];
          singleAccessRightObj.name = sAR;
          accessRightArray.push(singleAccessRightObj);
        }
        const [err] = await to(AccessRightService.createMultipleAccessRights(accessRightArray));
        if (err) TE({ code: 400, message: 'Access Rights added fail.' });
      }

      const [err, allAccessRights] = await to(AccessRightService.getAccessRights());
      if (err) TE({ code: 400, message: 'Access Rights get fail.' });
      req.allAccessRights = allAccessRights;

      next();

    } catch (error) {
      ERROR(res, error);
    }
  },


  addRoles: async (req, res, next) => {
    try {
      let roles = [];
      const convertedFile = req.convertedFile;
      const allSheats = Object.keys(convertedFile);
      if (allSheats.length > 0) {
        for (let i = 0; i < allSheats.length; i++) {
          const cluster = allSheats[i];
          if (cluster !== 'Business_roles') {
            roles = generateRoleArray(convertedFile[cluster], roles);
          }
        }
      }
      // if ('BF_Funders' in convertedFile) {
      //   roles = generateRoleArray(convertedFile.BF_Funders, roles);
      // }
      // if ('BF_Foundation' in convertedFile) {
      //   // foundation  available
      //   roles = generateRoleArray(convertedFile.BF_Foundation, roles);

      // }
      // if ('BF_Jumpcloud' in convertedFile) {
      //   // JumpCloud access rights available
      //   // set roles
      //   roles = generateRoleArray(convertedFile.BF_Jumpcloud, roles);

      // }
      // if ('BF_Loan_Management' in convertedFile) {
      //   // Loan Mangement available
      //   // set roles
      //   roles = generateRoleArray(convertedFile.BF_Loan_Management, roles);
      // }
      const distinctRoles = roles.filter((value, index, self) => {
        return self.indexOf(value) === index;
      });
      //add roles to db
      const roleArray = [];
      if (distinctRoles.length > 0) {
        for (let i = 0; i < distinctRoles.length; i++) {
          const singleRoleObj = {};
          const sR = distinctRoles[i];
          singleRoleObj.name = sR;
          roleArray.push(singleRoleObj);
        }
        const [err] = await to(RoleService.createMultipleRecodes(roleArray));
        if (err) TE({ code: 400, message: 'Roles added fail.' });
      }

      const [err, allRoles] = await to(RoleService.getRecodes());
      if (err) TE({ code: 400, message: 'Roles get fail.' });
      req.allRoles = allRoles;
      // console.log(distinctRolesRights);
      next();

    } catch (error) {
      ERROR(res, error);
    }
  },

  addFunctionalities: async (req, res, next) => {
    try {
      let funtionalities = [];
      const convertedFile = req.convertedFile;
      const allSheats = Object.keys(convertedFile);
      if (allSheats.length > 0) {
        for (let i = 0; i < allSheats.length; i++) {
          const cluster = allSheats[i];
          if (cluster !== 'Business_roles') {
            funtionalities = generateFunctionalities(convertedFile[cluster], funtionalities);
          }
        }
      }

      const distinctFuntionalities = funtionalities.filter((value, index, self) => {
        return self.indexOf(value) === index;
      });
      // console.log(distinctFuntionalities);
      //add functionalities to db
      const functionalityArray = [];
      if (distinctFuntionalities.length > 0) {
        for (let i = 0; i < distinctFuntionalities.length; i++) {
          const singleFunctionalityObj = {};
          const sF = distinctFuntionalities[i];
          singleFunctionalityObj.name = sF;
          functionalityArray.push(singleFunctionalityObj);
        }
        const [err] = await to(FunctionalityService.createMultipleFunctionalities(functionalityArray));
        if (err) TE({ code: 400, message: 'Functionalities added fail.' });
      }

      const [err, allFunctionalities] = await to(FunctionalityService.getFunctionalities());
      if (err) TE({ code: 400, message: 'Functionalities get fail.' });
      req.allFunctionalities = allFunctionalities;
      next();

    } catch (error) {
      ERROR(res, error);
    }
  },

  addClusters: async (req, res, next) => {
    try {
      const clusters = [];
      const convertedFile = req.convertedFile;
      const allSheats = Object.keys(convertedFile);
      if (allSheats.length > 0) {
        for (let i = 0; i < allSheats.length; i++) {
          const cluster = allSheats[i];
          if (cluster !== 'Business_roles') {
            clusters.push(cluster);
          }
        }
      }

      const distinctClusters = clusters.filter((value, index, self) => {
        return self.indexOf(value) === index;
      });
      // console.log(distinctFuntionalities);
      //add Clusters to db
      const clusterArray = [];
      if (distinctClusters.length > 0) {
        for (let i = 0; i < distinctClusters.length; i++) {
          const singleClusterObj = {};
          const sF = distinctClusters[i];
          singleClusterObj.name = sF;
          clusterArray.push(singleClusterObj);
        }
        const [err] = await to(ClusterService.createMultipleRecodes(clusterArray));
        if (err) TE({ code: 400, message: 'Clusters added fail.' });
      }

      const [err, allClusters] = await to(ClusterService.getRecodes());
      if (err) TE({ code: 400, message: 'Clusters get fail.' });
      req.allClusters = allClusters;
      next();

    } catch (error) {
      ERROR(res, error);
    }
  },

  addUsers: async (req, res, next) => {
    try {
      const users = [];
      const convertedFile = req.convertedFile;
      const allSheats = Object.keys(convertedFile);
      if (allSheats.length > 0 && allSheats.includes('Business_roles')) {
        // business role (user) file available
        const businessRoles = convertedFile['Business_roles'];
        for (let i = 1; i < businessRoles.length; i++) {
          const sU = businessRoles[i];
          let role_Id = null;
          let camundaUserId = null;
          const role = req.allRoles.find(({ name }) => name === sU.A);
          if (role) {
            role_Id = role._id;
          }
          if (sU.C) {
            camundaUserId = sU.C;
          }

          if (role_Id) {
            users.push({ name: sU.B, role: role_Id, camundaUserId: camundaUserId });
          }

        }
      }

      //add users to db
      if (users.length > 0) {

        const [err] = await to(UserService.createMultipleRecodes(users));
        if (err) TE({ code: 400, message: 'Users added fail.' });
      }

      const [err, allUsers] = await to(UserService.getRecodes());
      if (err) TE({ code: 400, message: 'Users get fail.' });
      req.allUsers = allUsers;
      next();

    } catch (error) {
      ERROR(res, error);
    }
  },

  addPermissionMatrix: async (req, res, next) => {
    try {
      let permissionMatrix = [];
      const convertedFile = req.convertedFile;
      const allSheats = Object.keys(convertedFile);
      if (allSheats.length > 0) {
        for (let i = 0; i < allSheats.length; i++) {
          const cluster = allSheats[i];
          if (cluster !== 'Business_roles') {
            // funtionalities = generateFunctionalities(convertedFile[cluster], funtionalities);
            permissionMatrix = generatePermissionMatrix(convertedFile[cluster], req.allAccessRights, req.allRoles, req.allFunctionalities, req.allClusters, cluster, permissionMatrix);
          }
        }
      }

      //add users to db
      if (permissionMatrix.length > 0) {

        const [err] = await to(PermissionMatrixService.createMultipleRecodes(permissionMatrix));
        if (err) TE({ code: 400, message: 'permissions added fail.' });
      }
      next();

    } catch (error) {
      ERROR(res, error);
    }
  },

  deleteUploadedMatrixFile: async (req, res, next) => {
    try {
      const path = 'uploads/doc.xlsx';
      if (fs.existsSync(path)) {
        fs.unlinkSync(path);
      }
      next();

    } catch (error) {
      ERROR(res, error);
    }
  },


  sendMatrixFile: async (req, res) => {
    try {
      req.convertedFile = [];
      req.allUsers = [];
      req.allClusters = [];
      req.allFunctionalities = [];
      req.allRoles = [];
      req.allAccessRights = [];

      setRecordsToCacheInternally();
      SUCCESS(res, 200, { message: 'added new permissions successfully.' });

    } catch (error) {
      ERROR(res, error);
    }
  },

};


// commen functions for access meangemnt File upload

const generateRoleArray = (cluserDataSet, roleArray) => {
  if (cluserDataSet.length > 1) {
    const header = Object.values(cluserDataSet[0]);
    // console.log(header);
    for (let i = 0; i < header.length; i++) {
      const el = header[i];
      const trimmedEl = el.trim();
      if (!(trimmedEl.toUpperCase() == 'ACCESS RIGHT' || trimmedEl.toUpperCase() == 'FUNCTIONALITY' || trimmedEl.toUpperCase() == 'COMMENT' || trimmedEl.toUpperCase() == '')) {
        roleArray.push(el);
      }

    }
  }

  return roleArray;
};

const generateAccessRightsArray = (cluserDataSet, accessRightsArray) => {

  if (cluserDataSet.length > 1) {
    // get object key form access right
    let key = null;
    const header = cluserDataSet[0];
    key = Object.keys(header).find(key => header[key] === 'Access right');
    if (key) {
      // first row must header
      for (let i = 1; i < cluserDataSet.length; i++) {
        const value = cluserDataSet[i][key];
        accessRightsArray.push(value);
      }
    }
  }

  return accessRightsArray;
};

const generateFunctionalities = (cluserDataSet, fuctionalitiesArray) => {

  if (cluserDataSet.length > 1) {
    // get object key form access right
    let key = null;
    const header = cluserDataSet[0];
    key = Object.keys(header).find(key => header[key] === 'Functionality');
    if (key) {
      // first row must header
      for (let i = 1; i < cluserDataSet.length; i++) {
        const value = cluserDataSet[i][key];
        fuctionalitiesArray.push(value);
      }
    }
  }

  return fuctionalitiesArray;
};


const generatePermissionMatrix = (cluserDataSet, allAccessRights, allRoles, allFunctionalities, allClusters, clusterName, permissionMatrix) => {
  if (cluserDataSet.length > 0) {
    const header = cluserDataSet[0];
    const roleArray = [];
    let accessRightKey = null;
    let FunctionalityKey = null;

    accessRightKey = Object.keys(header).find(key => header[key] === 'Access right');
    FunctionalityKey = Object.keys(header).find(key => header[key] === 'Functionality');


    const cluster = allClusters.find(({ name }) => name === clusterName);
    const cluster_id = cluster._id;

    const headerArray = Object.values(header);
    for (let i = 0; i < headerArray.length; i++) {
      const el = headerArray[i];
      const trimmedEl = el.trim();
      if (!(trimmedEl.toUpperCase() == 'ACCESS RIGHT' || trimmedEl.toUpperCase() == 'FUNCTIONALITY' || trimmedEl.toUpperCase() == 'COMMENT' || trimmedEl.toUpperCase() == '')) {
        roleArray.push(el);
      }

    }

    for (let i = 1; i < cluserDataSet.length; i++) {
      const sR = cluserDataSet[i];
      const functionality = allFunctionalities.find(({ name }) => name === sR[FunctionalityKey]);
      const functionality_id = functionality._id;
      const accessRight = allAccessRights.find(({ name }) => name === sR[accessRightKey]);
      const accessRight_id = accessRight._id;
      // const cluster = cluster_id;
      // sP.role =
      //   sP.permission = 

      for (let j = 0; j < roleArray.length; j++) {
        const sP = {};
        const roleElement = roleArray[j];
        const role = allRoles.find(({ name }) => name === roleElement);
        const role_id = role._id;
        sP.accessRight = accessRight_id;
        sP.functionality = functionality_id;
        sP.cluster = cluster_id;
        sP.role = role_id;
        const roleKey = Object.keys(header).find(key => header[key] === roleElement);
        if (sR[roleKey] == 'Yes') {
          sP.permission = true;
        } else {
          sP.permission = false;
        }

        permissionMatrix.push(sP);

      }


    }
  }
  return permissionMatrix;
};

