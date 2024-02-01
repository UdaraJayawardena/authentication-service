const AnonymousUser_V2 = require('../../v2/modules/anonymousUser/anonymousUser');
const AnonymousUser_V3 = require('../modules/anonymousUser/database');


module.exports.up = async function (name, fn) {

  try {

    const anonymousUserList = await AnonymousUser_V2.find({});

    for (let i = 0; i < anonymousUserList.length; i++) {
      const anonymousUser = anonymousUserList[i];
      const obj = {
        id: anonymousUser.id,
        firstName: (anonymousUser.firstName !== '') ? anonymousUser.firstName : '',
        lastName: (anonymousUser.lastName !== '') ? anonymousUser.lastName : '',
        userName: (anonymousUser.userName !== '') ? anonymousUser.userName : '',
        email: (anonymousUser.email !== '') ? anonymousUser.email : '',
        organization: (anonymousUser.organization !== '') ? anonymousUser.organization : '',
        camundaUserId: (anonymousUser.camundaUserId !== '') ? anonymousUser.camundaUserId : ''
      };
      if (anonymousUser.permissionKey) {
        obj.permissionKey = anonymousUser.permissionKey;
      }
      if (anonymousUser.camundaPassword) {
        obj.camundaPassword = anonymousUser.camundaPassword;
      }

      await AnonymousUser_V3.createSingleRecode(obj);

    }

    console.info(`success migrate-up: ${name} `);

    fn();
  } catch (error) {
    console.error(`error migrate-up: ${name} `);
    console.log(error);
    fn();
  }
};

module.exports.down = async function (name, fn) {
  try {

    const anonymousUserList = await AnonymousUser_V3.findByQuery({ where: {} });

    for (let i = 0; i < anonymousUserList.length; i++) {
      const anonymousUser = anonymousUserList[i];

      await AnonymousUser_V3.updateRecode({ status: 'in-active' }, { where: { id: anonymousUser.id } });

    }


    console.info(`success migrate-down: ${name} `);
    fn();
  } catch (error) {
    console.error(`error migrate-down: ${name} `);
    console.log(error);
    fn();
  }
};
