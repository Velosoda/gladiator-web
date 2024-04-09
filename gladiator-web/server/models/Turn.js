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
        pattern:
        {
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
            type: Number
        }
    },
    moveTo: {
        cords: {
            x: { type: Number },
            y: { type: Number },
        }
    },
    results: {
        type: String,
        default: ""
    },
});

TurnSchema.methods.run = async function () {
    await this.populate();
    let result = ""
    result = `${this.attacker.name} threw a ${this.attack.combatSkill.moveStatistics.move.name} at ${this.target.name}'s ${this.attack.target} \n`;

    //BALANCE POINT. If attacks barely do anything always then this needs be rebalanced 
    //This could be a stat inside of durability 

    if (await this.target.damageAbsorption(this.attack, this.defense)) {
        result = result.concat(`But ${this.target.name} ${this.defense.combatSkill.moveStatistics.move.name} the attack with their ${this.defense.strikingWith.replace(/([A-Z])/g, ' $1').trim()}\n`); // would be cool to past tense this 
    }

    await this.target.applyDamage(this.attack.damage, this.attack.target);

    result = result.concat(`For ${this.attack.damage} damage`);

    this.results = result.toString();;

    return await this.save();
};

module.exports = mongoose.model('Turn', TurnSchema);