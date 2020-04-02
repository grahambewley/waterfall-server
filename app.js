const express = require("express");
const cors = require('cors');

const http = require("http");
const socketIo = require("socket.io");
const index = require("./routes/index");
const { determineOutcome } = require('./utils/gameLogic');
const { findUserInGame, updateGameStatus } = require('./utils/gameDatabase');

const app = express();
const port = process.env.PORT || 4001;

app.use(cors());
app.use(express.json());
app.use(index);

const server = http.createServer(app);

const io = socketIo(server);

// const gameStatus = {
//   name: 'Trash Palace Waterfall',
//   turnIndex: 0,
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
  
  socket.on('takeTurn', async (data) => {
    console.log('Card pulled: ', data.pulledCard);
    console.log("Room to pull card in: ", data.shortId);

    // get gameStatus from this room
    const res = await findUserInGame(data.shortId, data.player_id);

    if(res.error) {
      console.log(`Error pulling card from ${data.shortId} for user ${data.player_id}`);
      return error;
    }
    let tempStats = res.gameStatus;

    // Remove this card from the deck
    const tempUnplayedCards = tempStats.unplayedCards.filter(card => {
      return card != data.pulledCard;
    });
    tempStats.unplayedCards = tempUnplayedCards;
    // Set the last played card
    tempStats.lastPulledCard = data.pulledCard;
    // Determine and set the outcome of this card
    tempStats = determineOutcome(data.pulledCard, tempStats);
    // Switch to next player's turn
    if(tempStats.turnIndex === tempStats.players.length - 1) {
      tempStats.turnIndex = 0;
    } else {
      tempStats.turnIndex = tempStats.turnIndex + 1;
    }

    // Set updated game stats
    const response = await updateGameStatus(data.shortId, tempStats);

    io.in(data.shortId).emit('currentGameStatus', response.gameStatus);
  });

  socket.on('join', async ({ shortId, player_id, player_name }, callback) => {
    const { error, gameStatus } = await findUserInGame(shortId,  player_id);
    
    if(error) {
        return callback({ error });
    }
    
    socket.join(shortId);
    socket.to(shortId).emit('currentGameStatus', gameStatus);
    callback({ gameStatus });
  });

  // When a client disconnects, log to console
  socket.on("disconnect", () => console.log("Client disconnected"));
});

server.listen(port, () => console.log(`Listening on port ${port}`));