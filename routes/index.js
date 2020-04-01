const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send({ response: "I am alive" }).status(200);
});

router.get('/createGame', (req, res) => {
  const { gameName } = req.body;
  res.send({ response: 'Hello there!' }).status(200);
})

module.exports = router;