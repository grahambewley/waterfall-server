const express = require("express");
const router = express.Router();
const { createNewGame, validateGameJoin } = require('../utils/gameDatabase');

router.get("/", (req, res) => {
  res.send({ response: "I am alive" }).status(200);
});

router.post('/createGame', async (req, res) => {
  const { gameName, password } = req.body;
  
  try {
    const gameData = await createNewGame(gameName, password);
    res.send({ gameData }).status(200);
  } catch(error) {
    console.error(error);
    res.send('Error creating user', error).status(401);
  }
  
});

router.post('/joinGame', async (req, res) => {
  const { shortId, password, playerName } = req.body;
  
  try {
    const response = await validateGameJoin(shortId, password, playerName);

    console.log("Response from trying to validate game id and PW: ", response);
    // if response.error -- something was incorrect, couldn't join

    // else -- socket.io join this game

    res.send('Hello there').status(200);
  } catch(error) {
    console.error(error);
    res.send('Error joining  user', error).status(401);
  }
  
});

module.exports = router;