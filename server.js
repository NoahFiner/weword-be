const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const mongoose = require('mongoose');

const bodyParser = require('body-parser');
const cors = require('cors');

const axios = require('axios');

const port = process.env.PORT || 4001;
const index = require('./routes/index');

const storyRouter = require('./routes/stories');
const wordRouter = require('./routes/words');

const {getWordError, baseErrorJSON} = require('./helpers/wordErrors');

const app = express();
app.use(cors());
app.use(index);
app.use(storyRouter);
app.use(wordRouter);
app.use(bodyParser.json());

mongoose.connect('mongodb://127.0.0.1:27017/stories', { useNewUrlParser: true, useCreateIndex: true });

const connection = mongoose.connection;
connection.once('open', function() {
    console.log("MongoDB database connection established successfully");
});

const server = http.createServer(app);

const io = socketIo(server);

server.listen(port, () => console.log('listening on port', port));

let words = [];

let timeout;

io.on("connection", socket => {
    console.log("new user connected");
    socket.emit("sendWords", words);

    socket.on("addWord", (word, callback) => {
      const error = getWordError(word, baseErrorJSON);
      if(error) {
        callback(error);
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
          }, 750);
        } else {
          callback("duplicate word");
        }
      }
    });

    socket.on("disconnect", () => console.log("client disconnected"));
});
