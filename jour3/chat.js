const http = require('http');

const server = http.createServer((req, res) => {
    res.end()
});

const io = require('socket.io')(server);

io.on('connect', (socket) => {
    socket.on('message', (data) => {
        console.log('Message received: ', data);
        io.emit('response', data);
    })
    console.log('Nouveau client connecté!')
});
server.listen(8080);

////////////

const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
//   output: process.stdout,
  terminal: false
});

const socket2 = require('socket.io-client')('http://192.168.2.100:8080');
socket2.on('connect', function(){
    rl.on('line', function(line){
        socket2.emit('message', line)
    });
    socket2.on('response', (data) => {
        console.log('response:', data)
    })
    console.log('Connecté')
});