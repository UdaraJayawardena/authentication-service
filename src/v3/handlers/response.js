// ##################################################################
// #  File Name: response.js                                        #
// #                                                                #
// #  Description:                                                  #
// #  Application response handler,Manage all response              #
// #  This have main Two function SUCCESS and ERROR                 #
// #                                                                #
// #  Ex:- to()                                                     #
// #  const [err, result] = await to(Call Promise function);        #
// #                                                                #
// #  Commented By: Lasantha Lakmal                                 #
// ##################################################################

const Errors = require('./errors');
const Sentry = require('@sentry/node');

/**
 * String error code mapper
 * Convert string error code to number error code
 */
const ERROR_CODE = {

  ACCESS_DENIED: (e) => { e.code = 4011; return e; },
  register_vat_missing: (e) => { e.code = 40001; return e; },
  err_missing_params: (e) => { e.code = 40002; return e; },
  err_double_mandatenumber: (e) => { e.code = 40003; return e; },
  err_no_contract: (e) => { e.code = 40004; return e; },
  err_invalid_amount: (e) => { e.code = 40006; return e; },
  err_invalid_sepachars: (e) => { e.code = 40008; return e; },
  err_no_such_ct: (e) => { e.code = 40009; return e; },
  err_invalid_domain: (e) => { e.code = 40010; return e; },
  err_mandatenumber_required: (e) => { e.code = 40011; return e; },
  err_invalid_iban: (e) => { e.code = 40012; return e; },
  err_invalid_ct: (e) => { e.code = 40013; return e; },
  err_contract_signed: (e) => { e.code = 40014; return e; },
  ECONNRESET: (e) => { e.code = 4007; return e; },
  err_invalid_input: (e) => { e.code = 40015; return e; },
  err_invalid_date: (e) => { e.code = 40016; return e; },
  err_mandate_invalid_state: (e) => { e.code = 40017; return e; },
  err_invalid_email: (e) => { e.code = 40020; return e; },
  error_system: (e) => { e.code = 5001; return e; }
};

/**
 * 
 * @param {*} e - Error object
 * If error code is string, call string error code mapper
 * And Return error object
 */
const parseError = (e) => {
  //console.log("E",e)
  if (typeof e.code === 'string') {
    return ERROR_CODE[e.code](e);
  }

  return e;

};

module.exports = {

  /**
   * Create succes response
   * @param {Response} res - Response object
   * @param {number} code - Http Sucess code
   * @param {*} data - Final result. object, array ...
   * @return {Object} Return HTTP Response: {
   *  code: 200,
   *  data: (*),
   *  success: true
   * }
   */
  SUCCESS: (res, code, data) => {

    return res.status(code).json({

      code: code,

      data: data,

      success: true
    });
  },

  /**
   * Create error response
   * @param {Response} res - Response object
   * @param {Object} error - Error object
   * @return {Object} Return HTTP Response
   */
  ERROR: (res, error) => {

    try {

      error = error ? error : {};

      error = error.error ? error.error : error;

      error = error.error ? error.error : error;

      if (error && error.code) {

        error = parseError(error);

        const response = Errors[error.code](error);

        return res.status(response.code).json(response);
      }

      Sentry.captureException(error);
      return res.status(500).json(Errors[500](error));

    } catch (catchErr) {

      console.log('****', catchErr, error);
      Sentry.captureException(error);
      return res.status(400).json(Errors[400](error));
    }
  }
};