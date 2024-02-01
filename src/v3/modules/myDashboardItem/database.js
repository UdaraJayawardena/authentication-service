const MyDashboardItem = require('./myDashboardItem');
const PopulatedMyDashboardItem = require('../views/populated_my_dashboard_item');
const dashboardItems = require('../dashboardItem/dashboardItem');
const myDashboard = require('../myDashboard/myDashboard');

const Counter = require('../../../counter');
const { TE } = require('../../../helper');

const createSingleRecode = async singleRecode => {
  const data = singleRecode;
  const dbData = await MyDashboardItem.findAll({ where: { myDashboardId: data.myDashboardId, dashboardItemId: data.dashboardItemId } });
  if (dbData.length > 0) {
    TE('My dashboard item already available.');
  }
  const id = await Counter.getNextSequence('my_dashboard_item_id');
  data.id = `MDI${id.toString().padStart(6, '0')}`;

  return await MyDashboardItem.create(singleRecode);
};


const createMultipleRecodes = async (multipleRecodes) => {
  const newRecodes = [];

  const dbRecodes = await MyDashboardItem.findAll();


  for (let i = 0; i < multipleRecodes.length; i++) {

    const recode = multipleRecodes[i];
    let isAvailabel = false;
    // Find if the array contains an object by comparing the property value
    if (dbRecodes.some(dbRecode => (dbRecode.myDashboardId === recode.myDashboardId && dbRecode.dashboardItemId === recode.dashboardItemId))) {
      isAvailabel = true;
    }

    if (!isAvailabel) {
      const id = await Counter.getNextSequence('my_dashboard_item_id');
      recode.id = `MDI${id.toString().padStart(6, '0')}`;
      newRecodes.push(recode);
    }
  }

  let result = [];
  if (newRecodes.length > 0) {
    result = await MyDashboardItem.bulkCreate(newRecodes);
  }
  return result;
};


const createDashboardItemsFromMyDashboard = async (myDashboardData) => {
  const newRecodes = [];

  const dbRecodes = await dashboardItems.findAll({ where: { dashboardId: myDashboardData.dashboardId } });


  for (let i = 0; i < dbRecodes.length; i++) {

    const recode = dbRecodes[i];
    const obj = {
      myDashboardId: myDashboardData.id,
      dashboardItemId: recode.id,
      sequenceNumber: recode.sequenceNumber,
      primaryScreenIndicator: recode.primaryScreenIndicator,
      active: recode.active
    };

    const id = await Counter.getNextSequence('my_dashboard_item_id');
    obj.id = `MDI${id.toString().padStart(6, '0')}`;
    newRecodes.push(obj);
  }

  let result = [];
  if (newRecodes.length > 0) {
    result = await MyDashboardItem.bulkCreate(newRecodes);
  }
  return result;
};


const createNewDashboardItemRelatedMyDashboardItems = async (dashboardItem) => {
  const newRecodes = [];

  const myDsahboards = await myDashboard.findAll({ where: { dashboardId: dashboardItem.dashboardId } });
  const myDashboardIds = [];
  // get all related my dashboards
  if (myDsahboards.length > 0) {
    for (let i = 0; i < myDsahboards.length; i++) {
      const sd = myDsahboards[i];
      myDashboardIds.push(sd.id);
    }


    // get all mydashboards related dashboard items (get max sequesnce number)
    const myDsahboardsItems = await MyDashboardItem.findAll({ where: { myDashboardId: myDashboardIds } });
    if (myDsahboardsItems.length > 0) {
      for (let i = 0; i < myDashboardIds.length; i++) {
        const smdi = myDashboardIds[i];
        const myDashboardItemsRelatedToMD = myDsahboardsItems.filter(mdi => (mdi.myDashboardId == smdi));
        if (myDashboardItemsRelatedToMD.length > 0) {
          const sortedDashboardItems = myDashboardItemsRelatedToMD.sort((a, b) => (a.sequenceNumber < b.sequenceNumber ? 1 : -1));

          const obj = {
            myDashboardId: smdi,
            dashboardItemId: dashboardItem.id,
            sequenceNumber: sortedDashboardItems[0].sequenceNumber + 1,
            primaryScreenIndicator: dashboardItem.primaryScreenIndicator,
            active: dashboardItem.active
          };

          const id = await Counter.getNextSequence('my_dashboard_item_id');
          obj.id = `MDI${id.toString().padStart(6, '0')}`;
          newRecodes.push(obj);
        }
      }
    }
  }

  let result = [];
  if (newRecodes.length > 0) {
    result = await MyDashboardItem.bulkCreate(newRecodes);
  }
  return result;
};


const updateMultipleRecodes = async (query, updates) =>
  await MyDashboardItem.update(updates, query);

const updateRecode = async (condition, dataNeedToUpdate) =>
  await MyDashboardItem.update(dataNeedToUpdate, condition);

const findOneByQuery = async (query) =>
  await PopulatedMyDashboardItem.findOne(query);

const findByQuery = async (query) =>
  await PopulatedMyDashboardItem.findAll(query);


module.exports = {

  Schema: MyDashboardItem,

  updateRecode: updateRecode,

  findOneByQuery,

  findByQuery,

  updateMultipleRecodes: updateMultipleRecodes,

  createSingleRecode,

  createMultipleRecodes,

  createDashboardItemsFromMyDashboard,

  createNewDashboardItemRelatedMyDashboardItems,

};
