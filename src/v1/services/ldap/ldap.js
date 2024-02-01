const ldap = require('ldapjs');
const ldapConfig = require('./config');
const axios = require('axios');


const authenticate = (userId, password) => {
  return new Promise((resolve, reject) => {
    const ldapClient = ldap.createClient({ url: ldapConfig.url });
    let dn = `uid=${userId},${ldapConfig.dn}`
    ldapClient.bind(
      dn,
      password,
      (err, res) => {
        if (err) {
          return reject(err);
        }
        ldapClient.unbind();
        return resolve(true)//resolve(res);
      }
    );
  })
};

const getAllUsers = async () => {
  const response = await axios({
    method: 'get',
    headers: { 'x-api-key': 'f8fb000d8adecebbdab8c9fde819351bfc5b5339', 'Content-Type': 'application/json', 'Accept': 'application/json' },
    url: ldapConfig.gu,
  });

  return response.data;
};

module.exports = {
  authenticate: authenticate,
  getAllUsers: getAllUsers
}
