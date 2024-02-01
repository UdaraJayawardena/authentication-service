const Role = require('./role');
const Counter = require('../../../counter');
const { TE } = require('../../../helper');

const createSingleRecode = async singleRecode => {
  const data = singleRecode;
  const dbData = await Role.findAll({ where: { name: data.name } });
  if (dbData.length > 0) {
    TE('Role already available.');
  }
  const id = await Counter.getNextSequence('role_id');
  data.id = `R${id.toString().padStart(6, '0')}`;

  return await Role.create(singleRecode);
};


const createMultipleRecodes = async (multipleRecodes) => {
  const newRecodes = [];

  const dbRecodes = await Role.findAll();


  for (let i = 0; i < multipleRecodes.length; i++) {

    const recode = multipleRecodes[i];
    let isAvailabel = false;
    // Find if the array contains an object by comparing the property value
    if (dbRecodes.some(dbRecode => dbRecode.name === recode.name)) {
      isAvailabel = true;
    }

    if (!isAvailabel) {
      const id = await Counter.getNextSequence('role_id');
      recode.id = `R${id.toString().padStart(6, '0')}`;
      newRecodes.push(recode);
    }
  }

  let result = [];
  if (newRecodes.length > 0) {
    result = await Role.bulkCreate(newRecodes);
  }
  return result;
};

const updateMultipleRecodes = async (query, updates) =>
  await Role.update(updates, query);

const updateRecode = async (condition, dataNeedToUpdate) =>
  await Role.update(dataNeedToUpdate, condition);

const findOneByQuery = async (query) =>
  await Role.findOne(query);

const findByQuery = async (query) =>
  await Role.findAll(query);


module.exports = {

  Schema: Role,

  updateRecode: updateRecode,

  findOneByQuery,

  findByQuery,

  updateMultipleRecodes: updateMultipleRecodes,

  createSingleRecode,

  createMultipleRecodes,

};
