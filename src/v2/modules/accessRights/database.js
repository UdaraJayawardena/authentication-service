const AccessRight = require('./access-right');
const Counter = require('../../../counter');
const { TE } = require('../../../helper');

const createSingleAccessRight = async singleAccessRight => {
  const accessRight = singleAccessRight;
  const dbAccessRight = await AccessRight.find({ name: accessRight.name });
  if (dbAccessRight.length > 0) {
    TE('Access Right already available.');
  }
  const id = await Counter.getNextSequence('accessRight_id');
  accessRight.id = `AR${id.toString().padStart(6, '0')}`;

  return await AccessRight.create(singleAccessRight);
};


const createMultipleAccessRights = async (multipleAccessRights) => {
  const newAccessRights = [];

  const dbAccessRights = await AccessRight.find({});


  for (let i = 0; i < multipleAccessRights.length; i++) {

    const accessRight = multipleAccessRights[i];
    let isAvailabel = false;
    // Find if the array contains an object by comparing the property value
    if (dbAccessRights.some(dbAccessRight => dbAccessRight.name === accessRight.name)) {
      isAvailabel = true;
    }

    if (!isAvailabel) {
      const id = await Counter.getNextSequence('accessRight_id');
      accessRight.id = `AR${id.toString().padStart(6, '0')}`;
      newAccessRights.push(accessRight);
    }
  }

  let result = [];
  if (newAccessRights.length > 0) {
    result = await AccessRight.insertMany(newAccessRights);
  }
  return result;
};

const updateMultipleAccessRights = async (query, updates) =>
  await AccessRight.updateMany(query, updates, { new: true });

const updateAccessRight = async (condition, accessRightsNeedToUpdate) =>
  await AccessRight.findOneAndUpdate(condition, accessRightsNeedToUpdate, { new: true, runValidators: true });

const findOneByQuery = async (query) =>
  await AccessRight.findOne(query);

const findByQuery = async (query) =>
  await AccessRight.find(query);


module.exports = {

  Schema: AccessRight,

  updateAccessRight: updateAccessRight,

  findOneByQuery,

  findByQuery,

  updateMultipleAccessRights: updateMultipleAccessRights,

  createSingleAccessRight,

  createMultipleAccessRights,

};
