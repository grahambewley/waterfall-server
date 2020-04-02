const determineOutcome = (pulledCard, gameStatus) => {
    // All characters except the last one represent the denomination
    const denomination = pulledCard.slice(0, pulledCard.length - 1);
    // Last character is the suit
    const suit = pulledCard.charAt(pulledCard.length - 1);

    let outcome = '';

    // If this is a face card...
    if(isNaN(denomination)) {
        //**** JACK = THUMB MASTER ***//
        if(denomination === 'J') {
        outcome = `${gameStatus.players[gameStatus.turnIndex].player_name} is now Thumb Master!`;
        
        gameStatus.players.forEach(player => {
            player.player_isTmaster = false;
        });
        
        gameStatus.players[gameStatus.turnIndex].player_isTmaster = true;
        }

        //**** QUEEN = QUESTION MASTER ***//
        else if(denomination === 'Q') {
        outcome = `${gameStatus.players[gameStatus.turnIndex].player_name} is now Question Master!`;
        
        gameStatus.players.forEach(player => {
            player.player_isQmaster = false;
        });
        
        gameStatus.players[gameStatus.turnIndex].player_isQmaster = true;
        }

        //**** KING = RULE MASTER ***//
        else if(denomination === 'K') {
        outcome = `${gameStatus.players[gameStatus.turnIndex].player_name} makes a new Rule!`;
        
        // TODO:
        // Request rule from this player
        // Update rules list
        }

        //**** ACE = WATERFALL ***//
        else if(denomination === 'A') {
        outcome = `${gameStatus.players[gameStatus.turnIndex].player_name} starts a Waterfall!`;
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
        outcome = `7 is Heaven! Point to the sky!`;
        }

        //**** 8 = DATE ***//
        else if(parseInt(denomination) === 8) {
        outcome = `8 is Date! ${gameStatus.players[gameStatus.turnIndex].player_name} picks a date!`;

        // TODO:
        // Request date from this player
        // Update dates in 
        }

        //**** 9 = RHYME ***//
        else if(parseInt(denomination) === 9) {
        outcome = `9 is Rhyme Time! ${gameStatus.players[gameStatus.turnIndex].player_name} picks a word to rhyme!`;
        }

        //**** 10 = CATEGORIES ***//
        else if(parseInt(denomination) === 10) {
        outcome = `10 is Categories! ${gameStatus.players[gameStatus.turnIndex].player_name} picks a category!`;
        }
    }

    gameStatus.lastPulledCardOutcome = outcome;

    console.log('[gamelogic] Updating gameStatus to ', gameStatus);
    return gameStatus;
}

module.exports = {
    determineOutcome
}