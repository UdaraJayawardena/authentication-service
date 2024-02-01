const ldap = require('ldapjs');
const ldapConfig = require('./config');
const axios = require('axios');

const authenticate = (userId, password) => {
  return new Promise((resolve, reject) => {
    const ldapClient = ldap.createClient({ url: ldapConfig.url });
    const dn = `uid=${userId},${ldapConfig.dn}`;
    ldapClient.bind(
      dn,
      password,
      (err) => {
        if (err) {
          return reject(err);
        }
        ldapClient.unbind();
        return resolve(true);//resolve(res);
      }
    );
  });
};

const getAllUsers = async () => {
  const response = await axios({
    method: 'get',
    headers: { 'x-api-key': ldapConfig.ApI_Key, 'Content-Type': 'application/json', 'Accept': 'application/json' },
    url: ldapConfig.gu,
  });

  return response.data;
};

const getUser = async (userId) => {
  const response = await axios({
    method: 'get',
    headers: { 'x-api-key': ldapConfig.ApI_Key, 'Content-Type': 'application/json', 'Accept': 'application/json' },
    url: `${ldapConfig.gu}?filter=username:eq:${userId}`,
  });

  return response.data;
};

const updateUser = async (id, updateObj) => {
  const response = await axios({
    method: 'put',
    headers: { 'x-api-key': ldapConfig.ApI_Key, 'Content-Type': 'application/json', 'Accept': 'application/json' },
    url: `${ldapConfig.gu}/${id}`,
    data: updateObj
  });

  return response.data;
};

const createUser = async (data) => {
  const response = await axios({
    method: 'post',
    headers: { 'x-api-key': ldapConfig.ApI_Key, 'Content-Type': 'application/json', 'Accept': 'application/json' },
    url: ldapConfig.gu,
    data: data
  });

  return response.data;

};

const getLdapServers = async () => {
  const response = await axios({
    method: 'get',
    headers: { 'x-api-key': ldapConfig.ApI_Key, 'Content-Type': 'application/json', 'Accept': 'application/json' },
    url: `${ldapConfig.api_2}/ldapservers`,
  });

  return response.data;

};

const createLdapAssiociation = async (data) => {
  const response = await axios({
    method: 'post',
    headers: { 'x-api-key': ldapConfig.ApI_Key, 'Content-Type': 'application/json', 'Accept': 'application/json' },
    url: `${ldapConfig.api_2}/ldapservers/${ldapConfig.ldapId}/associations`,
    data: data
  });

  return response.data;

};

const manageUsersInUserGroups = async (data) => {
  const response = await axios({
    method: 'post',
    headers: { 'x-api-key': ldapConfig.ApI_Key, 'Content-Type': 'application/json', 'Accept': 'application/json' },
    url: `${ldapConfig.api_2}/usergroups/${data.groupId}/members`,
    data: data.userData
  });

  return response.data;
};

const getUserGroups = async () => {
  const response = await axios({
    method: 'get',
    headers: { 'x-api-key': ldapConfig.ApI_Key, 'Content-Type': 'application/json', 'Accept': 'application/json' },
    url: `${ldapConfig.api_2}/usergroups`,
  });

  return response.data;
};

const deleteJumpcloudUser = async (id) => {
  const response = await axios({
    method: 'delete',
    headers: { 'x-api-key': ldapConfig.ApI_Key, 'Content-Type': 'application/json', 'Accept': 'application/json' },
    url: `${ldapConfig.gu}/${id}`,
  });
  return response.data;
};

const getUserGroupsByUser = async (id) => {
  const response = await axios({
    method: 'get',
    headers: { 'x-api-key': ldapConfig.ApI_Key, 'Content-Type': 'application/json', 'Accept': 'application/json' },
    url: `${ldapConfig.api_2}/users/${id}/memberof`,
  });
  return response.data;
};

const updateJumpcloudUser = async (data) => {
  const response = await axios({
    method: 'put',
    headers: { 'x-api-key': ldapConfig.ApI_Key, 'Content-Type': 'application/json', 'Accept': 'application/json' },
    url: `${ldapConfig.gu}/${data.selector}`,
    data: data.updates
  });
  return response.data;
};

module.exports = {
  authenticate: authenticate,
  getAllUsers: getAllUsers,
  updateUser: updateUser,
  createUser: createUser,
  createLdapAssiociation: createLdapAssiociation,
  manageUsersInUserGroups: manageUsersInUserGroups,
  getLdapServers: getLdapServers,
  getUserGroups: getUserGroups,
  deleteJumpcloudUser: deleteJumpcloudUser,
  getUserGroupsByUser: getUserGroupsByUser,
  updateJumpcloudUser: updateJumpcloudUser,  
  getUser: getUser
};
