const mongoose = require('mongoose');
const { Schema } = mongoose;

const Move = require('../models/Move');
const { MarkerTypes } = require('./FightFloor');
const { getRandomElementFromArray } = require('./utils');

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

FighterSchema.methods.applyDamage = async function (damage, targetLimb) {

    let limb;

    // Perform the search operation
    this.health.limbs.forEach(element => {
        if (element.name === targetLimb) {
            limb = element;
        }
    });

    if (limb == null) throw new Error(`limb not found: ${targetLimb}`);

    let leftOver = 0

    if (limb.regenerativeHealth < damage) {
        leftOver = Math.abs(limb.regenerativeHealth - damage);
        limb.regenerativeHealth -= damage;
        if (limb.regenerativeHealth < 0) {
            limb.regenerativeHealth = 0;
        }
    } else {
        limb.regenerativeHealth -= damage;
    }

    if (leftOver > 0) {
        limb.healthLimit -= leftOver
        leftOver -= limb.healthLimit - leftOver;
        if (limb.healthLimit < 0) {
            limb.healthLimit = 0;
        }
    }

    await this.save();
};


FighterSchema.methods.damageAbsorption = async function (attack, defense) {
    //Check to see if the move pattern intersects with the defensive Posture pattern
    //basically call inRange

    for (const patterns of attack.combatSkill.moveStatistics.move.rangePattern) {
        for (const pattern of patterns) {
            // console.log(patternsHit(pattern.x,pattern.y,defense.pattern.x,defense.pattern.y));

            if (patternsHit(
                pattern.x,
                pattern.y,
                defense.pattern.x,
                defense.pattern.y)) {
                //Hit Logic
                //if yes check the attacker target and defense target
                //  if the target limb is not the same as the opponents target limb
                //      return damage: +Critical DAMAGE , original target limb
                //  if the target is the same as the opponents target limb
                //      change the target to one of the striking limbs for that move
                //      return damage: 0, opponents target limb

                if (attack.target === defense.target) {
                    attack.target = defense.strikingWith;
                    attack.damage += 0;
                    return true;
                } else {
                    attack.damage += 5; //BALANCEPOINT: We should be calculatign this more interacately 
                    return false;
                }
            }
        }
    }

    //NEVER HITS SO ATTACK MISSES thats what false means here    
    return false;
};

function patternsHit(attackerX, attackerY, defenderX, defenderY) {
    if (defenderX === 0 && defenderY === 0) {
        return true
    }
    else if (attackerX === defenderX && attackerY === defenderY) {
        return true
    } else {
        return false
    }
}

//This needs to return the position to move to 
//Should be moving towards the other fighter
FighterSchema.methods.autoSetupMovement = function (fightFloor) {
    let { x, y } = fightFloor.getFighterCords(this._id.toString()).cords;
    let { stepsX: oppXDistance, stepsY: oppYDistance, x: opponentX, y: opponentY, opponentId } = fightFloor.rangeToNearestFighter(x, y);
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
    console.log("MOVEMENT SET : ", { x, y })
    return { x, y }
};

FighterSchema.methods.autoSelectCell = function (listOfCells) {
    return listOfCells[Math.floor(Math.random() * listOfCells.length)];
}

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
    let movesAndPatterns = [];

    for (let index = 0; index < this.combatSkills.length; index++) {
        await this.populate(`combatSkills.${index}.moveStatistics.move`);
        const combatSkill = this.combatSkills[index];

        console.log({ combatSkill })

        const rangeStats = combatSkill.moveStatistics.move.inRange(xMod, yMod)
        if (rangeStats.inRange && combatSkill.discipline != DisciplineTypes.Defence) {
            const patterns = rangeStats.patterns
            movesAndPatterns.push({ combatSkill, patterns });
        }
    }

    return movesAndPatterns;
}

//This will take the cords, loop through the list of patterns and determine if theres a fighter in any of cords that comeout of the patterns 
//and then return the move and that pattern as a list 
FighterSchema.methods.movesInRangeOfAnotherFighter = async function (fightFloor) {
    const movesAndPatterns = [];
    const attackerCords = fightFloor.getFighterCords(this._id.toString()).cords;

    for (const [index, combatSkill] of this.combatSkills.entries()) {
        // Assuming `populate` is needed here
        await this.populate(`combatSkills.${index}.moveStatistics.move`);

        if (combatSkill.discipline !== DisciplineTypes.Defence) {
            for (const pattern of combatSkill.moveStatistics.move.rangePattern) {
                pattern.forEach(({ x, y, rangeDamage }) => {
                    const targetX = attackerCords.x + x;
                    const targetY = attackerCords.y + y;

                    //Might be able to get the
                    if (targetY >= 0 && targetY < fightFloor.grid.length && targetX >= 0 && targetX < fightFloor.grid[targetY].length) {
                        const cellMarkers = fightFloor.grid[targetY][targetX].markers;
                        const fighterMarker = cellMarkers.find(marker => marker.type === MarkerTypes.Fighter);
                        if (fighterMarker) {
                            movesAndPatterns.push({
                                combatSkill,
                                cords: { x: targetX, y: targetY },
                                rangeDamage,
                                opponentId: fighterMarker.value
                            });
                        }
                    }
                });
            }
        }
    }
    return movesAndPatterns;
};

FighterSchema.methods.autoSelectAttack = async function (availableAttacks) {
    // Generate random number between 0 and totalWeight
    let randomNumber = Math.random();

    let combatSkill, strikingWith, target = null;
    // Iterate through availableAttacks to find selected availableAttack
    let moveWeight = 0;
    for (const availableAttack of availableAttacks) {
        moveWeight += availableAttack.moveStatistics.hitRate;
        if (randomNumber <= moveWeight) {
            combatSkill = availableAttack;
            break;
        }
    }

    randomNumber = Math.random();
    let strikingWithWeight = 0;
    for (const limb of combatSkill.moveStatistics.move.strikingLimb) {
        strikingWithWeight += (1 / combatSkill.moveStatistics.move.strikingLimb.length);
        if (randomNumber <= strikingWithWeight) {
            strikingWith = limb;
            break;
        }
    }

    randomNumber = Math.random();
    let targetWeight = 0;
    for (const limb of combatSkill.moveStatistics.move.targets) {
        targetWeight += (1 / combatSkill.moveStatistics.move.targets.length);
        if (randomNumber <= targetWeight) {
            target = limb;
            break;
        }
    }

    return { combatSkill, strikingWith, target }
};

FighterSchema.methods.autoSelectDefensiveCombatSkill = async function () {
    // Filter combatSkills with discipline 'Defence' and get their indexes
    const defenseIndexes = this.combatSkills
        .map((cs, index) => cs.discipline === DisciplineTypes.Defence ? index : null)
        .filter(index => index !== null);

    // Select a random index from defenseIndexes
    const randomIndex = getRandomElementFromArray(defenseIndexes);

    // Populate the moveStatistics.move field for the selected combatSkill
    await this.populate(`combatSkills.${randomIndex}.moveStatistics.move`);

    // Access the populated move field
    const populatedCombatSkill = this.combatSkills[randomIndex];
    const move = populatedCombatSkill.moveStatistics.move;

    const target = getRandomElementFromArray(move.targets);
    const strikingLimb = getRandomElementFromArray(move.strikingLimb);
    const pattern = getRandomElementFromArray(move.rangePattern);

    return { combatSkill: populatedCombatSkill, target, strikingLimb, pattern };
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
