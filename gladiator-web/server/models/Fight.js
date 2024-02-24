const mongoose = require('mongoose');
const { CombatCategoryTypes } = require('./Fighter');
const { Schema } = mongoose;

const Arena = require('../models/Arena');
const { MarkerTypes } = require('./FightFloor');

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
        type: Schema.Types.ObjectId,
        ref: ''
    }
})

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
    turns: {
        type: Number,
        default: 0
    },
    hype: {
        type: Number,
        default: 0
    },
    currentExcitement: {
        type: Number,
        default: 0
    },
});

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
    // fighter: null
    // actions: {
    //     opponentDefensivePosture: null,
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
    //
    // }
    // results: {}
    let fightTurns = getFighterOrder();

    //loop thruogh

    //for every turn the fighter in that turn will do the following based on certain decisions
    let fightLog = [];
    for (let turn = 0; turn < fightTurns.length; turn++) {
        let currentFightTurn = fightTurns;
        let currentFighter = fightTurns[turn].fighter;

        currentFighter.inFightRecovery();

        currentFightTurn.action.moveTo = currentFighter.aiSelectCellToMoveTo(fightFloor);
        fightFloor.move(fighter, currentFightTurn.action.moveTo)

        currentFightTurn.results.append(`${currentFighter.name} moves to ${currentFightTurn.action.moveTo}`);

        let { opponentX, opponentY, distance, xMod, yMod, opponentId } =
            fightFloor.rangeToOpponent(currentFightTurn.action.moveTo.x, currentFightTurn.action.moveTo.y);

        let opponent = [redCornerFighter, blueCornerFighter].find(fighter => fighter.id === opponentId);

        let availableMoves = fighter.hasMovesRange(xMod, yMod);

        if (availableMoves.length > 0) {
            const strike = currentFighter.selectStrike(availableMoves);

            currentFightTurn.action.attack = {
                move: strike.move,
                strikingWith: strike.strikingWith,
                target: strike.target,
                damage: strike.damage
            };

            currentFightTurn.action.opponentDefensivePosture = getDefensivePosture();

            const damageReport = currentFighter.attack(
                opponent,
                opponentDefensivePosture,
                currentFightTurn.action.attack
            );

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
                    ${opponentDefensivePosture} ${currentFighter.name}'s attack causing 
                    ${damageReport.damageTaken} to their ${damageReport.damagedLimb}
                `
            );
        }
        
        fighter.addExp(calculateTurnExp(currentFightTurn));// will check for a level up and do so

        fightLog.append(currentFightTurn);

        this.currentExcitement += calculateHype(currentFightTurn); 
    }

    //New fightlog entry is added
    //if the grid changed that needs to go in the fight log

}

function rangeToOpponent(grid, startX, startY) {
    const queue = [{ x: startX, y: startY, distance: 0 }];
    const visited = new Set();

    while (queue.length > 0) {
        const { x, y, distance } = queue.shift();
        const cell = grid[x][y];

        // Check if the cell has a marker
        if (cell.marker.type == MarkerTypes.Fighter) {
            return { opponentX, opponentY, distance, xModifications, yModifications, opponentId: cell.marker.value };
        }

        // Enqueue neighboring cells
        for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
            const nx = x + dx;
            const ny = y + dy;
            const key = `${nx},${ny}`;
            if (nx >= 0 && nx < grid.length && ny >= 0 && ny < grid[0].length && !visited.has(key)) {
                visited.add(key);
                queue.push({ x: nx, y: ny, distance: distance + 1 });
                if (dx !== 0) {
                    xMod++;
                }
                if (dy !== 0) {
                    yMod++;
                }
            }
        }
    }

    // If no marker is found
    return null;
}

function runActions(turn) {
    const cords = turn.moveTo;
    const fightFloor = turn.fightFloor;
}


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