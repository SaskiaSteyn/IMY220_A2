const Poll = require('./poll.js');

const fs = require('fs');
const http = require('http'); 
const path = require('path'); 
const { join } = require('node:path');


const { createServer } = require('node:http');
const express = require('express');
const app = express();
const server = createServer(app);

const { Server } = require('socket.io');
const io = new Server(server, {
    cors: {
        origin: "*"
      }
});


const PORT = 3000;

const kittyVotesMap = new Poll({
    'pebble': 0,
    'sunshine': 0,
    'miso': 0,
    'panko': 0,
    'snowball': 0
}); 


app.get('/', (req, res) => {
    //res.send('Hello World!')
    res.sendFile(join(__dirname, 'index.html'));
}); 

app.get('/index.js', (req, res) => {
    //res.send('Hello World!')
    res.sendFile(join(__dirname, 'index.js'));
});


server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`)
});

io.on('connection', (socket) => {

    console.log("A user connected with ID: ", socket.id);
    socket.join("KittyVote");
    socket.emit('votesUpdated', JSON.stringify(kittyVotesMap.getVotes()));

    socket.on('disconnect', () => {
        console.log('A user disconnected');
      });

    socket.on('voting', (selectedKitty) => {
        kittyVotesMap.vote(selectedKitty);
        io.emit('votesUpdated', JSON.stringify(kittyVotesMap.getVotes()));
        io.emit('userVoted', socket.id, selectedKitty);
    })
});



// const MIME_TYPES = {
//   default: "application/octet-stream",
//   html: "text/html; charset=UTF-8",
//   js: "application/javascript",
// };

// const STATIC_PATH = path.join(process.cwd(), "./");

// const toBool = [() => true, () => false];

// const prepareFile = async (url) => {
//   const paths = [STATIC_PATH, url];
//   if (url.endsWith("/")) paths.push("index.html");
//   const filePath = path.join(...paths);
//   const pathTraversal = !filePath.startsWith(STATIC_PATH);
//   const exists = await fs.promises.access(filePath).then(...toBool);
//   const found = !pathTraversal && exists;
//   const ext = path.extname(filePath).substring(1).toLowerCase();
//   const stream = fs.createReadStream(filePath);
//   return { found, ext, stream };
// };

// http
//   .createServer(async (req, res) => {
//     const file = await prepareFile(req.url);
//     const statusCode = file.found ? 200 : 404;
//     const mimeType = MIME_TYPES[file.ext] || MIME_TYPES.default;
//     res.writeHead(statusCode, { "Content-Type": mimeType });
//     file.stream.pipe(res);
//     console.log(`${req.method} ${req.url} ${statusCode}`);
//   })
//   .listen(PORT);

// console.log(`Server running at http://localhost:${PORT}/`);


