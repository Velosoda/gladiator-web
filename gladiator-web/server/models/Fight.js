const mongoose = require('mongoose');
const { Schema } = mongoose;

const Arena = require('../models/Arena');
const Turn = require('../models/Turn');
const Fighter = require('../models/Fighter');
const Move = require('../models/Move');

const { MarkerTypes } = require('./FightFloor');
const { CombatCategoryTypes, AttributeTypes, LimbTypes } = require('./Fighter');


const FightGradeTypes = {
    A: 'A',
    B: 'B',
    C: 'C',
    D: 'D',
    F: 'F',
    NaN: NaN,
};

const FightFrame = new Schema({
    grid: {
        type: String,
    }
});


const FightSchema = new Schema({
    redCornerFighter: {
        type: Schema.Types.ObjectId,
        ref: 'Fighter'
    },
    blueCornerFighter: {
        type: Schema.Types.ObjectId,
        ref: 'Fighter'
    },
    winner: {
        type: Schema.Types.ObjectId,
        ref: 'Fighter'
    },
    loser: {
        type: Schema.Types.ObjectId,
        ref: 'Fighter'
    },
    fightReplay: [FightFrame],
    combatCategory: {
        type: String,
        enum: Object.values(CombatCategoryTypes),
    },
    fightGrade: {
        type: String,
        enum: Object.values(FightGradeTypes),
        default: FightGradeTypes.NaN
    },
    winningScore: {
        type: Number,
        default: 5
    },
    skillDisparity: {
        type: Number,
        default: 0
    },
    turns: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Turn'
        }
    ],
    hype: {
        type: Number,
        default: 0
    },
    currentExcitement: {
        type: Number,
        default: 0
    },
});


FightSchema.methods.addTurns = async function (fighters, turns) {
    const nextTurns = [];
    const totalSpeed = fighters.reduce((sum, fighter) => sum + fighter.attributes.attributesList.find((attr) => attr.name === AttributeTypes.Speed).value, 0);
    for (let i = 0; i < turns; i++) {
        const randomNumber = Math.random() * totalSpeed;
        let currentSpeed = 0;
        let nextFighter = null;
        for (const fighter of fighters) {
            currentSpeed += fighter.attributes.attributesList.find((attr) => attr.name === AttributeTypes.Speed).value;
            if (randomNumber <= currentSpeed) {
                nextFighter = fighter;
                break;
            }
        }
        nextTurns.push({
            turn: i + 1,
            attacker: nextFighter,
            target: null,
            actions: {
                opponentDefence: null,
                moveTo: {
                    x: null,
                    y: null,
                },
                attack: {
                    move: null,
                    strikingWith: null,
                    target: null,
                    damage: null,
                }
            },
            results: []
        });

    }

    return nextTurns;
};

FightSchema.methods.simulate = async function (arenaId) {
    let redCornerFighter;
    let blueCornerFighter;
    let arena;
    let fightFloor;

    //DB Tries
    try {
        // Get Red corner fighter
        redCornerFighter = await this.model('Fighter').findById(this.redCornerFighter);
        //Get Blue corner fighter
        blueCornerFighter = await this.model('Fighter').findById(this.blueCornerFighter);

        //Get Arena and fight floor 
        arena = await Arena.find("Arena").findById(arenaId);
        fightFloor = arena.fightFloor.populate(); // need the real object

        // adds fighters to the fight floor
        fightFloor.addFighters([redCornerFighter, blueCornerFighter]);

        // Ensure redCornerFighter exists
        if (!redCornerFighter) {
            throw new Error('Red corner fighter not found');
        }
        if (!blueCornerFighter) {
            throw new Error('blue Corner Fighter not found');
        }
        if (!arena) {
            throw new Error('blue Corner Fighter not found');
        }
    } catch (error) {
        console.error('Error simulating fight:', error);
        throw error;
    }

    //Determine what the order is going to be for this fight = turns
    //default
    // turn: 0,
    // currentfighter: 
    // targetOpponent: 
    // actions: {
    //     opponentDefence: {
    //         opponentDefenseCombatSkillMove, 
    //         opponentDefenseDirection
    //     },
    //     moveTo: {
    //         cords: {
    //             x: null,
    //             y: null,
    //         }
    //     }
    //     attack: 
    // {
    //     move,
    //     strikingWith,
    //     target,
    //     damage
    // }
    // results: {}

    let fightTurns = addTurns([redCornerFighter, blueCornerFighter], 10);

    // await TurnSchema.insertMany(fightTurns);

    //loop thruogh

    //for every turn the fighter in that turn will do the following based on certain decisions
    let fightLog = [];

    let currentTurn = fightTurns[0];

    for (let turn = 0; turn < fightTurns.length; turn++) {
        let currentFightTurn = fightTurns;
        let currentFighter = fightTurns[turn].currentfighter;

        currentFighter.inFightRecovery();

        currentFightTurn.action.moveTo = currentFighter.autoMoveToPosition(fightFloor);
        fightFloor.move(currentFighter, currentFightTurn.action.moveTo)

        currentFightTurn.results.append(`${currentFighter.name} moves to ${currentFightTurn.action.moveTo}`);

        let { opponentX, opponentY, distance, xMod, yMod, opponentId } =
            fightFloor.rangeToOpponent(currentFightTurn.action.moveTo.x, currentFightTurn.action.moveTo.y);

        let opponent = [redCornerFighter, blueCornerFighter].find(fighter => fighter.id === opponentId);

        currentFightTurn.targetOpponent = opponent;

        //gets all moves in range
        let availableMoves = currentFighter.getAvailableMoves(xMod, yMod)

        if (availableMoves.length > 0) {
            const strike = currentFighter.autoSelectAttack(availableCombatSkills);

            currentFightTurn.action.attack = {
                move: strike.combatSkill,
                strikingWith: strike.strikingWith,
                target: strike.target,
                //We need to choose the pattern that we should be using to hit this guy unless we just loop
            };

            const opponentDefenseCombatSkillMove = await Move.findById(
                opponent.autoSelectDefenseCombatSkill().moveStatistics.move
            );

            const opponentDefenseDirection = opponentDefenseCombatSkillMove.autoSelectPattern();

            currentFightTurn.action.opponentDefence = { opponentDefenseCombatSkillMove, opponentDefenseDirection } //{chosenMove, chosenDirection}

            const damageReport = currentTurn.run();

            currentFightTurn.results.append(
                `
                    ${currentFighter.name} throws a 
                    ${currentFightTurn.action.attack.move.name} with their 
                    ${currentFightTurn.action.attack.strikingWith} to 
                    ${opponent.name}'s ${currentFightTurn.action.attack.target} for
                    ${currentFightTurn.action.attack.damage}
                `
            );

            currentFightTurn.results.append(
                `
                    ${opponent.name} 
                    ${opponentDefenseCombatSkillMove.name} ${currentFighter.name}'s attack causing 
                    ${damageReport.damageTaken} to their ${damageReport.damagedLimb}
                `
            );
        }

        currentFighter.addExp(calculateTurnExp(currentFightTurn));// will check for a level up and do so

        fightLog.append(currentFightTurn);

        this.currentExcitement += calculateHype(currentFightTurn);

        //add more turns 
        if (fightTurns[fightTurns.length - 1].results.length != 0) {
            fightTurns.concat(addTurns([redCornerFighter, blueCornerFighter], 10));
        }

        if (this.isOver() === true) {
            break;
        }
    }

    clearUnusedTurns(fightTurns);

    //New fightlog entry is added
    //if the grid changed that needs to go in the fight log

};

function clearUnusedTurns(fightTurns) {
    // for (const turn of)
};

// fight: {
//     teams:[
//         team: {
//             id
//             fighters: [
//                 fighter
//             ],
//         },
//     ]
// }



module.exports = mongoose.model('Fight', FightSchema);
module.exports = {
    FightGradeTypes
}