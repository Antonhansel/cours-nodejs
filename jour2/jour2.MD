# Jour 2

## Objectifs

* Séparer les classes SystemInfo et Weather dans des fichiers a part


 index.js -> const Weather = require('./weather.js');

 weather.js -> module.exports = Weather;
 systemInfo.js -> module.exports = SystemInfo;

* Créer un fichier package.json avec la commande npm init
* npm install --save node-fetch
* npm install --save-dev nodemon
* Utiliser des events emitter pour gérer une erreur de Promise
* Utiliser fs- pour écrire de la donnée dans un fichier

* nouveau dossier, index.js, package.json
* dans index.js, lire un fichier de manière asynchrone



console.time('coucou');
fs.readFile
console.timeEnd('coucou')





* wget http://www.almhuette-raith.at/apache-log/access.log
* Utiliser readdir et readFile
* Promisifier readdir, readFile
* Mesurer le temps d'execution avec console.time et console.timeend
* Lire un fichier avec readFile
* Lire un fichier avec createReadStream
* LIRE UN GROS FICHIER
* Parser le gros fichier et faire des stats sur les calls APIs, etc...
* Utiliser un .env
* utiliser Joy
* 