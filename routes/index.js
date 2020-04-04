const express = require("express");
const router = express.Router();
const { createNewGame, validateGame, addPlayerToGame, addRuleToGame, removePlayer, removeRule } = require('../utils/gameDatabase');

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

router.post('/addPlayerToGame', async (req, res) => {
  const { shortId, player_name, player_id, player_isAdmin, player_isOffline } = req.body;

  const newPlayer = await addPlayerToGame(shortId, player_name, player_id, player_isAdmin, player_isOffline);
  res.send( newPlayer ).status(200);
})

router.post('/addRuleToGame', async (req, res) => {
  const { shortId, rule } = req.body;

  const newRule = await addRuleToGame(shortId, rule);
  res.send( newRule ).status(200);
})

router.post('/removePlayer', async (req, res) => {
  const { shortId, player_id } = req.body;

  const updatedGame = await removePlayer(shortId, player_id);
  res.send( updatedGame ).status(200);

})

router.post('/removeRule', async (req, res) => {
  const { shortId, rule } = req.body;
  console.log("Rule received to remove ", rule);
  const updatedGame = await removeRule(shortId, rule);
  res.send( updatedGame ).status(200);

})

router.post('/validate', async (req, res) => {
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