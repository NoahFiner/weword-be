const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const axios = require('axios');

const port = process.env.PORT || 4001;
const index = require('./routes/index');

const app = express();
app.use(index);

const server = http.createServer(app);

const io = socketIo(server);

server.listen(port, () => console.log('listening on port', port));

let words = [];

io.on("connection", socket => {
    console.log("new user connected");
    socket.emit("sendWords", words);

    socket.on("addWord", word => {
        console.log("tryna add word", word);
        words.push(word);
        console.log(words);
        io.emit("sendWords", words);
    });
    socket.on("disconnect", () => console.log("client disconnected"));
});