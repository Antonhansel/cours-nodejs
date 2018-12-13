/* eslint import/order: 0 */ // --> OFF

require('newrelic');
const mongoose = require('mongoose');
const util = require('util');
const config = require('./config/config');
require('./server/models/index');
const expressConfig = require('./config/express');

const debug = require('debug')('express-mongoose-es6-rest-api:index');

// make bluebird default Promise
Promise = require('bluebird'); // eslint-disable-line no-global-assign

// plugin bluebird promise in mongoose
mongoose.Promise = Promise;

// connect to mongo db
const mongoUri = config.mongo.host;
mongoose.connect(`${mongoUri}${(config.env !== 'production' ? `/${config.env}` : '')}`,
  { server: { socketOptions: { keepAlive: 1 } } });
mongoose.connection.on('error', () => {
  throw new Error(`unable to connect to database: ${mongoUri}`);
});

// print mongoose logs in dev env
if (config.mongooseDebug) {
  mongoose.set('debug', (collectionName, method, query, doc) => {
    debug(`${collectionName}.${method}`, util.inspect(query, false, 20), doc);
  });
}

// module.parent check is required to support mocha watch
// src: https://github.com/mochajs/mocha/issues/1912
if (!module.parent) {
  // listen on port config.port
  expressConfig.app.listen(config.port, () => {
    console.info(`server started on port ${config.port} (${config.env})`); // eslint-disable-line no-console
  });
}

if ((mongoUri.indexOf('localhost') !== -1) && config.env === 'test') {
  mongoose.connection.once('connected', () => {
    mongoose.connection.db.dropDatabase();
  });
}

require('./server/socketHandler/index').socketHandler(expressConfig.io);

module.exports = expressConfig.app;
