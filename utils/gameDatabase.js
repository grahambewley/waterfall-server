const bcrypt = require('bcrypt');
const Game =  require('../models/Game');
const connectDb = require('./connectDb');
const randomString = require('randomstring');

connectDb();

const createNewGame = async (gameName, gameMode, password) => {

    try {
        const hash = await bcrypt.hash(password, 10);

        const newGame = await new Game({
            shortId: randomString.generate(5),
            name: gameName,
            mode: gameMode,
            password: hash
        }).save();

        return newGame;
    } catch (error) {
        return error;
    }   
}

const validateGame = async (shortId, password) => {
    
    try {
        // Check to see if game exists with provided shortId
        // Since password was set to select:false in the schema, it's not returned by default. 
        // Using .select() on the .findOne method allows us to specify that we want password anyway.
        const game = await Game.findOne({ shortId }).select('+password');
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
            return { error: 'Password is incorrect!' }
        }

    } catch(error) {
        console.error(error);
        return { error: 'Unexpected error logging into game' };
    }
}

const addPlayerToGame = async (shortId, player_name, player_id, player_isAdmin, player_isOffline) => {
    
    try {
        // validate the data
        if(!player_name || !shortId || !player_id) {
            return {
                error: 'Player Name, Player ID and Game ID are required!'
            }
        }
        
        // Get this game from DB
        const game = await Game.findOne({ shortId });
        // Filter the players array to see if there is a player with this name already
        const matchingPlayers = game.players.filter(player => {
            return player.player_id === player_id;
        });
        // If there is, return error
        if(matchingPlayers.length > 0) {
            return {
                error: 'Player already exists with that ID!'
            }
        }
        // If not, update game to include player
        const newPlayer = { player_name, player_isAdmin, player_isOffline, player_id };
        await Game.findOneAndUpdate(
            // This filter selects the document in general
            { shortId },
            // Add to the players array -- addToSet adds a unique element to an array
            // alternatively, $push would add the element no matter what
            { $addToSet: { players: newPlayer } }
        )
        return { newPlayer };
    } catch(error) {
        console.error("Error adding player to game, ", error);
        return {
            error: 'Error adding player to game'
        }
    }
}

const addRuleToGame = async (shortId, rule) => {
    try {
        // update game to include rule
        const response = await Game.findOneAndUpdate(
            // This filter selects the document in general
            { shortId },
            // Add to the rules array -- addToSet adds a unique element to an array
            // alternatively, $push would add the element no matter what
            { $addToSet: { rules: rule } }
        )
        return { response };
    } catch(error) {
        console.error("Error adding rule to game, ", error);
        return {
            error: 'Error adding rule to game'
        }
    }
}

const removePlayer = async (shortId, player_id) => {
    try {
        // validate the data
        if(!shortId || !player_id) {
            return {
                error: 'Player ID and Game ID are required!'
            }
        }
        
        // Get this game from DB
        const game = await Game.findOne({ shortId });
        
        const matchingPlayers = game.players.filter(player => {
            return player.player_id === player_id;
        });
        // If there is no matching player, return error
        if(matchingPlayers.length === 0) {
            return {
                error: 'No player in this game with that ID!'
            }
        }

        const updatedGame = await Game.findOneAndUpdate(
            // Find cart according to user ID
            { shortId },
            // MongoDB operator $pull - pulls element from product array
            // "Pull from products array where the product field is set to the product ID"
            { $pull: { players: { player_id: player_id } } },
            // Make sure we're always getting back the updated version of the cart - not the old version of the cart
            { new: true }
        )
        return { updatedGame };
    } catch(error) {
        console.error("Error removing player from game, ", error);
        return {
            error: 'Error removing player from game'
        }
    }
}

const removeRule = async (shortId, rule) => {
    try {
        const updatedGame = await Game.findOneAndUpdate(
            // Find cart according to user ID
            { shortId },
            // MongoDB operator $pull - pulls element from product array
            { $pull: { rules: rule } },
            // Make sure we're always getting back the updated version of the game - not the old version of the game
            { new: true }
        )
        return { updatedGame };
    } catch(error) {
        console.error("Error removing rule from game, ", error);
        return {
            error: 'Error removing rule to game'
        }
    }
}

const findUserInGame = async (shortId, player_id) => {
    try {
        const game = await Game.findOne({ shortId });
        
        if(!game) {
            return { error: 'No game exists with that ID!' };
        }
        
        const user = game.players.find(player => player.player_id === player_id);

        if(user) {
            return {
                gameStatus: game
            }
        } else {
            return { error: 'User not found in game!' }
        }
    } catch(error) {
        console.error(error);
        return { error: 'Unexpected error finding user' };
    }
}

const updateGameStatus = async (shortId, gameStatus) => {

    const { turnIndex, unplayedCards, lastPulledCard, lastPulledCardOutcome, lastPulledCardInstruction, players } = gameStatus

    try {
        const gameStatus = await Game.findOneAndUpdate(
            // Find game by shortId
            { shortId },
            // MongoDB operator $pull - pulls element from product array
            // "Pull from products array where the product field is set to the product ID"
            { 
                turnIndex, 
                unplayedCards, 
                lastPulledCard, 
                lastPulledCardOutcome,
                lastPulledCardInstruction,
                players
            },
            // Make sure we're always getting back the updated version of the cart - not the old version of the cart
            { new: true }
        );

        if(gameStatus) {
            return { gameStatus }
        } else {
            return { error: 'Unable to update game status' };
        }
    } catch(error) {
        console.error(error);
        return { error: 'Unexpected error updating game' };
    }
}

const getGameStatus = async (shortId) => {
    const gameStatus = await Game.findOne({ shortId });
    if(gameStatus) {
        return { gameStatus }
    } else {
        return { error: 'Unable to get game status' };
    }
}

module.exports = {
    createNewGame,
    validateGame,
    addPlayerToGame,
    addRuleToGame,
    removePlayer,
    removeRule,
    findUserInGame,
    updateGameStatus,
    getGameStatus
}