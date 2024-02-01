const Cluster = require('./cluster');
const Counter = require('../../../counter');
const { TE } = require('../../../helper');

const createSingleRecode = async singleRecode => {
  const data = singleRecode;
  const dbData = await Cluster.find({ name: data.name });
  if (dbData.length > 0) {
    TE('cluser already available.');
  }
  const id = await Counter.getNextSequence('cluster_id');
  data.id = `CL${id.toString().padStart(6, '0')}`;

  return await Cluster.create(singleRecode);
};


const createMultipleRecodes = async (multipleRecodes) => {
  const newRecodes = [];

  const dbRecodes = await Cluster.find({});


  for (let i = 0; i < multipleRecodes.length; i++) {

    const recode = multipleRecodes[i];
    let isAvailabel = false;
    // Find if the array contains an object by comparing the property value
    if (dbRecodes.some(dbRecode => dbRecode.name === recode.name)) {
      isAvailabel = true;
    }

    if (!isAvailabel) {
      const id = await Counter.getNextSequence('cluster_id');
      recode.id = `CL${id.toString().padStart(6, '0')}`;
      newRecodes.push(recode);
    }
  }

  let result = [];
  if (newRecodes.length > 0) {
    result = await Cluster.insertMany(newRecodes);
  }
  return result;
};

const updateMultipleRecodes = async (query, updates) =>
  await Cluster.updateMany(query, updates, { new: true });

const updateRecode = async (condition, dataNeedToUpdate) =>
  await Cluster.findOneAndUpdate(condition, dataNeedToUpdate, { new: true, runValidators: true });

const findOneByQuery = async (query) =>
  await Cluster.findOne(query);

const findByQuery = async (query) =>
  await Cluster.find(query);


module.exports = {

  Schema: Cluster,

  updateRecode: updateRecode,

  findOneByQuery,

  findByQuery,

  updateMultipleRecodes: updateMultipleRecodes,

  createSingleRecode,

  createMultipleRecodes,

};
