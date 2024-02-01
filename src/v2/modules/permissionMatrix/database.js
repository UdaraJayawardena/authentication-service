const PermissionMatrix = require('./permissionMatrix');
const Counter = require('../../../counter');
const { TE, to } = require('../../../helper');

const createSingleRecode = async singleRecode => {
  const data = singleRecode;
  const dbData = await PermissionMatrix.find({ functionality: data.functionality, accessRight: data.accessRight, cluster: data.cluster, role: data.role });
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

  const dbRecodes = await PermissionMatrix.find({});


  for (let i = 0; i < multipleRecodes.length; i++) {

    const recode = multipleRecodes[i];
    // need to check recode available or new
    let isUpdate = false;
    let isNew = false;
    const availableDBRecode = dbRecodes.find(dbRecode => {
      let isAvailable = false;
      if (dbRecode.functionality.toString() === recode.functionality.toString() &&
        dbRecode.accessRight.toString() === recode.accessRight.toString() &&
        dbRecode.cluster.toString() === recode.cluster.toString() &&
        dbRecode.role.toString() === recode.role.toString()
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
      updatedRecodes.push({
        updateOne: {
          filter: { _id: availableDBRecode._id },
          update: { $set: { permission: recode.permission } }
        }
      });
    }
  }

  let result = [];

  if (newRecodes.length > 0) {
    result = await PermissionMatrix.insertMany(newRecodes);
  }
  // update permissions if so
  if (updatedRecodes.length > 0) {
    const [Error] = await to(PermissionMatrix.bulkWrite(updatedRecodes, { ordered: false }));
    if (Error) {
      console.log(Error);
    }
  }
  return result;
};

const updateMultipleRecodes = async (query, updates) =>
  await PermissionMatrix.updateMany(query, updates, { new: true });

const updateRecode = async (condition, dataNeedToUpdate) =>
  await PermissionMatrix.findOneAndUpdate(condition, dataNeedToUpdate, { new: true, runValidators: true });

const findOneByQuery = async (query) =>
  await PermissionMatrix.findOne(query);

const findByQuery = async (query) =>
  await PermissionMatrix.find(query).populate({ path: 'role', select: 'name' }).
    populate({ path: 'functionality', select: 'name' }).
    populate({ path: 'accessRight', select: 'name' }).
    populate({ path: 'cluster', select: 'name' });


module.exports = {

  Schema: PermissionMatrix,

  updateRecode: updateRecode,

  findOneByQuery,

  findByQuery,

  updateMultipleRecodes: updateMultipleRecodes,

  createSingleRecode,

  createMultipleRecodes,

};
