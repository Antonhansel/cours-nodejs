const os = require('os');
const fetch = require("node-fetch");

const weatherBaseUrl = `https://api.darksky.net/forecast/${process.env.DARKSKY_API_KEY}/`
const reverseGeoCodingUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=CITY&key=${process.env.GMAPS_API_KEY}`
const ipToAddressApi = `http://api.ipstack.com/IP_ADDRESS?access_key=f95929c427ddf987ba18268b712c57b8&format=1`
const getIpAddress = `https://ip.cn`;

class Weather {
    async getLocationInfo() {
        console.log('Début de getLocation info')
        const ipPageRes = await fetch(getIpAddress);
        let ipPageText = await ipPageRes.text();
        const ip = ipPageText.match(/\d+\.\d+\.\d+\.\d+/)[0];
        const ipApiResponse = await fetch(ipToAddressApi.replace('IP_ADDRESS', ip));
        const ipApiJson = await ipApiResponse.json();
        const reverseGeoCodedUrl = await fetch(reverseGeoCodingUrl.replace('CITY', ipApiJson.city))
        const reverseGeoCodedJson = await reverseGeoCodedUrl.json();
        this.lat = reverseGeoCodedJson.results[0].geometry.location.lat;
        this.lng = reverseGeoCodedJson.results[0].geometry.location.lng;
        console.log('Fin de getLocationInfo')
    }
    async getWeatherInfo () {
        console.log('Début de getWeatherInfo');
        const weatherApiResponse = await fetch(`${weatherBaseUrl}${this.lat},${this.lng}`)
        this.weather = await weatherApiResponse.json();
        console.log('Fin de getWeatherInfo')
    }
    getWeather() {
        return JSON.parse(JSON.stringify(this.weather));
    }
}

class SystemInfo {
    constructor(frequency) {
        this.infos = {
            dirname: __dirname,
            filename: __filename,
            platform: os.platform(),
            arch: os.arch(),
            totalmem: os.totalmem(),
            network: os.networkInterfaces()
        },
        setInterval(this.updateInfos, frequency)
    }

    updateInfos() {
        this.infos = {
            ...this.infos,
            cpus: os.cpus(),
            freemem: os.freemem(),
            uptime: os.uptime(),
        };
    }

    getSystemInfos() {
        return this.infos;
    }
}


const init = async () => {
    // const weatherInstance = new Weather();
    // const systemInfoInstance = new SystemInfo(1000);
    // await weatherInstance.getLocationInfo();
    // await weatherInstance.getWeatherInfo();
    // let newWeather = weatherInstance.getWeather();
    // newWeather.bidule = "test";
    // console.log(weatherInstance.getWeather())
    // console.log(systemInfoInstance.getSystemInfos())
    const testObjet = {'coucou': 'salut'};
    console.log(testObjet);
    testObjetEnString = JSON.stringify(testObjet);
    testObjet.bidule = "machin";
    console.log(testObjet)
    nouveauTestObjet = JSON.parse(testObjetEnString);
    console.log(nouveauTestObjet);


}

init();

