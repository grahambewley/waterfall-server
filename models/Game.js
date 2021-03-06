const mongoose = require('mongoose');
const randomString = require('randomstring');
const { String, Number, Boolean } = mongoose.Schema.Types;

const GameSchema = new mongoose.Schema({
    shortId: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    mode: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
        select: false
    },
    turnIndex: {
        type: Number,
        required: true,
        default: 0
    },
    players: [
        {
            player_name: {
                type: String
            },
            player_isAdmin: {
                type: Boolean,
                default: false
            },
            player_isOffline: {
                type: Boolean,
                default: false
            },
            player_id: {
                type: String,
                default: randomString.generate(7)
            },
            player_isTmaster: {
                type: Boolean,
                default: false
            },
            player_isQmaster: {
                type: Boolean,
                default: false
            }
        }
    ],
    rules: [{
        type: String
    }],
    unplayedCards: [{
        type: String
    }],
    lastPulledCard: {
        type: String,
        default: ''
    },
    lastPulledCardOutcome: {
        type: String,
        default: ''
    },
    lastPulledCardInstruction: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

GameSchema.pre('save', function(next) {
    if(this.unplayedCards.length === 0) {
        this.unplayedCards.push(
            '2H', '2D', '2C', '2S',
            '3H', '3D', '3C', '3S',
            '4H', '4D', '4C', '4S',
            '5H', '5D', '5C', '5S',
            '6H', '6D', '6C', '6S',
            '7H', '7D', '7C', '7S',
            '8H', '8D', '8C', '8S',
            '9H', '9D', '9C', '9S',
            '10H', '10D', '10C', '10S',
            'JH', 'JD', 'JC', 'JS',
            'QH', 'QD', 'QC', 'QS',
            'KH', 'KD', 'KC', 'KS',
            'AH', 'AD', 'AC', 'AS'
        );
        next();
    }
})

const Game = mongoose.model("Game", GameSchema);
module.exports = Game;