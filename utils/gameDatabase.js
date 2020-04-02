const bcrypt = require('bcrypt');
const Game =  require('../models/Game');
const connectDb = require('./connectDb');

connectDb();

const createNewGame = async (gameName, password) => {

    try {
        const hash = await bcrypt.hash(password, 10);

        const newGame = await new Game({
            name: gameName,
            password: hash
        }).save();

        return newGame;
    } catch (error) {
        return error;
    }   
}

const validateGameJoin = async (shortId, password, playerName) => {
    
    try {
        // Check to see if game exists with provided shortId
        // Since password was set to select:false in the schema, it's not returned by default. 
        // Using .select() on the .findOne method allows us to specify that we want password anyway.
        const game = await Game.findOne({ shortId }).select('+password');
        
        console.log("Found game with the provided shortId", game);

        // If not, return error
        if(!game) {
            return { error: 'No game exists with that ID!' };
        }
        // Check to see if password matches the one in DB
        const passwordsMatch = await bcrypt.compare(password, game.password);
        // If so, generate token
        if(passwordsMatch) {
            return { gameData: game }
        } else {
            return { error: 'Password was incorrect!' }
        }

    } catch(error) {
        console.error(error);
        res.status(500).send('Error logging in user');
    }
}

module.exports = {
    createNewGame,
    validateGameJoin
}