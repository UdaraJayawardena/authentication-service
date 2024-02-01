const PermissionMatrix = require('./permissionMatrix');
const PermissionMatrixPopulated = require('../views/populated_permission');
const Counter = require('../../../counter');
const { TE, to } = require('../../../helper');

const createSingleRecode = async singleRecode => {
  const data = singleRecode;
  const dbData = await PermissionMatrix.findAll({ where: { functionalityId: data.functionalityId, accessRightId: data.accessRightId, clusterId: data.clusterId, roleId: data.roleId } });
  if (dbData.length > 0) {
    TE('permission recode already available.');
  }
  const id = await Counter.getNextSequence('permission_id');
  data.id = `P${id.toString().padStart(6, '0')}`;

  return await PermissionMatrix.create(singleRecode);
};


const createMultipleRecodes = async (multipleRecodes) => {
  const newRecodes = [];
  const updatedRecodes = [];

  const dbRecodes = await PermissionMatrix.findAll();


  for (let i = 0; i < multipleRecodes.length; i++) {

    const recode = multipleRecodes[i];
    // need to check recode available or new
    let isUpdate = false;
    let isNew = false;
    const availableDBRecode = dbRecodes.find(dbRecode => {
      let isAvailable = false;
      if (dbRecode.functionalityId.toString() === recode.functionalityId.toString() &&
        dbRecode.accessRightId.toString() === recode.accessRightId.toString() &&
        dbRecode.clusterId.toString() === recode.clusterId.toString() &&
        dbRecode.roleId.toString() === recode.roleId.toString()
      ) {
        isAvailable = true;
      }
      return isAvailable;
    });

    if (availableDBRecode) {
      // need to check data need to update (permission has changed)
      if (availableDBRecode.permission !== recode.permission) {
        isUpdate = true;
      }
    } else {
      isNew = true;
    }


    // if recode new then need add
    if (isNew) {
      const id = await Counter.getNextSequence('permission_id');
      // eslint-disable-next-line require-atomic-updates
      recode.id = `P${id.toString().padStart(6, '0')}`;
      newRecodes.push(recode);
    } else if (isUpdate) {
      // need to update permission
      // updatedRecodes.push({
      //   updateOne: {
      //     filter: { _id: availableDBRecode._id },
      //     update: { $set: { permission: recode.permission } }
      //   }
      // });
      recode.id = availableDBRecode.id;

      updatedRecodes.push(recode);
    }
  }

  let result = [];

  if (newRecodes.length > 0) {
    result = await PermissionMatrix.bulkCreate(newRecodes);
  }
  // update permissions if so
  if (updatedRecodes.length > 0) {
    const [Error] = await to(PermissionMatrix.bulkCreate(updatedRecodes, { updateOnDuplicate: ['permission'] }));
    if (Error) {
      console.log(Error);
    }
  }
  return result;
};

const updateMultipleRecodes = async (query, updates) =>
  await PermissionMatrix.update(updates, query);

const updateRecode = async (condition, dataNeedToUpdate) =>
  await PermissionMatrix.update(dataNeedToUpdate, condition);

const findOneByQuery = async (query) =>
  await PermissionMatrixPopulated.findOne(query);

const findByQuery = async (query) =>
  await PermissionMatrixPopulated.findAll(query);


module.exports = {

  Schema: PermissionMatrix,

  updateRecode: updateRecode,

  findOneByQuery,

  findByQuery,

  updateMultipleRecodes: updateMultipleRecodes,

  createSingleRecode,

  createMultipleRecodes,

};
