const determineOutcomeClassic = (pulledCard, gameStatus) => {
    // All characters except the last one represent the denomination
    const denomination = pulledCard.slice(0, pulledCard.length - 1);
    // Last character is the suit
    const suit = pulledCard.charAt(pulledCard.length - 1);

    let outcome = '';
    let instruction = '';

    // If this is a face card...
    if(isNaN(denomination)) {
        //**** JACK = THUMB MASTER ***//
        if(denomination === 'J') {
            outcome = 'Thumb Master!'
            instruction = `${gameStatus.players[gameStatus.turnIndex].player_name} is now Thumb Master`;
        
            gameStatus.players.forEach(player => {
                player.player_isTmaster = false;
            });
            
            gameStatus.players[gameStatus.turnIndex].player_isTmaster = true;
        }

        //**** QUEEN = QUESTION MASTER ***//
        else if(denomination === 'Q') {
            outcome = 'Question Master!';
            instruction = `${gameStatus.players[gameStatus.turnIndex].player_name} is now Question Master`;
        
            gameStatus.players.forEach(player => {
                player.player_isQmaster = false;
            });
        
            gameStatus.players[gameStatus.turnIndex].player_isQmaster = true;
        }

        //**** KING = RULE MASTER ***//
        else if(denomination === 'K') {
            outcome = 'Rule Master!';
            instruction = `${gameStatus.players[gameStatus.turnIndex].player_name} makes a new Rule`;
        
            // TODO:
            // Request rule from this player
            // Update rules list
        }

        //**** ACE = WATERFALL ***//
        else if(denomination === 'A') {
            outcome = 'Waterfall!';
            instruction = `${gameStatus.players[gameStatus.turnIndex].player_name} starts a Waterfall`;
        }
    }
    // Otherwise this is a numbered card
    else {
        if(parseInt(denomination) <= 3) {
            // Determine red or black
            if(suit === 'D' || suit === 'H') {
                outcome = `${gameStatus.players[gameStatus.turnIndex].player_name} takes ${denomination} drinks!`;
            }
            else if(suit === 'C' || suit === 'S') {
                outcome = `${gameStatus.players[gameStatus.turnIndex].player_name} gives out ${denomination} drinks!`;
            }
        }


        //**** 4 = WHORES ***//
        else if(parseInt(denomination) === 4) {
            outcome = `4 is Whores!`;
            instruction = 'Ladies Drink!'
        }

        //**** 5 = SOCIAL ***//
        else if(parseInt(denomination) === 5) {
            outcome = `5 is Social!`;
            instruction = 'Everyone drinks!'
        }

        //**** 6 = Dicks ***//
        else if(parseInt(denomination) === 6) {
            outcome = `6 is Dicks!`;
            instruction = 'Guys drink!'
        }

        //**** 7 = HEAVEN ***//
        else if(parseInt(denomination) === 7) {
            outcome = `7 is Heaven!`;
            instruction = 'Point to the sky!'
        }

        //**** 8 = DATE ***//
        else if(parseInt(denomination) === 8) {
            outcome = `8 is Date!`;
            instruction = `${gameStatus.players[gameStatus.turnIndex].player_name} picks a date!`;
            // TODO:
            // Request date from this player
            // Update dates in 
        }

        //**** 9 = RHYME ***//
        else if(parseInt(denomination) === 9) {
            outcome = `9 is Rhyme Time!`;
            instruction = `${gameStatus.players[gameStatus.turnIndex].player_name} picks a word to rhyme!`
        }

        //**** 10 = CATEGORIES ***//
        else if(parseInt(denomination) === 10) {
            outcome = `10 is Categories!`;
            instruction = `${gameStatus.players[gameStatus.turnIndex].player_name} picks a category!`
        }
    }

    gameStatus.lastPulledCardOutcome = outcome;
    gameStatus.lastPulledCardInstruction = instruction;

    return gameStatus;
}

const determineOutcomeSimplified = (pulledCard, gameStatus) => {
    // All characters except the last one represent the denomination
    const denomination = pulledCard.slice(0, pulledCard.length - 1);
    // Last character is the suit
    const suit = pulledCard.charAt(pulledCard.length - 1);

    let outcome = '';
    let instruction = '';

    // If this is a face card...
    if(isNaN(denomination)) {
        //**** JACK = THUMB MASTER ***//
        if(denomination === 'J') {
            outcome = 'Thumb Master!'
            instruction = `${gameStatus.players[gameStatus.turnIndex].player_name} is now Thumb Master`;
        
            gameStatus.players.forEach(player => {
                player.player_isTmaster = false;
            });
            
            gameStatus.players[gameStatus.turnIndex].player_isTmaster = true;
        }

        //**** QUEEN = QUESTION MASTER ***//
        else if(denomination === 'Q') {
            outcome = 'Question Master!';
            instruction = `${gameStatus.players[gameStatus.turnIndex].player_name} is now Question Master`;
        
            gameStatus.players.forEach(player => {
                player.player_isQmaster = false;
            });
        
            gameStatus.players[gameStatus.turnIndex].player_isQmaster = true;
        }

        //**** KING = RULE MASTER ***//
        else if(denomination === 'K') {
            outcome = 'Rule Master!';
            instruction = `${gameStatus.players[gameStatus.turnIndex].player_name} makes a new Rule`;
        
            // TODO:
            // Request rule from this player
            // Update rules list
        }

        //**** ACE = WATERFALL ***//
        else if(denomination === 'A') {
            outcome = 'Waterfall!';
            instruction = `${gameStatus.players[gameStatus.turnIndex].player_name} starts a Waterfall`;
        }
    }
    // Otherwise this is a numbered card
    else {
        if(parseInt(denomination) <= 6) {
        // Determine red or black
        if(suit === 'D' || suit === 'H') {
            outcome = `${gameStatus.players[gameStatus.turnIndex].player_name} takes ${denomination} drinks!`;
        }
        else if(suit === 'C' || suit === 'S') {
            outcome = `${gameStatus.players[gameStatus.turnIndex].player_name} gives out ${denomination} drinks!`;
        }
        }

        //**** 7 = HEAVEN ***//
        else if(parseInt(denomination) === 7) {
            outcome = `7 is Heaven!`;
            instruction = 'Point to the sky!'
        }

        //**** 8 = DATE ***//
        else if(parseInt(denomination) === 8) {
            outcome = `8 is Date!`;
            instruction = `${gameStatus.players[gameStatus.turnIndex].player_name} picks a date!`;
            // TODO:
            // Request date from this player
            // Update dates in 
        }

        //**** 9 = RHYME ***//
        else if(parseInt(denomination) === 9) {
            outcome = `9 is Rhyme Time!`;
            instruction = `${gameStatus.players[gameStatus.turnIndex].player_name} picks a word to rhyme!`
        }

        //**** 10 = CATEGORIES ***//
        else if(parseInt(denomination) === 10) {
            outcome = `10 is Categories!`;
            instruction = `${gameStatus.players[gameStatus.turnIndex].player_name} picks a category!`
        }
    }

    gameStatus.lastPulledCardOutcome = outcome;
    gameStatus.lastPulledCardInstruction = instruction;

    return gameStatus;
}

module.exports = {
    determineOutcomeSimplified,
    determineOutcomeClassic
}