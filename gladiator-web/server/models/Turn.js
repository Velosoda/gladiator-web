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

module.exports = mongoose.model('Turn', TurnSchema);
