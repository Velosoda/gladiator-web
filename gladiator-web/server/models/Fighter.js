const mongoose = require('mongoose');
const { Schema } = mongoose;

const Move = require('../models/Move');

const INITIAL_ATTRIBUTE_POINTS = 15;

const LimbTypes = {
    Head: 'Head',
    Torso: 'Torso',
    LeftArm: 'LeftArm',
    RightArm: 'RightArm',
    LeftLeg: 'LeftLeg',
    RightLeg: 'RightLeg',
};


const AttributeTypes = {
    Strength: "Strength",
    Speed: "Speed",
    Durability: "Durability",
    Endurance: "Endurance",
    Accuracy: "Accuracy",
    Charm: "Charm",
};

const DisciplineTypes = {
    Boxing: "Boxing",
    Wrestling: "Wrestling",
    Kicking: "Kicking",
    Dirty: "Dirty",
    Archery: "Archery",
    Gunmanship: "Gunmanship",
    EnergyWeaponry: "Energy Weaponry",
    SingleHanded: "Single Handed",
    DualWielding: "Dual Wielding",
    TwoHanded: "Two Handed",
};

const CombatCategoryTypes = {
    Unarmed: "Unarmed",
    Ranged: "Ranged",
    Melee: "Melee",
};

const LimbSchema = new Schema({
    name: {
        type: String,
        enum: Object.values(LimbTypes), // Enum based on LimbTypes object
    },
    regenerativeHealth: {
        type: Number,
        default: 100 // Default regenerativeHealth value
    },
    healthLimit: {
        type: Number,
        default: 100 // Default healthLimit value
    },
    healthLifetimeLimit: {
        type: Number,
        default: 100 // Default healthLifetimeLimit value
    },
    isSevered: {
        type: Boolean,
        default: false // Default isSevered value
    },
    canBeSevered: {
        type: Boolean,
        default: true // Default canBeSevered value
    },
    pointValue: {
        type: Number,
        default: 2 // Default pointValue value
    }
});

const AttributesSchema = new Schema({
    name: {
        type: String,
        enum: Object.values(AttributeTypes), // Enum based on LimbTypes object
    },
    value: {
        type: Number,
        default: INITIAL_ATTRIBUTE_POINTS // Default value
    },
    derivedStatistics: {
        type: [String], // Array of strings
        default: [] // Default empty array
    },
    effects: {
        type: Number,
        default: 0 // Default effects value
    }
});

const CombatSkillsSchema = new Schema({
    category: {
        type: String,
        enum: Object.values(CombatCategoryTypes), // Enum based on CombatCategoryTypes object
    },
    discipline: {
        type: String,
        enum: Object.values(DisciplineTypes)
    },
    moveStatistics: {
        move: {
            type: Schema.Types.ObjectId,
            ref: 'Move'
        },
        level: {
            type: Number,
            default: 0 // Default level value
        },
        currentExp: {
            type: Number,
            default: 0 // Default currentExp value
        },
        expToNexLevel: {
            type: Number,
            default: 15 // Default expToNexLevel value
        },
        throws: {
            type: Number,
            default: 0 // Default throws value
        },
        hits: {
            type: Number,
            default: 0 // Default hits value
        },
        targetHits: {
            type: Number,
            default: 0 // Default targetHits value
        },
        misses: {
            type: Number,
            default: 0 // Default misses value
        },
        damage: {
            type: Number,
            default: 0 // Default damage value
        },
        hitRate: {
            type: Number,
            default: 0.0 // Default hitRate value
        },
        targetHitRate: {
            type: Number,
            default: 0.0 // Default targetHitRate value
        },
        missRate: {
            type: Number,
            default: 0.0 // Default missRate value
        },
    }
});

const FighterSchema = new Schema(
    {
        name: {
            type: String,
            default: ""
        },
        speed: {
            type: Number,
            default: 0
        },
        popularity: {
            type: Number,
            default: 0
        },
        money: {
            type: Number,
            default: 0
        },
        record: {
            wins: {
                type: Number,
                default: 0
            },
            losses: {
                type: Number,
                default: 0
            },
            noContests: {
                type: Number,
                default: 0
            }
        },
        health: {
            stamina: {
                type: Number,
                default: 100
            },
            isDead: {
                type: Boolean,
                default: false
            },
            limbs: [LimbSchema],
        },
        attributes: {
            availablePoints: {
                type: "Number",
                default: 15
            },
            attributesList: [AttributesSchema]
        },
        combatSkills: [CombatSkillsSchema],
        pastFights: [{
            type: Schema.Types.ObjectId,
            ref: 'Fight'
        }]

    }
);

FighterSchema.methods.hasMovesInRange = async function (distance) {
    const { xMod, yMod } = distance;
    let res = [];

    for (let i = 0; i < this.combatSkills.length; i++) {
        const move = await Move.findById(this.combatSkills[i].moveStatistics.move);
        for (let pattern of move.rangePatterns) {
            if (pattern.x <= xMod && pattern.y <= yMod) {
                res.append(move);
                break;
            }
        }
    }

    return res;
}
//This needs to return the position to move to 
//Should be moving towards the other fighter
FighterSchema.methods.aiSelectCellToMoveTo = async function (fightFloor) {
    let { x, y } = fightFloor.getFighterCords(this).cords;
    let { xModifications: oppXDistance, yModifications: oppYDistance, opponentX, opponentY } = fightFloor.rangeToOpponent(x, y);
    let movementAllowance = fightFloor.sizeExponent; //todo add some attribute that helps heree

    // Calculate the distances between x, y and opponentX, opponentY
    const xDistance = Math.abs(x - opponentX);
    const yDistance = Math.abs(y - opponentY);

    while (movementAllowance > 0) {
        // Choose to move on the x or the y based on which requires fewer moves to reach the opponent
        const chooseDirection = xDistance < yDistance ? 0 : 1;

        // Movement along the X-axis
        if (chooseDirection === 0 && oppXDistance !== 0) {
            const stepX = oppXDistance > 0 ? 1 : -1;
            x += stepX;
            oppXDistance -= stepX;
        }

        // Movement along the Y-axis
        if (chooseDirection === 1 && oppYDistance !== 0) {
            const stepY = oppYDistance > 0 ? 1 : -1;
            y += stepY;
            oppYDistance -= stepY;
        }

        // Exit the loop if either coordinate is equal to the opponent's coordinate
        if (x === opponentX || y === opponentY) {
            break;
        }

        movementAllowance--;
    }

    return { x, y }
};

FighterSchema.methods.inFightRecovery = async function () {
    const baseRecoveryPoints = 30
    const totalRecoverPoints = this.attributes.Endurance + baseRecoveryRate;
    const minUsage = Math.floor(totalRecoverPoints / 4);
    const maxUsage = Math.floor(totalRecoverPoints / 2);

    let remainingRecoverPoints = baseRecoveryPoints;

    while (remainingRecoverPoints > 0) {
        const limbI = 0;
        const limbToRecover = this.health.limbs[limbI];

        // Choose the maximum possible value within the range of minUsage and maxUsage
        const valueToApply = Math.min(maxUsage, remainingRecoverPoints);

        // If the chosen value exceeds minUsage, apply it
        if (valueToApply >= minUsage) {

            limbToRecover.regenerativeHealth += valueToApply
            let leftOver = 0;

            if (limbToRecover.regenerativeHealth > limbToRecover.healthLimit) {
                leftOver = limbToRecover.regenerativeHealth - limbToRecover.healthLimit;
                limbToRecover.regenerativeHealth -= leftOver;
            }

            remainingRecoverPoints -= valueToApply
            remainingRecoverPoints += leftOver;
        } else {
            // If the chosen value is less than minUsage, break the loop
            break;
        }
        limbI++;
        if (limbI === this.health.limbs.length - 1) {
            limbI = 0;
        }
    }
    return this.save();
};



module.exports = mongoose.model('Fighter', FighterSchema);
module.exports = mongoose.model('Attribute', AttributesSchema);
module.exports = mongoose.model('Limb', LimbSchema);
module.exports = mongoose.model('CombatSkills', CombatSkillsSchema);
module.exports = {
    LimbTypes,
    AttributeTypes,
    CombatCategoryTypes,
    DisciplineTypes,
    INITIAL_ATTRIBUTE_POINTS,
};
