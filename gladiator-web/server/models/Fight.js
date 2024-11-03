const mongoose = require("mongoose");
const { Schema } = mongoose;

require('./Fighter');
require('./Move');
require('./FightFloor');
require('./Arena');
require('./Turn');

const Fighter = mongoose.model('Fighter');
const Move = mongoose.model('Move');
const FightFloor = mongoose.model('FightFloor');
const Arena = mongoose.model('Arena');
const Turn = mongoose.model('Turn');

const {
    CombatCategoryTypes,
    AttributeTypes,
    LimbPointsMap,
    LimbTypes,
} = require("./Fighter");

const { getRandomElementFromArray } = require("./utils");
const { MarkerTypes } = require("./FightFloor");

const FightGradeTypes = {
    A: "A",
    B: "B",
    C: "C",
    D: "D",
    F: "F",
    NaN: NaN,
};

const FightStatusTypes = {
    DRAFT: "Draft", // Not complete fight can not start, missing fighters, turns, category
    CONFIRMED: "Confirmed", // The fight is confirmed, and both fighters have agreed to it.
    IN_PROGRESS: "In progress", //The fight is currently ongoing.
    COMPLETED: "Completed", //The fight has concluded.
    CANCELED: "Canceled" //The fight was called off before starting.
}

const FightSchema = new Schema({
    fighters: [
        {
            type: Schema.Types.ObjectId,
            ref: "Fighter",
        },
    ],
    winners: [{
        type: Schema.Types.ObjectId,
        ref: "Fighter",
    }],
    losers: [{
        type: Schema.Types.ObjectId,
        ref: "Fighter",
    }],
    arena: {
        type: Schema.Types.ObjectId,
        ref: "Arena",
    },
    fightReplay: [
        {
            type: Schema.Types.ObjectId,
            ref: "FightFloor",
        },
    ],
    combatCategory: {
        type: String,
        enum: Object.values(CombatCategoryTypes),
    },
    fightGrade: {
        type: String,
        enum: Object.values(FightGradeTypes),
        default: FightGradeTypes.NaN,
    },
    winningScore: {
        type: Number,
        default: 5,
    },
    skillDisparity: {
        type: Number,
        default: 0,
    },
    rounds: {
        type: Number,
        default: 3,
    },
    turnsPerRound: {
        type: Number,
        default: 10,
    },
    turns: [
        {
            type: Schema.Types.ObjectId,
            ref: "Turn",
        },
    ],
    maxTurns: {
        type: Number,
        default: 400,
    },
    hype: {
        type: Number,
        default: 0,
    },
    currentExcitement: {
        type: Number,
        default: 0,
    },
    scoreboard: [
        {
            fighter: {
                type: Schema.Types.ObjectId,
                ref: "Fighter",
            },
            score: {
                type: Number,
                default: 0,
            },
        },
    ],
    status: {
        type: String,
        enum: Object.values(FightStatusTypes),
        default: FightStatusTypes.DRAFT
    }
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
};

FightSchema.methods.addTurns = async function (maxTurns = null) {
    const sequentialMod = 5; // this will subtract from the weights to make it so the slower fighter gets a chance to go 
    let sequencialMap = new Map();
    let occurrences = new Map();
    let minTurnsPerFighter = this.turnsPerRound * this.rounds;
    let currentTurn = 1;
    let selectedFighter = null

    this.fighters.forEach((fighter) => {
        occurrences.set(
            fighter._id, 0
        );
    });

    while ([...occurrences.values()].every(value => value >= minTurnsPerFighter) == false && (maxTurns == null || currentTurn <= maxTurns)) {
        let weightMap = new Map();

        for (const fighter of this.fighters) {
            const speedAttribute = fighter.attributes.attributesList.find(
                (attribute) => attribute.name === AttributeTypes.Speed
            );
            let speedValue = speedAttribute.value;

            if (sequencialMap.has(fighter._id)) {
                speedValue -= sequencialMap.get(fighter._id) * sequentialMod;
                if (speedValue < 0) speedValue = 0;
            }

            weightMap.set(fighter, speedValue);
        }

        selectedFighter = weightedRandomSelect(weightMap);
        this.turns.push(
            await new Turn({
                turn: currentTurn,
                attacker: selectedFighter,
                target: null,
            })
        );

        sequencialMap.set(
            selectedFighter._id,
            sequencialMap.has(selectedFighter._id) ? sequencialMap.get(selectedFighter._id) + 1 : (sequencialMap.clear(), 1)
        );
        occurrences.set(
            selectedFighter._id,
            occurrences.get(selectedFighter._id) + 1
        );
        currentTurn++;
    }
    await this.save();
};

class FightSystem {

    static async buildDefense(opponent) {
        const { combatSkill, strikingLimb, target, pattern } = await opponent.autoSelectDefensiveCombatSkill();

        return {
            combatSkill,
            strikingWith: strikingLimb,
            target,
            pattern,
        };
    }

    static buildAttack(selectedMoveOption) {
        const { combatSkill, cords, rangeDamage } = selectedMoveOption;
        const selectedStrikingLimb = getRandomElementFromArray(combatSkill.moveStatistics.move.strikingLimb);
        const selectedTargetLimb = getRandomElementFromArray(combatSkill.moveStatistics.move.targets);

        return {
            combatSkill,
            strikingWith: selectedStrikingLimb,
            target: selectedTargetLimb,
            damage: combatSkill.moveStatistics.move.baseMoveDamage,
            pattern: {
                rangeDamage,
                x: cords.x,
                y: cords.y,
            },
        };
    }

    static async resolveCombat(turn, currentCell, arena, fighters) {
        turn.attacker = currentCell.markers.find((marker) => marker.type === MarkerTypes.Fighter).value;
        await turn.populate("attacker")

        const moveOptions = await turn.attacker.movesInRangeOfAnotherFighter(currentCell.cords, arena.fightFloor.grid);
        if (moveOptions.length > 0) {

            const selectedMoveOption = getRandomElementFromArray(moveOptions);
            turn.target = FightSystem.getFighter(fighters, selectedMoveOption.opponentId);
            await turn.populate("target");

            turn.attack = FightSystem.buildAttack(selectedMoveOption);
            turn.defense = await FightSystem.buildDefense(turn.target);
        }
        else {
            turn.target = null;
            turn.attack.combatSkill = { category: CombatCategoryTypes.Nothing }
            turn.defense = null;
        }
        return turn;
    }

    static getFighter(fighters, fighterId) {
        return fighters.find(fighter => fighter._id.toString() === fighterId.toString());
    }

    static async moveFighter(attacker, fightFloor) {
        const attackerPosition = fightFloor.getFighterCords(attacker._id.toString()).cords;
        const possibleCellsToMoveTo = fightFloor.getNeighboringCells(attackerPosition.x, attackerPosition.y);
        const selectedCell = attacker.autoSelectCell(possibleCellsToMoveTo);

        await fightFloor.move(attacker, selectedCell.cords);
        return selectedCell;
    }

    static endFight(fight) {
        //Determine what the fighters earned in prizes
        //
    }

    static getWinnersAndLosers(scoreboard) {
        let winners = [];
        let losers = [];
        let maxScore = -1;

        //sum the scoreboard
        const scoreMap = scoreboard.reduce((map, entry) => {
            const fighterId = entry.fighter.toString();
            const score = entry.score;
            map.set(fighterId, (map.get(fighterId) || 0) + score);
            return map;
        }, new Map());

        scoreMap.forEach((score) => {
            // console.log(entry);
            maxScore = Math.max(maxScore, score);
        });

        scoreMap.forEach((score, fighter) => {
            if (score === maxScore) {
                winners.push(fighter);
            }
            else {
                losers.push(fighter);
            }
        });

        return { winners, losers };
    }

    static cleanupTurns(turns, lastTurnIndex) {
        if (lastTurnIndex === turns.length - 1) {
            return
        }
        else {
            turns.splice(lastTurnIndex + 1)
        }
    }
};

FightSchema.methods.simulate = async function () {
    // let arena = await Arena.findById(this.arena);
    await this.populate(`fighters`);

    // let fightFloor = await FightFloor.find();
    await this.populate({
        path: "arena",
        model: "Arena",
        populate: {
            path: "fightFloor",
            model: "FightFloor",
        },
    });

    // fightFloor.addFighters(fighters);
    this.fightReplay.push(this.arena.fightFloor);

    if (!this.arena) {
        throw new Error("Arena not found");
    }

    await this.addTurns(this.maxTurns);

    this.winningScore = this.calculateExpectedScore(this.turns.length);

    await this.arena.fightFloor.addFighters(this.fighters);

    console.log("Turns, ", this.turns.length);

    for (let [index, turn] of this.turns.entries()) {
        await turn.populate('attacker');

        //await turn.attacker.inFightRecovery();

        const selectedCell = await FightSystem.moveFighter(turn.attacker, this.arena.fightFloor);
        turn.moveTo.cords = selectedCell.cords

        this.fightReplay.push(this.arena.fightFloor);

        turn = await FightSystem.resolveCombat(turn, selectedCell, this.arena, this.fighters);
        await turn.run();

        const turnScore = this.checkScore(turn);
        const [fighter, score] = turnScore.size ? turnScore.entries().next().value : [turn.attacker._id, 0];
        this.scoreboard.push({ fighter: fighter, score: score });
    }

    //Check score see whos the winner and the loser
    // loop through score board and find out who won

    const { winners, losers } = FightSystem.getWinnersAndLosers(this.scoreboard);
    console.log(winners, losers);

    this.winners = winners;
    this.losers = losers;

    //Hand out rewards to the fighters and everyone involved 
    //Clear the arena of fighters
    //Change Status of the fight To completed
    //Hand out grade
    // FightSystem.endFight(this);
    
    this.status = FightStatusTypes.COMPLETED
    await this.save();
};
/*
    We need to add the scores from here and we need to have some kind of indication that an 8 occured prior to this 
*/
FightSchema.methods.checkScore = function (turn) {
    let highestScore = new Map();
    let scoreboard = new Map();

    if (turn.attack && turn.attacker && turn.attack.target) {
        const attackerId = turn.attacker._id.toString();
        const limb = turn.attack.target;
        const damage = turn.attack.damage;

        if (!highestScore.has(limb)) {
            highestScore.set(limb, { attackerId, damage });
        } else {
            const oldAttackerId = highestScore.get(limb).attackerId;
            const oldDamage = highestScore.get(limb).damage;
            let possibleHighscores = [
                { attackerId, damage },
                { oldAttackerId, oldDamage },
            ];

            let highScore = possibleHighscores.reduce(
                (max, score) => (score.damage > max.damage ? score : max),
                possibleHighscores[0]
            );

            highestScore.set(limb, highScore);
        }

    }

    highestScore.forEach((limb, key) => {
        if (!scoreboard.has(limb)) {
            scoreboard.set(limb.attackerId, LimbPointsMap[key]);
        } else {
            scoreboard.set(
                limb.attackerId,
                scoreboard.get(limb.attackerId) + LimbPointsMap[key]
            );
        }
    });

    // console.log("in check score : " , {scoreboard})
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


//This will calculate the score that exepected for a winner
//It calculates the possible average score per round 
//It also will calculate the possibility of a 0 health occurance on a limb for the first time 
//30 = 148

FightSchema.methods.calculateExpectedScore = function (numTurns) {
    const regularPoints = [2, 3, 5];
    const maxBonusTurns = 6;
    const zeroLimbBonus = 8;
    const knockdownBonus = 13;

    // Calculate the average of regular points
    const averageRegularPoints = regularPoints.reduce((a, b) => a + b) / regularPoints.length;

    // Calculate the average score for a turn with the bonus (8 + regular point)
    const averageBonusTurn = [knockdownBonus + zeroLimbBonus + regularPoints[0], knockdownBonus + zeroLimbBonus + regularPoints[1], knockdownBonus + zeroLimbBonus + regularPoints[2]].reduce((a, b) => a + b) / 3;

    // Calculate how many bonus turns can actually occur (min of 6 or total turns)
    const bonusTurns = Math.min(maxBonusTurns, numTurns);

    // Calculate the remaining regular turns (i.e., turns without the bonus)
    const regularTurns = numTurns - bonusTurns;

    // Total score is the sum of bonus turns and regular turns
    const totalScore = (bonusTurns * averageBonusTurn) + (regularTurns * averageRegularPoints);

    return totalScore;
};

module.exports = mongoose.model("Fight", FightSchema);
module.exports = {
    FightGradeTypes,
    FightStatusTypes,
    FightSystem
};
