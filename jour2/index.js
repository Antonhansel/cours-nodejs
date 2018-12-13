const Weather = require('./weather');
const SystemInfo = require('./SystemInfos');

const init = async () => {
    const weatherInstance = new Weather();
    const systemInfoInstance = new SystemInfo(1000);
    await weatherInstance.getLocationInfo();
    await weatherInstance.getWeatherInfo();
    // console.log(weatherInstance.getWeather())
    // console.log(systemInfoInstance.getSystemInfos())
    throw Error('Woaw this is broken !')
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