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

let words = {};

let timeout = {};

const {writeWord, getWords} = require("./helpers/wordHelpers");

io.on("connection", socket => {
    console.log("new user connected");

    socket.on('join', async ({room}) => {
      try {
        socket.join(room);

        // if the words for this story haven't been loaded yet
        if(!(room in words)) {
          try {
            words[room] = await getWords(room);
          } catch(error) {
            socket.emit("sendWords", []);
          }
        }
        socket.emit("sendWords", words[room]);
      } catch(error) {
        callback(error);
      }
    });

    socket.on("addWord", ({word, room}, callback) => {
      const error = getWordError(word, baseErrorJSON);
      if(error) {
        callback(error);
      } else {
        if(!timeout[room]) {
          try {
            words[room].push({word});

            callback();

            io.to(room).emit("sendWords", words[room]);
            io.to(room).emit("disable");

            // TODO: error checking

            // TODO: make this promise based also or something
            timeout[room] = setTimeout(async () => {
              // Room's id is going to be the storyId too
              writtenWord = await writeWord(room, word);
              words[room] = await getWords(room);
              //TODO: make the timeout longer for the person that submitted the word
              io.to(room).emit("enable");
              timeout[room] = null;
            }, 750);
          } catch(error) {
            callback(error);
          }
        } else {
          callback("duplicate word");
        }
      }
    });

    socket.on("disconnect", () => console.log("client disconnected"));
});
