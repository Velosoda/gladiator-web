const mongoose = require('mongoose');
const { Schema } = mongoose;

require('./Move');
require('./Arena');
require('./FightFloor');
require('./Fighter');
require('./Fight');
require('./Turn');

const Arena = mongoose.model('Arena');
const Turn = mongoose.model('Turn');
const Move = mongoose.model('Move');
const Fighter = mongoose.model('Fighter');
const FightFloor = mongoose.model('FightFloor');


const { MarkerTypes } = require('./FightFloor');
const { CombatCategoryTypes, AttributeTypes, LimbTypes } = require('./Fighter');
const { getRandomElementFromArray } = require('./utils');

const FightGradeTypes = {
    A: 'A',
    B: 'B',
    C: 'C',
    D: 'D',
    F: 'F',
    NaN: NaN,
};

const FightSchema = new Schema({
    fighters: [{
        type: Schema.Types.ObjectId,
        ref: 'Fighter'
    }],
    winner: {
        type: Schema.Types.ObjectId,
        ref: 'Fighter'
    },
    loser: {
        type: Schema.Types.ObjectId,
        ref: 'Fighter'
    },
    arena: {
        type: Schema.Types.ObjectId,
        ref: 'Arena'
    },
    fightReplay: [{
        type: Schema.Types.ObjectId,
        ref: 'FightFloor'
    }],
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
    scoreBoard: [{
        fighter: {
            type: Schema.Types.ObjectId,
            ref: 'Fighter'
        },
        score: {
            type: Number,
            default: 0
        }
    }]
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
        const round = await new Turn({ turn: i + 1, attacker: nextFighter, target: null });
        this.turns.push(round);
    }
    await this.save();
};

FightSchema.methods.simulate = async function () {
    // let arena = await Arena.findById(this.arena);
    this.fighters.forEach(async (fighter, index) => {
        await this.populate(`fighters.${index}`);
    });
    // let fightFloor = await FightFloor.find();

    await this.populate({
        path: 'arena',
        model: 'Arena',
        populate: {
            path: 'fightFloor',
            model: 'FightFloor'
        }
    });


    // console.log({ arena, fighters, fightFloor })
    console.log(this)

    // fightFloor.addFighters(fighters);

    this.fightReplay.push(this.arena.fightFloor);

    if (!this.arena) {
        throw new Error('Arena not found');
    }

    await this.addTurns(this.fighters, 10);

    let fightLog = [];
    while (this.isOver() == false)
        for (let round = 0; round < this.turns.length; round++) {
            const activeTurn = this.turns[round];
            const attacker = activeTurn.attacker;

            attacker.inFightRecovery();

            const attackerPosition = this.arena.fightFloor.getFighterCords(attacker._id.toString()).cords;

            const possibleCellsToMoveTo = this.arena.fightFloor.getNeighboringCells(attackerPosition.x, attackerPosition.y);

            const selectedCell = attacker.autoSelectCell(possibleCellsToMoveTo);
            activeTurn.moveTo.cords = selectedCell.cords;

            this.fightReplay.push(this.arena.fightFloor.move(attacker, selectedCell.cords));

            const moveOptions = await attacker.movesInRangeOfAnotherFighter(selectedCell.cords, this.arena.fightFloor.grid);

            //We found a fighter the attacker can hit after they moved 
            if (movesInRange.length > 0) {

                //build attack.
                const selectedMoveOption = getRandomElementFromArray(moveOptions);
                const { combatSkill, cords, rangeDamage, opponentId } = selectedMoveOption;
                const selectedStrikingLimb = getRandomElementFromArray(combatSkill.moveStatistics.move.strikingLimb);
                const selectedTargetLimb = getRandomElementFromArray(combatSkill.moveStatistics.move.targets);

                activeTurn.attack = {
                    combatSkill,
                    strikingWith: selectedStrikingLimb,
                    target: selectedTargetLimb,
                    damage: combatSkill.moveStatistics.move.baseMoveDamage,
                    pattern: {
                        rangeDamage,
                        x: cords.x,
                        y: cords.y
                    }
                };

                //build defense 
                const opponent = fighters.find((fighter) => fighter._id.toString() === opponentId);

                // Update opponent values
                const { combatSkill: targetCombatSkill, strikingLimb: targetStrikingLimb, target: targetMovetarget, pattern: targetPattern } = opponent.autoSelectDefensiveCombatSkill();

                activeTurn.target = opponent;
                activeTurn.defense = {
                    combatSkill: targetCombatSkill,
                    strikingWith: targetStrikingLimb,
                    target: targetMovetarget,
                    pattern: {
                        rangeDamage: targetPattern.rangeDamage,
                        x: targetPattern.x,
                        y: targetPattern.y
                    }
                };
            }
            // go straight to end of turn after movement
            else {
                activeTurn.attack = {
                    combatSkill: { name: Move.RangeDamageTypes.None }
                }
            }

            activeTurn.run();
            this.currentExcitement += activeTurn.calculateHype();
        }
    this.save();
};

FightSchema.methods.checkScore = function () {
    //looks at the health of a fighter and determines if a point was scored
    //returns a map of the fighter scores : { fighter: , score: }

};

FightSchema.methods.isOver = function () {
    for (const fighter in this.scoreboard) {
        const score = this.scoreboard[fighter];
        if (score >= this.winningScore) {
            return true;
        }
    }
    return false;
};

function buildAttack(movePatternMappings) {
    const strike = currentFighter.autoSelectAttack(movePatternMappings.map(item => item.combatSkills)
        .flat());

    currentFightTurn.action.attack = {
        move: strike.combatSkill,
        strikingWith: strike.strikingWith,
        target: strike.target,
        patterns: "sad"
        //We need to choose the pattern that we should be using to hit this guy unless we just loop
    };
}

async function buildDefense() {
    currentFightTurn.action.defense = await opponent.autoSelectDefensiveCombatSkill();
}

module.exports = mongoose.model('Fight', FightSchema);
module.exports = {
    FightGradeTypes
};