const mongoose = require("mongoose");
const db = require('../../tests/db');
const _ = require('lodash');
const { Types } = mongoose;

require('../Move');
require('../Fighter');
require('../FightFloor');
require('../Fight');
require('../Arena');
require('../Turn');

const Fighter = mongoose.model('Fighter');
const Move = mongoose.model('Move');
const FightFloor = mongoose.model('FightFloor');
const Fight = mongoose.model('Fight');
const Arena = mongoose.model('Arena');
const Turn = mongoose.model('Turn');
const ObjectId = Types.ObjectId

const {
    FightSystem,
    FightStatusTypes
} = require('../Fight');
const { CombatCategoryTypes, LimbTypes } = require("../Fighter");
const { randomFighter, defaultArena, movesList, ThreeByThreeFightFloor } = require("./fixtures");
const { MarkerTypes } = require("../FightFloor");
const { RangeDamageTypes, MoveList } = require("../Move");
const FighterService = require("../../services/fighter");


let fightFloor;
let fighter;
let fight;

describe('FightFloor Model', () => {
    beforeAll(async () => {
        await db.connect();
    });
    afterAll(async () => await db.closeDatabase())
    afterEach(async () => {
        await db.clearDatabase();
        jest.restoreAllMocks();
    });
    beforeEach(async () => {
        await Move.insertMany(movesList);
        // console.log("Arena - Test ", await Arena.findById(arena._id));
        // console.log("FightFloor - Test ", await FightFloor.find());
        // console.log("Fight - Test ", await Fight.find());
        // console.log("Fighter - Test ", await Fighter.find());
        // console.log("Move - Test ", await Move.find());

        // const collections = ['Arena', 'FightFloor', 'Fight', 'Fighter', 'Move'];

        // for (const collection of collections) {
        //     console.log(`${collection} - Test`, await mongoose.model(collection).find());
        // }
    });

    // test('addTurns creates an array of turns where each fighter goes once ', async () => {
    //     // Mock Math.random to return specific values
    //     const mockRandom = jest.spyOn(Math, 'random')
    //         .mockReturnValueOnce(0.1) // First fighter
    //         .mockReturnValueOnce(0.4) // First fighter
    //         .mockReturnValueOnce(0.6) // Second fighter
    //         .mockReturnValueOnce(0.8); // Second fighter

    //     // Define your fighters and turns
    //     const turns = 4;

    //     // Call the function under test
    //     let testFight = await new Fight(fight);
    //     testFight.addTurns(fighters, turns);

    //     // Assert that the result matches the expected order
    //     expect(testFight[0].attacker._id).toEqual(fighters[0]._id);
    //     expect(testFight[1].attacker._id).toEqual(fighters[0]._id);
    //     expect(testFight[2].attacker._id).toEqual(fighters[1]._id);
    //     expect(testFight[3].attacker._id).toEqual(fighters[1]._id);

    //     // Restore the original Math.random function
    //     mockRandom.mockRestore();
    // });

    test('FightSystem.MoveFighter moves the fighter to the correct place', async () => {
        let fightFloor = await FightFloor.create(ThreeByThreeFightFloor());
        let fighter1 = await Fighter.create(randomFighter("fighter1"));
        let fighter2 = await Fighter.create(randomFighter("fighter2"));
        let arena = await Arena.create(defaultArena(fightFloor._id));

        await fighter1.populate('combatSkills.moveStatistics.move');
        await arena.populate('fightFloor');
        await arena.fightFloor.addFighters([fighter1, fighter2]);

        jest.spyOn(arena.fightFloor, "getFighterCords").mockReturnValue({cords: {x: 0, y: 0}});
        jest.spyOn(arena.fightFloor, "getNeighboringCells").mockReturnValue([{x: 0, y: 1}]);
        jest.spyOn(fighter1, "autoSelectCell").mockReturnValue({x: 0, y: 1});       
        
        FightSystem.moveFighter(fighter1, arena.fightFloor);

        expect(arena.fightFloor.getFighterCords).toHaveBeenCalledWith(fighter1._id.toString());
        expect(arena.fightFloor.getNeighboringCells).toHaveBeenCalledWith(0,0);
        expect(fighter1.autoSelectCell).toHaveBeenCalledWith([{x: 0, y: 1}]);

        expect(arena.fightFloor.grid[1][0].markers.find(marker => marker.value === fighter1._id))
    });

    test.skip('addTurns returns the expected array structure of rounds and turns per round', async () => {
        let fightFloor = await FightFloor.create(ThreeByThreeFightFloor());
        let fighter1 = await Fighter.create(randomFighter("fighter1"));
        let fighter2 = await Fighter.create(randomFighter("fighter2"));
        let arena = await Arena.create(defaultArena(fightFloor._id));
        fight = await Fight.create({
            fighters: [fighter1, fighter2],
            arena: arena._id,
            winner: null,
            loser: null,
            fightReplay: [],
            combatCategory: CombatCategoryTypes.Unarmed,
            _id: new mongoose.Types.ObjectId(),
        });

        await fight.addTurns();

        const turns = await Turn.find({ _id: { $in: fight.turns.flat() } })
        const countObject = {};
        for (const turn of turns) {
            if (countObject[turn.attacker]) {
                countObject[turn.attacker] += 1;
            } else {
                countObject[turn.attacker] = 1;
            }
        }

        console.log({ countObject })

        expect(fight.turns.length).toEqual(30);

        fight.rounds = 4;
        fight.turns = []
        await fight.addTurns();

        expect(fight.turns.length).toEqual(40);
    });

    test('Resolve Combat updates the turn values when attacking opponent and defense is not null ', async () => {
        let fightFloor = await FightFloor.create(ThreeByThreeFightFloor());
        let fighter1 = await Fighter.create(randomFighter("fighter1"));
        let fighter2 = await Fighter.create(randomFighter("fighter2"));
        let arena = await Arena.create(defaultArena(fightFloor._id));

        await fighter1.populate('combatSkills.moveStatistics.move');
        await fighter2.populate('combatSkills.moveStatistics.move');
        await arena.populate('fightFloor');
        await arena.fightFloor.addFighters([fighter1, fighter2]);

        let turn = new Turn();

        const currentCell = {
            cords: {
                x: 1,
                y: 1,
            }
        };

        const attack = {
            combatSkill: fighter1.combatSkills[0],
            strikingWith: fighter1.combatSkills[0].moveStatistics.move.strikingLimb[0],
            target: fighter1.combatSkills[0].moveStatistics.move.targets[0],
            damage: fighter1.combatSkills[0].moveStatistics.move.baseMoveDamage,
            pattern: {
                rangeDamage: RangeDamageTypes.Normal,
                x: 1,
                y: 0,
            }
        }

        const defense = {
            combatSkill: fighter2.combatSkills[2],
            strikingWith: fighter2.combatSkills[2].moveStatistics.move.strikingLimb[0],
            target: fighter2.combatSkills[2].moveStatistics.move.targets[0],
            pattern: {
                rangeDamage: RangeDamageTypes.Normal,
                x: 0,
                y: 0,
            }
        }

        turn.attacker = fighter1;

        jest.spyOn(fighter1, 'movesInRangeOfAnotherFighter').mockResolvedValue(
            [
                {
                    combatSkill: fighter1.combatSkills[0],  // Mocked combatSkill object
                    cords: { x: 2, y: 1 },
                    rangeDamage: RangeDamageTypes.Normal,                        // Example rangeDamage
                    opponentId: fighter2._id,                // Mocked opponent ID
                },
            ]
        );
        
        jest.spyOn(FightSystem, "getOpponent").mockReturnValue(fighter2);
        jest.spyOn(FightSystem, "buildAttack").mockReturnValue(attack);
        jest.spyOn(FightSystem, "buildDefense").mockReturnValue(defense);

        await FightSystem.resolveCombat(turn, currentCell, arena, [fighter1, fighter2]);

        // Assert that mocked methods were called with expected arguments
        expect(FightSystem.getOpponent).toHaveBeenCalledWith([fighter1, fighter2], fighter2._id);
        expect(FightSystem.buildAttack).toHaveBeenCalled();
        expect(FightSystem.buildDefense).toHaveBeenCalledWith(fighter2);

        
        // Assert that the turn object was updated correctly
        expect(turn.target).toEqual(fighter2);
        expect(turn.attack).toEqual(attack);
        expect(turn.defense).toEqual(defense);

    });

    test('buildDefense returns a proper defence object for a turn', async () => {
        let fightFloor = await FightFloor.create(ThreeByThreeFightFloor());
        let fighter1 = await Fighter.create(randomFighter("fighter1"));
        let fighter2 = await Fighter.create(randomFighter("fighter2"));
        let arena = await Arena.create(defaultArena(fightFloor._id));

        await fighter1.populate('combatSkills.moveStatistics.move');

        mockRandom = jest.spyOn(Math, "random")
            .mockReturnValue(0)
            .mockReturnValue(0)
            .mockReturnValue(0)
            .mockReturnValue(0);

        const defence = await FightSystem.buildDefense(
            fighter1
        );

        const expected = { // on can be a defense move so 2 is one of the ones that work
            combatSkill: fighter1.combatSkills[2],
            strikingWith: fighter1.combatSkills[2].moveStatistics.move.strikingLimb[0],
            target: fighter1.combatSkills[2].moveStatistics.move.targets[0],
            pattern: [{
                rangeDamage: RangeDamageTypes.Normal,
                x: 0,
                y: 0,
            }],// just so happens to be a block
        };

        expect(defence.combatSkill).toEqual(expected.combatSkill);
        expect(defence.strikingWith).toEqual(expected.strikingWith);
        expect(defence.target).toEqual(expected.target);
        expect(defence.pattern[0].rangeDamage).toEqual(RangeDamageTypes.Normal);
        expect(defence.pattern[0].x).toEqual(0);
        expect(defence.pattern[0].y).toEqual(0);
    });

    test('buildAttack returns a proper attack object for a turn', async () => {
        let fightFloor = await FightFloor.create(ThreeByThreeFightFloor());
        let fighter1 = await Fighter.create(randomFighter("fighter1"));
        let fighter2 = await Fighter.create(randomFighter("fighter2"));
        let arena = await Arena.create(defaultArena(fightFloor._id));

        await fighter1.populate('combatSkills.moveStatistics.move');

        mockRandom = jest.spyOn(Math, "random")
            .mockReturnValue(0)
            .mockReturnValue(0);

        let selectedCombatSkill = fighter1.combatSkills[0];
        const rangeDamage = { rangeDamage: RangeDamageTypes.Normal, x: 1, y: 0 }
        const opponentId = fighter2.id;

        const attack = FightSystem.buildAttack({
            selectedCombatSkill,
            cords: { x: 0, y: 1 },
            rangeDamage: RangeDamageTypes.Normal,
            opponentId
        });

        const expected = {
            combatSkill: selectedCombatSkill,
            strikingWith: selectedCombatSkill.moveStatistics.move.strikingLimb[0],
            target: selectedCombatSkill.moveStatistics.move.targets[0],
            damage: selectedCombatSkill.moveStatistics.move.baseMoveDamage,
            pattern: {
                rangeDamage: RangeDamageTypes.Normal,
                x: 0,
                y: 1,
            },
        };

        expect(attack).toEqual(expected);
    });

    test('getOpponent returns the desired opponent ', async () => {
        let fightFloor = await FightFloor.create(ThreeByThreeFightFloor());
        let fighter1 = await Fighter.create(randomFighter("fighter1"));
        let fighter2 = await Fighter.create(randomFighter("fighter2"));
        let arena = await Arena.create(defaultArena(fightFloor._id));
        fight = await Fight.create({
            fighters: [fighter1._id, fighter2._id],
            arena: arena._id,
            winner: null,
            loser: null,
            fightReplay: [],
            combatCategory: CombatCategoryTypes.Unarmed,
            _id: new mongoose.Types.ObjectId(),
        });


        const res = await FightSystem.getOpponent([fighter1, fighter2], fighter1._id); // it will be populated by this point 

        expect(res).toEqual(fighter1);
    });

    test('checkScore returns the desired object ', async () => {

        let fightFloor = await FightFloor.create(ThreeByThreeFightFloor());
        let fighter1 = await Fighter.create(randomFighter());
        let fighter2 = await Fighter.create(randomFighter());
        let arena = await Arena.create(defaultArena(fightFloor._id));
        const turns = [
            new Turn({
                attacker: fighter1,
                attack: {
                    target: LimbTypes.LeftArm,
                    damage: 10
                }
            }),
            new Turn({
                attacker: fighter1,
                attack: {
                    target: LimbTypes.LeftArm,
                    damage: 10
                }
            }),
            new Turn({
                attacker: fighter1,
                attack: {
                    target: LimbTypes.RightArm,
                    damage: 15
                }
            }),
            new Turn({
                attacker: fighter2,
                attack: {
                    target: LimbTypes.LeftArm,
                    damage: 20
                }
            }),
            new Turn({
                attacker: fighter2,
                attack: {
                    target: LimbTypes.Head,
                    damage: 20
                }
            })
        ];
        fight = await Fight.create({
            fighters: [fighter1, fighter2],
            arena: arena._id,
            winner: null,
            loser: null,
            fightReplay: [],
            combatCategory: CombatCategoryTypes.Unarmed,
            turns: turns,
            _id: new mongoose.Types.ObjectId(),
        });

        let result = await fight.checkScore();

        console.log(result);
        console.log(fighter1._id)
        console.log(fighter2._id)


        expect(result.get(fighter1._id.toString())).toEqual(2);
        expect(result.get(fighter2._id.toString())).toEqual(5);
    });

    test.only('Run Fight returns a winner and a loser', async () => {
        let fightFloor = await FightFloor.create(ThreeByThreeFightFloor());
        let fighter1 = await Fighter.create(randomFighter("fighter1"));
        let fighter2 = await Fighter.create(randomFighter("fighter2"));
        let arena = await Arena.create(defaultArena(fightFloor._id));
        fight = await Fight.create({
            fighters: [fighter1._id, fighter2._id],
            arena: arena._id,
            maxTurns: 80,
            combatCategory: CombatCategoryTypes.Unarmed,
            _id: new mongoose.Types.ObjectId(),
        });

        await fight.simulate();

        expect(fight.winners.length).toEqual(1);
        expect(fight.losers.length).toEqual(1);
        expect(fight.fightReplay.length).toEqual(fight.turns.length  +1 ); //1 is the starting position
        expect(fight.status).toEqual(FightStatusTypes.COMPLETED);


    }, 10000);

    test('isOver checks to see if winning conditions are met', async () => {
        let fightFloor = await FightFloor.create(ThreeByThreeFightFloor());
        let fighter1 = await Fighter.create(randomFighter("fighter1"));
        let fighter2 = await Fighter.create(randomFighter("fighter2"));
        let arena = await Arena.create(defaultArena(fightFloor._id));

        const fighters = [fighter1._id, fighter2._id]

        fight = await Fight.create({
            fighters: fighters,
            arena: arena._id,
            winner: null,
            loser: null,
            fightReplay: [],
            combatCategory: CombatCategoryTypes.Unarmed,
            _id: new mongoose.Types.ObjectId(),
            winningScore: 5
        });

        fight.scoreboard = {
            [fighters[0]]: 5,
            [fighters[1]]: 3,
        }
        expect(fight.isOver()).toEqual(true)
        fight.scoreboard = {
            [fighters[0]]: 3,
            [fighters[1]]: 3,
        }
        expect(fight.isOver()).toEqual(false);

    });

    test('getWinnersAndLosers returns a list of winners and losers depending on the scoreboard', async () => {
        let fighter1 = await Fighter.create(randomFighter("fighter1"));
        let fighter2 = await Fighter.create(randomFighter("fighter2"));
        let fighter3 = await Fighter.create(randomFighter("fighter3"));
        let fighter4 = await Fighter.create(randomFighter("fighter4"));


        let scoreboard = [
            {fighter: fighter1._id, score: 2},
            {fighter: fighter2._id, score: 2},
            {fighter: fighter3._id, score: 2},
            {fighter: fighter4._id, score: 2},
        ];
        
        let res = FightSystem.getWinnersAndLosers (scoreboard);
        
        expect(res.winners).toEqual([fighter1._id, fighter2._id, fighter3._id, fighter4._id]);
        expect(res.losers).toEqual([]);
        
        scoreboard = [
            {fighter: fighter1._id, score: 4},
            {fighter: fighter2._id, score: 2},
            {fighter: fighter3._id, score: 2},
            {fighter: fighter4._id, score: 2},
        ];

        res = FightSystem.getWinnersAndLosers (scoreboard);
        
        expect(res.winners).toEqual([fighter1._id]);
        expect(res.losers).toEqual([fighter2._id, fighter3._id, fighter4._id]);
        
        scoreboard = [
                {fighter: fighter1._id, score: 4},
                {fighter: fighter2._id, score: 4},
                {fighter: fighter3._id, score: 2},
                {fighter: fighter4._id, score: 2},
        ];

        res = FightSystem.getWinnersAndLosers (scoreboard);

        expect(res.winners).toEqual([fighter1._id, fighter2._id]);
        expect(res.losers).toEqual([fighter3._id, fighter4._id]);
        
        scoreboard = [
                {fighter: fighter1._id, score: 5},
                {fighter: fighter2._id, score: 4},
                {fighter: fighter3._id, score: 2},
                {fighter: fighter4._id, score: 2},
        ];

        res = FightSystem.getWinnersAndLosers (scoreboard);

        expect(res.winners).toEqual([fighter1._id]);
        expect(res.losers).toEqual([fighter2._id, fighter3._id, fighter4._id]);
        
    });

    test.skip('cleanUpTurns clears unused turns ', async () => {
        let fightFloor = await FightFloor.create(ThreeByThreeFightFloor());
        let fighter1 = await Fighter.create(randomFighter("fighter1"));
        let fighter2 = await Fighter.create(randomFighter("fighter2"));
        let arena = await Arena.create(defaultArena(fightFloor._id));
        fight = await Fight.create({
            fighters: [fighter1, fighter2],
            arena: arena._id,
            winner: null,
            loser: null,
            fightReplay: [],
            combatCategory: CombatCategoryTypes.Unarmed,
            _id: new mongoose.Types.ObjectId(),
        });

        await fight.addTurns();

        expect(fight.turns.length).toEqual(30);

        FightSystem.cleanupTurns(fight.turns, 10);

        expect(fight.turns.length).toEqual(11)

    });

    test.skip('cleanUpTurns clears nothing since we got to the end  ', async () => {
        let fightFloor = await FightFloor.create(ThreeByThreeFightFloor());
        let fighter1 = await Fighter.create(randomFighter("fighter1"));
        let fighter2 = await Fighter.create(randomFighter("fighter2"));
        let arena = await Arena.create(defaultArena(fightFloor._id));
        fight = await Fight.create({
            fighters: [fighter1, fighter2],
            arena: arena._id,
            winner: null,
            loser: null,
            fightReplay: [],
            combatCategory: CombatCategoryTypes.Unarmed,
            _id: new mongoose.Types.ObjectId(),
        });

        await fight.addTurns();

        const occurrences = new Map();

        fight.turns.forEach((turn)=>{
            occurrences.set(
                turn.attacker._id,
                occurrences.has(turn.attacker._id) ? occurrences.get(turn.attacker._id) + 1 : 1
            );
        });

        expect(occurrences.get(fighter1._id)).toBeGreaterThanOrEqual(30);
        expect(occurrences.get(fighter2._id)).toBeGreaterThanOrEqual(30);
    });

    test('calculateExpectedScore returns an average according to the algo', async ( )=>{
        let fightFloor = await FightFloor.create(ThreeByThreeFightFloor());
        let fighter1 = await Fighter.create(randomFighter("fighter1"));
        let fighter2 = await Fighter.create(randomFighter("fighter2"));
        let arena = await Arena.create(defaultArena(fightFloor._id));
        fight = await Fight.create({
            fighters: [fighter1._id, fighter2._id],
            arena: arena._id,
            winner: null,
            loser: null,
            fightReplay: [],
            combatCategory: CombatCategoryTypes.Unarmed,
            _id: new mongoose.Types.ObjectId(),
        });
        
        let result = fight.calculateExpectedScore(30);
        expect(result).toEqual(226)
        
        result = fight.calculateExpectedScore(60);
        expect(result).toEqual(326)
        
        result = fight.calculateExpectedScore(90);
        expect(result).toEqual(426)
    });
});
