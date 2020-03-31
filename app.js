const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const axios = require("axios");

const index = require("./routes/index");

const app = express();
const port = process.env.PORT || 4001;

app.use(index);

const server = http.createServer(app);

const io = socketIo(server);

const gameStatus = {
  playerTurnIndex: 0,
  players: [
    {
      name: 'Graham',
      qMaster: false,
      tMaster: true
    },
    {
      name: 'Jordan',
      qMaster: true,
      tMaster: false
    }
  ],
  rules: [
    'If you touch your face, you drink'
  ],
  unplayedCards: [
    '2H', '2D', '2C', '2S',
    '3H', '3D', '3C', '3S',
    '4H', '4D', '4C', '4S',
    '5H', '5D', '5C', '5S',
    '6H', '6D', '6C', '6S',
    '7H', '7D', '7C', '7S',
    '8H', '8D', '8C', '8S',
    '9H', '9D', '9C', '9S',
    '10H', '10D', '10C', '10S',
    'JH', 'JD', 'JC', 'JS',
    'QH', 'QD', 'QC', 'QS',
    'KH', 'KD', 'KC', 'KS',
    'AH', 'AD', 'AC', 'AS'
  ]
}

io.on("connection", socket => {
  // When a new client connects, log to console and emit them the current gameStatus
  console.log("New client connected");
  socket.emit('currentGameStatus', gameStatus);

  // When a client disconnects, log to console
  socket.on("disconnect", () => console.log("Client disconnected"));
  
  socket.on('pullCard', randomCard => {
    console.log('Card pulled: ', randomCard);
    const newUnplayedCards = gameStatus.unplayedCards.filter(card => {
      return card != randomCard;
    });
    gameStatus.unplayedCards = newUnplayedCards;
  
    io.emit('currentGameStatus', gameStatus);
  });

});

server.listen(port, () => console.log(`Listening on port ${port}`));