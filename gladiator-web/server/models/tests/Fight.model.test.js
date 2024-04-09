const mongoose = require("mongoose");
const db = require('../../tests/db');
const _ = require('lodash');
const { v4: uuidv4 } = require('uuid');

require('../Move');
require('../Fighter');
require('../FightFloor');
require('../Fight');

const Fighter = mongoose.model('Fighter');
const Move = mongoose.model('Move');
const FightFloor = mongoose.model('FightFloor');
const Fight = mongoose.model('Fight');
const { Types } = mongoose;

const { MarkerTypes } = require('../FightFloor');
const { CombatCategoryTypes, DisciplineTypes, LimbTypes, AttributeTypes } = require("../Fighter");
const { RangeDamageTypes } = require("../Move");
const { ThreeByThreeFightFloor, simpleFighter } = require('./utils');
const { FightGradeTypes } = require("../Fight");

let fightFloor;
let fighter;
let fight;

let fighters = [];

describe('FightFloor Model', () => {
    beforeAll(async () => {
        await db.connect();
    });
    afterAll(async () => await db.closeDatabase())
    afterEach(async () => await db.clearDatabase())
    beforeEach(async () => {
        fightFloor = _.cloneDeep(ThreeByThreeFightFloor); // Create a deep copy

        const mockObjectId = uuidv4();
        Types.ObjectId = jest.fn(() => mockObjectId);

        fighter = {
            name: "",
            attributes: {
                availablePoints: 0,
                attributesList: [
                    {
                        name: AttributeTypes.Strength,
                        value: Math.floor(Math.random() * (20 - 0 + 1)) + 0,
                        derivedStatistics: ["stat1", "stat2"],
                        effects: 5,
                    },
                    {
                        name: AttributeTypes.Speed,
                        value: Math.floor(Math.random() * (20 - 0 + 1)) + 0,
                        derivedStatistics: ["stat3", "stat4"],
                        effects: 0,
                    },
                    {
                        name: AttributeTypes.Durability,
                        value: Math.floor(Math.random() * (20 - 0 + 1)) + 0,
                        derivedStatistics: ["stat5", "stat6"],
                        effects: -3,
                    },
                    {
                        name: AttributeTypes.Endurance,
                        value: Math.floor(Math.random() * (20 - 0 + 1)) + 0,
                        derivedStatistics: ["stat7", "stat8"],
                        effects: 2,
                    },
                    {
                        name: AttributeTypes.Accuracy,
                        value: Math.floor(Math.random() * (20 - 0 + 1)) + 0,
                        derivedStatistics: ["stat9", "stat10"],
                        effects: -1,
                    },
                    {
                        name: AttributeTypes.Charm,
                        value: Math.floor(Math.random() * (20 - 0 + 1)) + 0,
                        derivedStatistics: ["stat11", "stat12"],
                        effects: 7,
                    },
                ],
            },
            _id: new Types.ObjectId(),
            combatSkills: [
                {
                    category: CombatCategoryTypes.Unarmed,
                    discipline: DisciplineTypes.Boxing,
                    moveStatistics: {
                        move: {
                            category: CombatCategoryTypes.Unarmed,
                            discipline: DisciplineTypes.Boxing,
                            name: 'Jab',
                            targets: [LimbTypes.Head, LimbTypes.Torso],
                            strikingLimb: [LimbTypes.LeftArm, LimbTypes.RightArm],
                            baseMoveDamage: 5,
                            expPerLand: 2,
                            energyCost: 5,
                            criticalChance: 5,
                            canSevereLimb: false,
                            hypeOnTargetHit: 5,
                            rangePattern: [
                                { rangeDamage: RangeDamageTypes.Normal, x: 1, y: 0 },
                                { rangeDamage: RangeDamageTypes.Normal, x: 0, y: 1 },
                                { rangeDamage: RangeDamageTypes.Normal, x: -1, y: 0 },
                                { rangeDamage: RangeDamageTypes.Normal, x: 0, y: -1 },
                            ]
                        }
                    }
                },
                {
                    category: CombatCategoryTypes.Unarmed,
                    discipline: DisciplineTypes.Defence,
                    moveStatistics: {
                        move: {
                            category: CombatCategoryTypes.Unarmed,
                            discipline: DisciplineTypes.Boxing,
                            name: 'Roll',
                            targets: [LimbTypes.Head, LimbTypes.Torso],
                            strikingLimb: [LimbTypes.LeftArm, LimbTypes.RightArm],
                            baseMoveDamage: 5,
                            expPerLand: 2,
                            energyCost: 5,
                            criticalChance: 5,
                            canSevereLimb: false,
                            hypeOnTargetHit: 5,
                            rangePattern: [
                                { rangeDamage: RangeDamageTypes.Normal, x: 1, y: 0 },
                                { rangeDamage: RangeDamageTypes.Normal, x: 0, y: 1 },
                                { rangeDamage: RangeDamageTypes.Normal, x: -1, y: 0 },
                                { rangeDamage: RangeDamageTypes.Normal, x: 0, y: -1 },
                            ]
                        }
                    }
                }
            ]
        };

        const fighter1 = new Fighter(fighter);
        const fighter2 = new Fighter(fighter);

        fighters = [fighter1, fighter2];

        fightFloor = await new FightFloor(fightFloor).addFighters([fighter1, fighter2]);

        fight = new Fight({
            redCornerFighter: fighter1,
            blueCornerFighter: fighter2,
            winner: null,
            loser: null,
            fightReplay: [],
            combatCategory: CombatCategoryTypes.Unarmed,
            turns: [],
        });


        // fighter = {
        //     name: "",
        //     _id: Types.ObjectId(),
        //     combatSkills: [{
        //         category: CombatCategoryTypes.Unarmed,
        //         discipline: DisciplineTypes.Boxing,
        //         moveStatistics: {
        //             move: 
        //             {
        //                 category: CombatCategoryTypes.Unarmed,
        //                 discipline: DisciplineTypes.Boxing,
        //                 name: 'Jab',
        //                 targets: [LimbTypes.Head, LimbTypes.Torso],
        //                 strikingLimb: [LimbTypes.LeftArm, LimbTypes.RightArm],
        //                 baseMoveDamage: 5,
        //                 expPerLand: 2,
        //                 energyCost: 5,
        //                 criticalChance: 5,
        //                 canSevereLimb: false,
        //                 hypeOnTargetHit: 5,
        //                 rangePattern: [
        //                     { rangeDamage: RangeDamageTypes.Normal, x: 1, y: 0 },
        //                     { rangeDamage: RangeDamageTypes.Normal, x: 0, y: 1 },
        //                     { rangeDamage: RangeDamageTypes.Normal, x: -1, y: 0 },
        //                     { rangeDamage: RangeDamageTypes.Normal, x: 0, y: -1 },
        //                 ]
        //             }
        //         }
        //     }]
        // }
    });

    test('addTurns creates an array of turns where each fighter goes once ', async () => {
        // Mock Math.random to return specific values
        const mockRandom = jest.spyOn(Math, 'random')
            .mockReturnValueOnce(0.1) // First fighter
            .mockReturnValueOnce(0.4) // First fighter
            .mockReturnValueOnce(0.6) // Second fighter
            .mockReturnValueOnce(0.8); // Second fighter

        // Define your fighters and turns
        const turns = 4;

        // Call the function under test
        const result = await new Fight(fight).addTurns(fighters, turns);

        // Assert that the result matches the expected order
        expect(result[0].attacker._id).toEqual(fighters[0]._id);
        expect(result[1].attacker._id).toEqual(fighters[0]._id);
        expect(result[2].attacker._id).toEqual(fighters[1]._id);
        expect(result[3].attacker._id).toEqual(fighters[1]._id);

        // Restore the original Math.random function
        mockRandom.mockRestore();
    });
});
