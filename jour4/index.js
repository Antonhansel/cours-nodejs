const Weather = require('./weather');
const SystemInfo = require('./SystemInfos');
const express = require('express')
const app = express()
const mongoose = require('mongoose');
const port = process.env.PORT || 3000
require('./todos.model.js');
const routesHandler = require('./routes');
const bodyParser = require('body-parser');

const init = async () => {
    const weatherInstance = new Weather();
    const systemInfoInstance = new SystemInfo(1000);
    await weatherInstance.getLocationInfo();
    await weatherInstance.getWeatherInfo();
    app.set('view engine', 'ejs');
    app.use(express.static('views'))
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));
    app.get('/infos', (req, res) => res.send(systemInfoInstance.getSystemInfos()))
    app.get('/weather', (req, res) => res.send(weatherInstance.getWeatherInfo()))

    // index page
    app.get('/', function(req, res) {
      res.render('index');
    });
    routesHandler(app);
    mongoose.connect('mongodb://localhost:27017/dashboard');
    app.listen(port, () => console.log(`Example app listening on port ${port}!`))
}

process
  .on('unhandledRejection', (reason, p) => {
    console.error(reason, 'Unhandled Rejection at Promise', p);
  })
  .on('uncaughtException', err => {
    console.error(err, 'Uncaught Exception thrown');
    process.exit(1);
  });

init();