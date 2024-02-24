const mongoose = require('mongoose');
const { Schema } = mongoose;

const TournamentSchema = new Schema({
    name: {
        type: String,
        default: "",
    },
    fighters: [{
        type: Schema.Types.ObjectId,
        ref: 'Fighters'
    }],

    //this will be growing through the life span as fights finish
    fights: [[{
        type: Schema.Types.ObjectId,
        ref: 'Fight'
    }]],
    arena: {
        type: Schema.Types.ObjectId,
        ref: 'Arena'
    }
});

TournamentSchema.methods.competitorCount = function(){
    return this.fighters.length
};

TournamentSchema.methods.rounds = function(){
    return Math.log2(fighters.length);
};

module.exports = mongoose.model('Tournament', TournamentSchema);