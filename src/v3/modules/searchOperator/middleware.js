/* eslint-disable require-atomic-updates */
const { ResponseHandler } = require('../../handlers');

const { TE, to } = require('../../../helper');

const { ERROR, SUCCESS } = ResponseHandler;

const database = require('./database');

const frontEndPortalList = [
  { 'name': '=' },
  { 'name': '<' },
  { 'name': '>' },
  { 'name': '<=' },
  { 'name': '>=' },
  { 'name': 'LIKE' }//,
  // { 'name': 'REGEX' }
];



module.exports = {

  seed: async (req, res) => {
    try {
      const messages = [];
      // get operators
      const [err1, operators] = await to(database.findByQuery({}));
      if (err1) TE(err1);
      if (operators.length == 0) {
        // this meean operators not seed yet so need to seed.
        const [err2, seededOperators] = await to(database.createMultipleRecodes(frontEndPortalList));
        if (err2) TE(err2);
        if (seededOperators.length > 0) {
          // operators has been seeds
          messages.push('operators are seed.');
        }

      } else {
        messages.push('There are some operators availble currently so seed wont proceed.');
      }


      SUCCESS(res, 200, messages);
    } catch (error) {
      ERROR(res, error);
    }
  },


};
