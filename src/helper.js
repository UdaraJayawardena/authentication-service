// ##################################################################
// #  File Name: helper.js                                          #
// #                                                                #
// #  Description: helper have a two function to and TE             #
// #                                                                #
// #  Ex:- to()                                                     #
// #  const [err, result] = await to(Call Promise function);        #
// #                                                                #
// #  Commented By: Lasantha Lakmal                                 #
// ##################################################################

/**
 * Convert promise call result to array
 * @param {Promise} promise - promise object
 * 
 * @returns {[]} Return [err, data] array
 */
const to = (promise) => {

  return promise

    .then(data => {

      return [null, data];
    }).catch(err =>

      [err]
    );
};

/**
 * Throw error and if isLog is true, create a log
 * @param {*} err - Any kind of error
 * @param {boolean} isLog - Error log or not
 */
const TE = (err, isLog) => {

  if (isLog) {

    console.error(err);
  }

  throw err;
};

/**
 * @module helper
 */

const parseToObject = (value) => {
  try { return JSON.parse(value); } catch (error) { return value; }
};
module.exports = {
  to: to,
  TE: TE,
  parseToObject: parseToObject
};