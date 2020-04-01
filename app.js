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
  name: 'Trash Palace Waterfall',
  playerTurnIndex: 0,
  players: [
    {
      name: 'Graham',
      qMaster: false,
      tMaster: false
    },
    {
      name: 'Jordan',
      qMaster: false,
      tMaster: false
    }
  ],
  rules: [
    // 'If you touch your face, you drink'
  ],
  dates: [

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
  ],
  lastPulledCard: '',
  lastPulledCardOutcome: ''
}

const determineOutcome = (pulledCard) => {
  const denomination = pulledCard.charAt(0);
  const suit = pulledCard.charAt(1);

  console.log("Card denomination " + denomination);
  console.log("Card suit " + suit);

  let outcome = '';

  // If this is a face card...
  if(isNaN(denomination)) {
    //**** JACK = THUMB MASTER ***//
    if(denomination === 'J') {
      outcome = `${gameStatus.players[gameStatus.playerTurnIndex].name} is now Thumb Master!`;
      
      gameStatus.players.forEach(player => {
        player.tMaster = false;
      });
      
      gameStatus.players[gameStatus.playerTurnIndex].tMaster = true;
    }

    //**** QUEEN = QUESTION MASTER ***//
    else if(denomination === 'Q') {
      outcome = `${gameStatus.players[gameStatus.playerTurnIndex].name} is now Question Master!`;
      
      gameStatus.players.forEach(player => {
        player.qMaster = false;
      });
      
      gameStatus.players[gameStatus.playerTurnIndex].qMaster = true;
    }

    //**** KING = RULE MASTER ***//
    else if(denomination === 'K') {
      outcome = `${gameStatus.players[gameStatus.playerTurnIndex].name} makes a new Rule!`;
      
      // TODO:
      // Request rule from this player
      // Update rules list
    }

    //**** ACE = WATERFALL ***//
    else if(denomination === 'A') {
      outcome = `${gameStatus.players[gameStatus.playerTurnIndex].name} starts a Waterfall!`;
    }
  }
  // Otherwise this is a numbered card
  else {
    if(parseInt(denomination) <= 6) {
      // Determine red or black
      if(suit === 'D' || suit === 'H') {
        outcome = `${gameStatus.players[gameStatus.playerTurnIndex].name} takes ${denomination} drinks!`;
      }
      else if(suit === 'C' || suit === 'S') {
        outcome = `${gameStatus.players[gameStatus.playerTurnIndex].name} gives out ${denomination} drinks!`;
      }
    }

    //**** 7 = HEAVEN ***//
    else if(parseInt(denomination) === 7) {
      outcome = `7 is Heaven! Point to the sky!`;
    }

    //**** 8 = DATE ***//
    else if(parseInt(denomination) === 8) {
      outcome = `8 is Date! ${gameStatus.players[gameStatus.playerTurnIndex].name} picks a date!`;

      // TODO:
      // Request date from this player
      // Update dates in 
    }

    //**** 9 = RHYME ***//
    else if(parseInt(denomination) === 9) {
      outcome = `9 is Rhyme Time! ${gameStatus.players[gameStatus.playerTurnIndex].name} picks a word to rhyme!`;
    }

    //**** 10 = CATEGORIES ***//
    else if(parseInt(denomination) === 10) {
      outcome = `10 is Categories! ${gameStatus.players[gameStatus.playerTurnIndex].name} picks a category!`;
    }
  }

  return outcome;
}

io.on("connection", socket => {
  // When a new client connects, log to console and emit them the current gameStatus
  console.log("New client connected");
  socket.emit('currentGameStatus', gameStatus);

  // When a client disconnects, log to console
  socket.on("disconnect", () => console.log("Client disconnected"));
  
  socket.on('takeTurn', pulledCard => {
    console.log('Card pulled: ', pulledCard);

    // Remove this card from the deck
    const newUnplayedCards = gameStatus.unplayedCards.filter(card => {
      return card != pulledCard;
    });
    gameStatus.unplayedCards = newUnplayedCards;

    // Set the last played card
    gameStatus.lastPulledCard = pulledCard;

    // Determine and set the outcome of this card
    gameStatus.lastPulledCardOutcome = determineOutcome(pulledCard);

    // Switch to next player's turn
    if(gameStatus.playerTurnIndex === gameStatus.players.length - 1) {
      gameStatus.playerTurnIndex = 0;
    } else {
      gameStatus.playerTurnIndex = gameStatus.playerTurnIndex + 1;
    }

    io.emit('currentGameStatus', gameStatus);
  });

});

server.listen(port, () => console.log(`Listening on port ${port}`));