const fs = require('fs');

const readDirCallback = (err, files) => {
}

fs.readdir(__dirname, readDirCallback);


//////////////////////////

const mineReadFile = (file, callback) => {
    if (file === 'node_modules') {
        callback(null);
        return; 
    }
    fs.readFile(__dirname + '/' + file, "utf8", (err, content) => {
        callback(err, content);
    });
}

const lastCallBack = (err, contents) => {
    console.log(err, contents);
}
fs.readdir(__dirname, (err, files) => {
    async.map(files, mineReadFile, lastCallBack);
})

