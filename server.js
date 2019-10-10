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

let timeout;

const validWord = word => {
  if(word.split(' ').length === 1) {
    return true;
  }
  return false;
}

io.on("connection", socket => {
    console.log("new user connected");
    socket.emit("sendWords", words);

    socket.on("addWord", (word, callback) => {
      if(!validWord(word)) {
        callback("invalid word");
      } else {
        if(!timeout) {
          words.push(word);
          callback();
          io.emit("sendWords", words);
          io.emit("disable");
          timeout = setTimeout(() => {
            //TODO: make the timeout longer for the person that submitted the word
            io.emit("enable");
            timeout = null;
          }, 500);
        }
      }
    });

    socket.on("disconnect", () => console.log("client disconnected"));
});
