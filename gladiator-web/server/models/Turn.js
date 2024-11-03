const mongoose = require('mongoose');
const { Schema } = mongoose;

const { LimbTypes, CombatCategoryTypes } = require('./Fighter');
const { RangeDamageTypes } = require('./Move');
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
                enum: Object.values(RangeDamageTypes),
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
                enum: Object.values(RangeDamageTypes),
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
            y: { type: Number, default: 0 },
        }
    },
    results: {
        story: [{
            type: String,
            default: ""
        }],
        joinedStory: {
            type: String,
            default: ""
        }
    },
});
TurnSchema.methods.setup = async function () {

};

TurnSchema.methods.calculateHype = async function () {

};

TurnSchema.methods.run = async function () {
    await this.populate();

    //BALANCE POINT. If attacks barely do anything always then this needs be rebalanced 
    //This could be a stat inside of durability

    //No Moves found Nothing Scenario 
    if (this.attack.combatSkill.category != CombatCategoryTypes.Nothing) {
        //Defense was set 
        if (this.defense.combatSkill != null) {
            await this.target.damageAbsorption(this.attack, this.defense);
        }
        //this needs to add the exp and leveling process as well as 
        await this.target.applyDamage(this.attack.damage, this.attack.target);
    }

    this.buildStory();
    await this.save();
};

TurnSchema.methods.stringifyStory = function () {
    return this.results.story.join("");
};

TurnSchema.methods.buildStory = async function () {
    //Coordinate Change
    this.results.story.push(`${this.attacker.name} moves to (${this.moveTo.cords.x}, ${this.moveTo.cords.y})\n`);
    
    //Moves found Nothing Scenario 
    if (this.attack.combatSkill.category != CombatCategoryTypes.Nothing) {
        this.results.story.push(`${this.attacker.name} threw a ${this.attack.combatSkill.moveStatistics.move.name} at ${this.target.name}'s ${this.attack.target}\n`);
        //Defense was set 
        if (this.defense.combatSkill != null) {
            this.results.story.push(`But ${this.target.name} ${this.defense.combatSkill.moveStatistics.move.name} the attack with their ${this.defense.strikingWith.replace(/([A-Z])/g, ' $1').trim()}\n`); // would be cool to past tense this 
        }
        //No Defense
        else {
            this.results.story.push(`${this.target.name} does nothing\n`);
        }
    }
    //No Moves found Nothing Scenario 
    else {
        this.results.story.push(`${this.attacker.name} did nothing\n`);
    }
    
    if (this.target != null) {
        // this.results.story.push(`Total Damage to ${this.target.name}'s ${this.defense.strikingWith.replace(/([A-Z])/g, ' $1').trim()} :  ${this.attack.damage}\n`);
        this.results.story.push(`${this.target.name} recieved  ${this.attack.damage} damage to their ${this.defense.strikingWith.replace(/([A-Z])/g, ' $1').trim()}\n`);
    }

    this.results.joinedStory = this.stringifyStory();
};

module.exports = mongoose.model('Turn', TurnSchema);
