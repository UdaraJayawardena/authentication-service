const express = require('express');

const Middleware = require('./middleware');

const { ldapMiddleware } = require('../../middleware');

const router = express.Router();

router.route('/login')
  .post(
    Middleware.validateLoginDetails,
    ldapMiddleware.login);

router.route('/is-authenticate')
  .post(
    Middleware.validateAutenticateDetails,
    Middleware.decodeToken,
    Middleware.validateUserAuthorization,
    Middleware.isAuthenticate
  );

router.route('/is-authorized')
  .post(
    Middleware.decodeToken,
    Middleware.validateUserAuthorization,
    Middleware.sendAuthorizeSuccess
  );


router.route('/camunda-users')
  .get(
    Middleware.decodeToken,
    ldapMiddleware.getUsersForCamunda
  );



module.exports = router;

/**
 * @swagger
 * /authorization/login:
 *    post:
 *      tags:
 *      - "authorization login"
 *      name: "validate credintials and generate token"
 *      summary: "validate credintials and generate token"
 *      operationId: "createLoginToken"
 *      consumes:
 *      - "application/json"
 *      produces:
 *      - "application/json"
 *      parameters:
 *      - in: "body"
 *        name: "body"
 *        description: "login Details"
 *        required: true
 *        schema:
 *            type: "object"
 *            properties:
 *              userId:
 *                type: "string"
 *                example: "userId"
 *              password:
 *                type: "string"
 *                example: "password"
 *            required:
 *              - userId
 *              - password
 *      responses:
 *        200:
 *          description: "user login token"
 *          schema:
 *             type: object
 *             properties:
 *               code:
 *                 type: integer
 *                 default: 200
 *               data:
 *                 type: object
 *               success:
 *                 type: boolean
 *        400:
 *          description: "Bad request"
 *
*/