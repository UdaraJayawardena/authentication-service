const Sentry = require('@sentry/node');

const Tracing = require('@sentry/tracing');

const express = require('express');

const app = express();

const bodyParser = require('body-parser');

const cookieParser = require('cookie-parser');

const router = require('./router');

const v1 = require('./v1');

const v2 = require('./v2');

const v3 = require('./v3');

const { Config } = require('../config');

const { JSON_PARSER, URLENCODED } = Config.BODYPARSER;

const { ALLOW_HEADERS, ALLOWED_DOMAINS, ALLOW_METHODS } = Config.ACCESS_HEADERS;

const accessHeader = (req, res, next) => {

  if (ALLOWED_DOMAINS.indexOf(req.headers.origin) !== -1) {

    res.header('Access-Control-Allow-Origin', req.headers.origin);

    res.header('Access-Control-Allow-Methods', ALLOW_METHODS);

    res.header('Access-Control-Allow-Headers', ALLOW_HEADERS);
  }

  next();
};

Sentry.init({
  dsn: Config.APPLICATION.SENTRY_DSN,
  environment: Config.APPLICATION.SENTRY_ENVIRONMENT,
  tracesSampleRate: Config.APPLICATION.SENTRY_SAMPLERATE,
  integrations: [
    // enable HTTP calls tracing
    new Sentry.Integrations.Http({ tracing: true }),
    // enable Express.js middleware tracing
    new Tracing.Integrations.Express({
      // to trace all requests to the default router
      app,
      // alternatively, you can specify the routes you want to trace:
      // router: someRouter,
    }),
  ],
});

// RequestHandler creates a separate execution context using domains, so that every
// transaction/span/breadcrumb is attached to its own Hub instance
app.use(Sentry.Handlers.requestHandler());
// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler());

app.use(
  Sentry.Handlers.errorHandler({
    shouldHandleError(error) {
      // Capture all 404 and 500 errors
      if (error.status >= 400 && error.status <= 503) {
        return true;
      }
      return false;
    },
  })
);


app.use(bodyParser.json(JSON_PARSER));

app.use(bodyParser.urlencoded(URLENCODED));

app.use(cookieParser());

app.use(accessHeader);

v1(app);

v2(app);

v3(app);

app.use('/', router);

module.exports = app;