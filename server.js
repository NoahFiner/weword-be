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

const baseErrorJSON = {
  minLength: 1,
  maxLength: 50,
  minWords: 1,
  maxWords: 1,
  bannedCharacters: [],
  bannedWords: ['elp'],
}

const getWordError = (word, errorJSON) => {
  if("minLength" in errorJSON && word.length < errorJSON.minLength) {
    return "word is shorter than minimum length of " + errorJSON.minLength;
  }
  if("maxLength" in errorJSON && word.length > errorJSON.maxLength) {
    return "word is longer than maximum length of " + errorJSON.maxLength;
  }
  if("minWords" in errorJSON && word.split(' ').length < errorJSON.minWords) {
    return "submission has less words than " + errorJSON.minWords;
  }
  if("maxWords" in errorJSON && word.split(' ').length > errorJSON.maxWords) {
    return "submission has more words than " + errorJSON.maxWords;
  }

  lowerCaseWord = word.toLowerCase();
  if("bannedCharacters" in errorJSON && errorJSON.bannedCharacters.some(char => lowerCaseWord.includes(char.toLowerCase()))) {
    return "submission contains restricted character";
  }
  if("bannedWords" in errorJSON && errorJSON.bannedWords.some(bannedWord => lowerCaseWord.split(' ').some(compWord => compWord === bannedWord.toLowerCase()))) {
    return "submission contains restricted words";
  }
  return null;
}

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
