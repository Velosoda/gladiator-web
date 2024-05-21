const mongoose = require('mongoose');
const { LimbTypes } = require('./Fighter');
const { Schema } = mongoose;

const Move = require('../models/Move');

// var verb = require('verb');

const TurnSchema = new Schema({
    turn: {
        type: Number,
        default: 0
    },
    attacker: {
        type: Schema.Types.ObjectId,
        ref: 'Fighter',
    },
    target: {
        type: Schema.Types.ObjectId,
        ref: 'Fighter'
    },
    defense: {
        combatSkill: {
            type: Schema.Types.Mixed,
        },
        pattern: {
            rangeDamage: {
                type: String,
                enum: Object.values(Move.RangeDamageTypes),
            },
            x: {
                type: Number,
                default: 0
            },
            y: {
                type: Number,
                default: 0
            }
        },
        strikingWith: {
            type: String,
            enum: Object.values(LimbTypes)
        },
        target: {
            type: String,
            enum: Object.values(LimbTypes)
        },
    },
    attack: {
        combatSkill: {
            type: Schema.Types.Mixed,
            default: null
        },
        strikingWith: {
            type: String,
            enum: Object.values(LimbTypes),
        },
        target: {
            type: String,
            enum: Object.values(LimbTypes),
        },
        damage: {
            type: Number,
            default: 0 
        },
        pattern: {
            rangeDamage: {
                type: String,
                enum: Object.values(Move.RangeDamageTypes),
            },
            x: {
                type: Number,
                default: 0
            },
            y: {
                type: Number,
                default: 0
            }
        }
    },
    moveTo: {
        cords: {
            x: { type: Number, default: 0 },
            y: { type: Number,  default: 0 },
        }
    },
    results: {
        story:[{
            type: String,
            default: ""
        }],
    },
});
TurnSchema.methods.setup = async function() {

};

TurnSchema.methods.run = async function () {
    await this.populate();
    
    if(this.attack.combatSkill.name === Move.RangeDamageTypes.Nothing){
        this.results.story.push( `${this.attacker.name} did nothing`);
        return;
    }
    this.results.story.push(`${this.attacker.name} moves to (${this.moveTo.cords.x}, ${this.moveTo.cords.y})\n`);
    this.results.story.push( `${this.attacker.name} threw a ${this.attack.combatSkill.moveStatistics.move.name} at ${this.target.name}'s ${this.attack.target}\n`);

    //BALANCE POINT. If attacks barely do anything always then this needs be rebalanced 
    //This could be a stat inside of durability 

    if(this.defense.combatSkill === null){
        this.results.story.push(`${this.target.name} does nothing\n`); // would be cool to past tense this 
    }
    else{
        if (await this.target.damageAbsorption(this.attack, this.defense)) {
            this.results.story.push(`But ${this.target.name} ${this.defense.combatSkill.moveStatistics.move.name} the attack with their ${this.defense.strikingWith.replace(/([A-Z])/g, ' $1').trim()}\n`); // would be cool to past tense this 
        }
    }

    await this.target.applyDamage(this.attack.damage, this.attack.target);

    this.results.story.push(`Total Damage:  ${this.attack.damage}`);

    return await this.save();
};

TurnSchema.methods.stringifyStory = function(){
    return this.results.story.join("");
};

module.exports = mongoose.model('Turn', TurnSchema);