const express = require("express");
const cors = require('cors');
const http = require("http");
const socketIo = require("socket.io");
const index = require("./routes/index");
const { determineOutcomeSimplified, determineOutcomeClassic } = require('./utils/gameLogic');
const { findUserInGame, updateGameStatus, getGameStatus, playAgain } = require('./utils/gameDatabase');

const app = express();
const port = process.env.PORT || 4001;

app.use(cors());
app.use(express.json());
app.use(index);

const server = http.createServer(app);
const io = socketIo(server);

io.on("connection", socket => {
  // When a new client connects, log to console and emit them the current gameStatus
  console.log("New client connected");
  // socket.emit('currentGameStatus', gameStatus);
  
  socket.on('takeTurn', async (data) => {

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
    if(data.gameMode === 'simplified') {
      tempStats = determineOutcomeSimplified(data.pulledCard, tempStats);
    } else if(data.gameMode === 'classic') {
      tempStats = determineOutcomeClassic(data.pulledCard, tempStats);
    }
    
    // Switch to next player's turn
    if(tempStats.turnIndex === tempStats.players.length - 1) {
      tempStats.turnIndex = 0;
    } else {
      tempStats.turnIndex = tempStats.turnIndex + 1;
    }

    // Set updated game stats
    const response = await updateGameStatus(data.shortId, tempStats);
    
    io.in(data.shortId).emit('currentGameStatus', response.gameStatus);
    if(response.gameStatus.unplayedCards.length === 0) {
      io.in(data.shortId).emit('gameOver');
    } 
  });

  socket.on('playAgain', async (data) => {
    const res = await playAgain(data.shortId);
    console.log("Response from playAgain function", res);

    if(res.gameStatus) {
      console.log("Got gameStatus back, emitting currentGameStatus...");
      io.in(data.shortId).emit('currentGameStatus', res.gameStatus);
    }
  });

  socket.on('transmitGameStatus', async ({ shortId }) => {
    const response = await getGameStatus(shortId);
    if(response.gameStatus) {
      io.in(shortId).emit('currentGameStatus', response.gameStatus);
    } 
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
