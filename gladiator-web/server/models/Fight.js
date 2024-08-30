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
const { CombatCategoryTypes, AttributeTypes, LimbTypes, LimbPointsMap } = require('./Fighter');
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
    rounds: {
        type: Number,
        default: 3
    },
    turnsPerRound: {
        type: Number,
        default: 10
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


function weightedRandomSelect(weightMap) {
    // Get all fighters and their weights
    const fighters = Array.from(weightMap.keys());
    const weights = Array.from(weightMap.values());

    // Calculate the total weight
    const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);

    // Generate a random number between 1 and totalWeight (inclusive)
    const randomNum = Math.floor(Math.random() * totalWeight) + 1;

    // Select a fighter based on the random number
    let accumulatedWeight = 0;
    for (let i = 0; i < fighters.length; i++) {
        accumulatedWeight += weights[i];
        if (randomNum <= accumulatedWeight) {
            return fighters[i];
        }
    }
}

FightSchema.methods.addTurns = async function () {
    const sequentialMod = 5
    let sequencialMap = new Map();

    for (let turnIndex = 0; turnIndex < (this.turnsPerRound * this.rounds); turnIndex++) {

        let weightMap = new Map();

        for (const fighter of this.fighters) {
            const speedAttribute = fighter.attributes.attributesList.find(
                attribute => attribute.name === AttributeTypes.Speed
            );
            let speedValue = speedAttribute.value;

            if (sequencialMap.has(fighter._id)) {
                speedValue -= sequencialMap.get(fighter._id) * sequentialMod;
                if (speedValue < 0) speedValue = 0;
            }

            weightMap.set(fighter, speedValue);
        }

        const selectedFighter = weightedRandomSelect(weightMap);
        this.turns.push(await new Turn({ turn: turnIndex, attacker: selectedFighter, target: null }));

        if (sequencialMap.has(selectedFighter._id)) {
            sequencialMap.set(selectedFighter._id, sequencialMap.get(selectedFighter._id) + 1);
        }
        else {
            sequencialMap.clear();
            sequencialMap.set(selectedFighter._id, 1);
        }
    }

    await this.save();
}

FightSchema.methods.simulate = async function () {
    // let arena = await Arena.findById(this.arena);
    await this.populate(`fighters`);

    // let fightFloor = await FightFloor.find();
    await this.populate({
        path: 'arena',
        model: 'Arena',
        populate: {
            path: 'fightFloor',
            model: 'FightFloor'
        }
    });

    // fightFloor.addFighters(fighters);
    this.fightReplay.push(this.arena.fightFloor);

    if (!this.arena) {
        throw new Error('Arena not found');
    }

    await this.addTurns();
    console.log("Turns Added")
    
    await this.arena.fightFloor.addFighters(this.fighters);
    console.log("Fighters Added to floor")

    let fightLog = [];

    this.turns.forEach(async (turn, index) => {
        await turn.populate(`attacker`);

        const attacker = turn.attacker;

        await attacker.inFightRecovery();

        const attackerPosition = this.arena.fightFloor.getFighterCords(attacker._id.toString()).cords;
        const possibleCellsToMoveTo = this.arena.fightFloor.getNeighboringCells(attackerPosition.x, attackerPosition.y);
        const selectedCell = attacker.autoSelectCell(possibleCellsToMoveTo);

        turn.moveTo.cords = selectedCell.cords;
        
        await this.arena.fightFloor.move(attacker, selectedCell.cords);
        console.log(this.fightReplay.length);

        this.fightReplay.push(this.arena.fightFloor);

        const moveOptions = await attacker.movesInRangeOfAnotherFighter(selectedCell.cords, this.arena.fightFloor.grid);

        console.log({moveOptions})

        //We found a fighter the attacker can hit after they moved 
        if (moveOptions.length > 0) {

            //build attack.
            const selectedMoveOption = getRandomElementFromArray(moveOptions);
            const { combatSkill, cords, rangeDamage, opponentId } = selectedMoveOption;
            const selectedStrikingLimb = getRandomElementFromArray(combatSkill.moveStatistics.move.strikingLimb);
            const selectedTargetLimb = getRandomElementFromArray(combatSkill.moveStatistics.move.targets);

            turn.attack = {
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
            const opponent = this.fighters.find((fighter) => fighter._id.toString() === opponentId);

            // Update opponent values
            const { combatSkill: targetCombatSkill, strikingLimb: targetStrikingLimb, target: targetMovetarget, pattern: targetPattern } = opponent.autoSelectDefensiveCombatSkill();

            turn.target = opponent;
            turn.defense = {
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

        console.log("RunningTurn")
        turn.run();
        console.log("Turn Complete")
        this.checkScore();
        this.currentExcitement += turn.calculateHype();
    });
    await this.save();
};

FightSchema.methods.checkScore = function (round) {
    const highestScore = new Map();
    const scoreboard = new Map();

    this.turns[round - 1].forEach((turn) => {
        if (turn.attack && turn.attacker && turn.attack.target) {
            const attackerId = turn.attacker.toString();
            const limb = turn.attack.target;
            const damage = turn.attack.damage;

            if (!highestScore.has(limb)) {
                highestScore.set(limb, { attackerId, damage });
            }
            else {
                const oldAttackerId = highestScore.get(limb).attackerId;
                const oldDamage = highestScore.get(limb).damage;
                let possibleHighscores = [{ attackerId, damage }, { oldAttackerId, oldDamage }]

                let highScore = possibleHighscores.reduce((max, score) =>
                    score.damage > max.damage ? score : max, possibleHighscores[0]
                );

                highestScore.set(limb, highScore)
            }
        }
    });

    highestScore.forEach((limb, key) => {
        if (!scoreboard.has(limb.attackerId)) {
            scoreboard.set(limb.attackerId, LimbPointsMap[key]);
        } else {
            scoreboard.set(limb.attackerId, scoreboard.get(limb.attackerId) + LimbPointsMap[key]);
        }
    });

    return scoreboard;
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