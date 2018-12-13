const fs = require('fs');
const util = require('util');

const readFile = util.promisify(fs.readFile);
const readdir = util.promisify(fs.readdir);

async function read1 (file) {
  const label = "readfile";
  console.time(label);
  const data = await readFile(__dirname + '/' + file, 'utf8');
  console.timeEnd(label);
}

async function read2 (file) {
  return new Promise(resolve => {
    const label = "stream";
    console.time(label);
    let data = "";
    const stream = fs.createReadStream(__dirname + '/' + file, {encoding: 'utf8'});
    stream.on('data', chunck => {
        // console.log('data');
        data += chunck;
    });
    stream.on('close', () => {
      // console.log('GET ' + data.split('"GET /').length);
      // console.log('POST ' + data.split('"POST /').length);
      // console.log('PUT ' + data.split('"PUT /').length);
      // console.log('DEL ' + data.split('"DEL /').length);
      const lines = data.split('\n');
      const ips = {};
      lines.forEach(line => {
        const ip = line.split(' - - ')[0];
        if (ips[ip]) {
          ips[ip] += 1;
          console.log(ip);
        }
        ips[ip] = 1;
      });
      // console.log(ips);
      console.log('IP différentes: ' + Object.keys(ips).length)
      console.timeEnd(label);
    });
  });
}

async function startTests(files) {
  for (let file of files) {
    // console.log(file);
    // await read1(file);
    await read2(file);
  }
}


readdir(__dirname).then(files => {
  startTests(["access.log"]);
}).catch(e => {
  console.log(e);
});
