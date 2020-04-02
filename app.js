const express = require("express");
const cors = require('cors');

const http = require("http");
const socketIo = require("socket.io");
const index = require("./routes/index");
const { determineOutcome } = require('./utils/gameLogic');
const { findUserInGame } = require('./utils/gameDatabase');

const app = express();
const port = process.env.PORT || 4001;

app.use(cors());
app.use(express.json());
app.use(index);

const server = http.createServer(app);

const io = socketIo(server);

// const gameStatus = {
//   name: 'Trash Palace Waterfall',
//   playerTurnIndex: 0,
//   players: [
//     {
//       name: 'Graham',
//       qMaster: false,
//       tMaster: false
//     },
//     {
//       name: 'Jordan',
//       qMaster: false,
//       tMaster: false
//     },{
//       name: 'John',
//       qMaster: false,
//       tMaster: false
//     },
//     {
//       name: 'Joe',
//       qMaster: false,
//       tMaster: false
//     }
//   ],
//   rules: [
//     // 'If you touch your face, you drink'
//   ],
//   dates: [

//   ],
//   unplayedCards: [
//     '2H', '2D', '2C', '2S',
//     '3H', '3D', '3C', '3S',
//     '4H', '4D', '4C', '4S',
//     '5H', '5D', '5C', '5S',
//     '6H', '6D', '6C', '6S',
//     '7H', '7D', '7C', '7S',
//     '8H', '8D', '8C', '8S',
//     '9H', '9D', '9C', '9S',
//     '10H', '10D', '10C', '10S',
//     'JH', 'JD', 'JC', 'JS',
//     'QH', 'QD', 'QC', 'QS',
//     'KH', 'KD', 'KC', 'KS',
//     'AH', 'AD', 'AC', 'AS'
//   ],
//   lastPulledCard: '',
//   lastPulledCardOutcome: ''
// }

io.on("connection", socket => {
  // When a new client connects, log to console and emit them the current gameStatus
  console.log("New client connected");
  // socket.emit('currentGameStatus', gameStatus);
  
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
    gameStatus.lastPulledCardOutcome = determineOutcome(pulledCard, gameStatus);

    // Switch to next player's turn
    if(gameStatus.playerTurnIndex === gameStatus.players.length - 1) {
      gameStatus.playerTurnIndex = 0;
    } else {
      gameStatus.playerTurnIndex = gameStatus.playerTurnIndex + 1;
    }

    io.emit('currentGameStatus', gameStatus);
  });

  socket.on('join', async ({ shortId, player_id, player_name }, callback) => {
    const { error, gameStatus } = await findUserInGame(shortId,  player_id);
    
    if(error) {
        return callback({ error });
    }
    
    socket.join(shortId);
    // socket.emit('message', generateMessage('Admin', 'Welcome!'))
    socket.broadcast.to(shortId).emit('message', `${player_name} has joined`);
    callback({ gameStatus });
  });

  // When a client disconnects, log to console
  socket.on("disconnect", () => console.log("Client disconnected"));
});

server.listen(port, () => console.log(`Listening on port ${port}`));