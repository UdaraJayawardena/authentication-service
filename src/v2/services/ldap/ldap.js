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

const updateUser = async (id, updateObj) => {
  const response = await axios({
    method: 'put',
    headers: { 'x-api-key': ldapConfig.ApI_Key, 'Content-Type': 'application/json', 'Accept': 'application/json' },
    url: `${ldapConfig.gu}/${id}`,
    data: updateObj
  });

  return response.data;
};

module.exports = {
  authenticate: authenticate,
  getAllUsers: getAllUsers,
  updateUser: updateUser
};
