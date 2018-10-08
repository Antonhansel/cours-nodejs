# Jour 1

## Objectifs

En haut du fichier nodejs, ajouter

```
const fetch = require("node-fetch");

const weatherBaseUrl = `https://api.darksky.net/forecast/${process.env.DARKSKY_API_KEY}/`
const reverseGeoCodingUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=CITY&key=${process.env.GMAPS_API_KEY}`
const ipToAddressApi = `http://api.ipstack.com/IP_ADDRESS?access_key=f95929c427ddf987ba18268b712c57b8&format=1`
const getIpAddress = `https://ip.cn`;
```


```
    const ipPageRes = await fetch(getIpAddress);
    let ipPageText = await ipPageRes.text();
    const ip = ipPageText.match(/\d+\.\d+\.\d+\.\d+/)[0];
```

```
DARKSKY_API_KEY="7b513c959f289f3715ab183d50e191b6"
GMAPS_API_KEY="AIzaSyDsogEvFt_gE5joLrh_Nsfosvep2zTlnp4"
```

* Utiliser la base de code sur github puis
* npm install node-fetch
* Creer la classe SystemInfo
* Dans le constructeur de SystemInfo, prendre en parametre la frequence, et ajouter a la classe un objet "infos" avec les informations suivantes
    * platform
    * dirname
    * filename
    * arch
    * la mémoire totale du systeme
    * les interfaces reseau
* Ajouter une function membre de la classe "updateInfos" ajoutant a l'objet "infos" l'usage cpu, la mémoire libre, l'uptime
* Ajouter un interval pour appeler périodiquement updateInfos avec l'interval passé en paramètre de constructor
* Ajouter un getter "getSystemInfos" a la classe qui retourne les infos

* Créer la classe Weather
* Ajouter la méthode "getLocationInfo" dans la classe weather qui va d'abord récupérer l'ip du serveur, puis ensuite trouver la ville d'ou provient l'ip, puis convertir cette ville en lat/lng
* Ajouter la méthode getWeatherInfo qui récupère la météo en fonction de la latitute et la longitude fournie
* Ajouter le getter getWeather qui retourne la météo
