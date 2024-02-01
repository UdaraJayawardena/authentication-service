const Dashboard = require('./dashboard');
const populatedDashboard = require('../views/populated_dashboard');
const Counter = require('../../../counter');
const { TE } = require('../../../helper');

const createSingleRecode = async singleRecode => {
  const data = singleRecode;
  const dbData = await Dashboard.findAll({ where: { name: data.name } });
  if (dbData.length > 0) {
    TE('Dashboard already available.');
  }

  const sequenceRecorde = await Dashboard.findAll({ where: { sequenceNumber: data.sequenceNumber, frontEndPortalId: data.frontEndPortalId } });
  if (sequenceRecorde.length > 0) {
    TE('Dashboard sequence number already available.');
  }


  const id = await Counter.getNextSequence('dashboard_id');
  data.id = `D${id.toString().padStart(6, '0')}`;

  return await Dashboard.create(singleRecode);
};


const createMultipleRecodes = async (multipleRecodes) => {
  const newRecodes = [];

  const dbRecodes = await Dashboard.findAll();


  for (let i = 0; i < multipleRecodes.length; i++) {

    const recode = multipleRecodes[i];
    let isAvailabel = false;
    // Find if the array contains an object by comparing the property value
    if (dbRecodes.some(dbRecode => dbRecode.name === recode.name)) {
      isAvailabel = true;
    }

    if (!isAvailabel) {
      const id = await Counter.getNextSequence('dashboard_id');
      recode.id = `D${id.toString().padStart(6, '0')}`;
      newRecodes.push(recode);
    }
  }

  let result = [];
  if (newRecodes.length > 0) {
    result = await Dashboard.bulkCreate(newRecodes);
  }
  return result;
};

const updateMultipleRecodes = async (query, updates) =>
  await Dashboard.update(updates, query);

const updateRecode = async (condition, dataNeedToUpdate) =>
  await Dashboard.update(dataNeedToUpdate, condition);

const findOneByQuery = async (query) =>
  await populatedDashboard.findOne(query);

const findByQuery = async (query) =>
  await populatedDashboard.findAll(query);


module.exports = {

  Schema: Dashboard,

  updateRecode: updateRecode,

  findOneByQuery,

  findByQuery,

  updateMultipleRecodes: updateMultipleRecodes,

  createSingleRecode,

  createMultipleRecodes,

};
