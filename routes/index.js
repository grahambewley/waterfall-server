const express = require("express");
const cors = require('cors');
const router = express.Router();
const { createNewGame, validateGame, addPlayerToGame } = require('../utils/gameDatabase');

router.get("/", (req, res) => {
  res.send({ response: "I am alive" }).status(200);
});

router.post('/createGame', cors(), async (req, res) => {
  const { gameName, password } = req.body;
  
  try {
    const gameData = await createNewGame(gameName, password);
    res.send({ gameData }).status(200);
  } catch(error) {
    console.error(error);
    res.send('Error creating user', error).status(401);
  }
  
});

router.post('/addPlayerToGame', cors(), async (req, res) => {
  const { shortId, player_name, player_id } = req.body;

  const newPlayer = await addPlayerToGame(shortId, player_name, player_id);
  
  res.send( newPlayer );
})

router.post('/validate', cors(), async (req, res) => {
  const { shortId, password } = req.body;
  
  try {
    const response = await validateGame(shortId, password);
    res.send(response).status(200);
  } catch(error) {
    console.error(error);
    res.send('Error joining  user', error).status(401);
  }
  
});

module.exports = router;