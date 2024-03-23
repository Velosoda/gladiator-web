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
    Defence: "Defence",
    Archery: "Archery",
    Gunmanship: "Gunmanship",
    EnergyWeaponry: "Energy Weaponry",
    SingleHanded: "Single Handed",
    DualWielding: "Dual Wielding",
    TwoHanded: "Two Handed",
};

const CombatCategoryTypes = {
    Unarmed: 'Unarmed',
    Ranged: 'Ranged',
    Melee: 'Melee',
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
        enum: Object.values(DisciplineTypes),
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

//This needs to return the position to move to 
//Should be moving towards the other fighter
FighterSchema.methods.autoMoveToPosition = function (fightFloor) {
    // console.log(fightFloor.getFighterCords(this._id.toString()).cords);

    let { x, y } = fightFloor.getFighterCords(this._id.toString()).cords;
    let { stepsX: oppXDistance, stepsY: oppYDistance, x: opponentX, y: opponentY, opponentId } = fightFloor.rangeToOpponent(x, y);
    let movementAllowance = fightFloor.sizeExponent; //todo add some attribute that helps heree

    // Calculate the distances between x, y and opponentX, opponentY
    const xDistance = x - opponentX;
    const yDistance = y - opponentY;

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
    const baseRecoveryPoints = 30.0
    const totalRecoverPoints = this.attributes.attributesList.find((attribute) => attribute.name === AttributeTypes.Endurance).value + baseRecoveryPoints;
    const minUsage = Math.floor(totalRecoverPoints / 4);
    const maxUsage = Math.floor(totalRecoverPoints / 2);

    let remainingRecoverPoints = totalRecoverPoints;
    let limbI = LimbTypes.Head;

    while (remainingRecoverPoints > 0) {
        let limbToRecover = this.health.limbs.find((limb) => limb.name === limbI);

        // // Choose the maximum possible value within the range of minUsage and maxUsage
        const randomValue = Math.random();

        // console.log({remainingRecoverPoints, totalRecoverPoints, baseRecoveryPoints, minUsage, maxUsage, randomValue})

        let valueToApply;

        // If randomValue is less than 0.5, choose minUsage, otherwise choose maxUsage
        if (randomValue < 0.5) {
            valueToApply = minUsage;
        } else {
            valueToApply = maxUsage;
        }

        if (remainingRecoverPoints < minUsage) {
            valueToApply = remainingRecoverPoints;
        }

        limbToRecover.regenerativeHealth += valueToApply;
        let leftOver = 0;

        if (limbToRecover.regenerativeHealth > limbToRecover.healthLimit) {
            leftOver = limbToRecover.regenerativeHealth - limbToRecover.healthLimit;
            limbToRecover.regenerativeHealth -= leftOver;
        }

        remainingRecoverPoints -= valueToApply
        remainingRecoverPoints += leftOver;

        limbToRecover = getNextLimb(limbToRecover)

        if (limbToRecover === this.health.limbs.length - 1) {
            limbI = LimbTypes.Head;
        }
    }
    return await this.save();
};


FighterSchema.methods.getAvailableMoves = async function (xMod, yMod) {
    
    let availableMoves = [];

    for (let index = 0; index < this.combatSkills.length; index++) {
        const combatSkill = this.combatSkills[index];
        await this.populate(`combatSkills.${index}.moveStatistics.move`);

        if (await combatSkill.moveStatistics.move.inRange(xMod, yMod) &&
        combatSkill.discipline != DisciplineTypes.Defence) {

            availableMoves.push(combatSkill.moveStatistics.move);
            console.log({availableMoves});
        }
    }
    
    return availableMoves;
}

FighterSchema.methods.autoSelectAttack = async function (availableAttacks) {
    // Generate random number between 0 and totalWeight
    const randomNumber = Math.random();

    // Iterate through availableAttacks to find selected availableAttack
    let cumulativeWeight = 0;
    for (const availableAttack of availableAttacks) {
        cumulativeWeight += availableAttack.moveStatistics.hitRate;
        if (randomNumber <= cumulativeWeight) {
            return availableAttack;
        }
    }
};

FighterSchema.methods.autoSelectDefenseCombatSkill = async function () {
    const defenseCombatSkills = this.combatSkills.filter((cs) =>
        cs.discipline === DisciplineTypes.Defence
    );

    return defenseCombatSkills[Math.floor(Math.random() * defenseCombatSkills.length)];
};


function getNextLimb(currentLimb) {
    const limbs = Object.values(LimbTypes);
    const currentIndex = limbs.indexOf(currentLimb);
    const nextIndex = (currentIndex + 1) % limbs.length;
    return limbs[nextIndex];
}


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
