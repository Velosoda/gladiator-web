const mongoose = require("mongoose");
const { Types } = mongoose;
const db = require('../../tests/db');
const _ = require('lodash');

require('../Move');
require('../Fight');
require('../Fighter');
require('../FightFloor');
require('../Turn');

const Fighter = mongoose.model('Fighter');
const Move = mongoose.model('Move');
const FightFloor = mongoose.model('FightFloor');
const Turn = mongoose.model('Turn');

const { MarkerTypes } = require('../FightFloor');
const { CombatCategoryTypes, DisciplineTypes, LimbTypes } = require("../Fighter");
const { RangeDamageTypes } = require("../Move");
const { ThreeByThreeFightFloor, simpleFighter } = require('./utils');

describe('Turn Model', () => {
    let fighter;
    let fightFloor;
    let movesList;
    let turn;

    beforeAll(async () => {
        await db.connect();
    });

    afterAll(async () => {
        await db.closeDatabase();
    });

    afterEach(async () => {
        await db.clearDatabase();
        jest.restoreAllMocks();
    })

    beforeEach(() => {
        movesList = [
            {
                _id: "6094bbdc6f22b80f70f7b28a",
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
            },
            {
                _id: "6094bbdc6f22b80f70f7b28b",
                category: CombatCategoryTypes.Unarmed,
                discipline: DisciplineTypes.Defence,
                name: 'Block',
                targets: [LimbTypes.Head, LimbTypes.Torso],
                strikingLimb: [LimbTypes.LeftArm, LimbTypes.RightArm],
                baseMoveDamage: 5,
                expPerLand: 2,
                energyCost: 5,
                criticalChance: 5,
                canSevereLimb: false,
                hypeOnTargetHit: 5,
                rangePattern: [
                    { rangeDamage: RangeDamageTypes.Normal, x: 0, y: 0 },
                ]
            },
            {
                _id: "6094bbdc6f22b80f70f7b28c",
                category: CombatCategoryTypes.Unarmed,
                discipline: DisciplineTypes.Defence,
                name: 'Roll',
                targets: [],
                strikingLimb: [],
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

        ]

        fightFloor = _.cloneDeep(ThreeByThreeFightFloor);

        fighter = {
            _id: new Types.ObjectId(),
            name: "",
            health: {
                limbs: [
                    {
                        name: LimbTypes.Head,
                        regenerativeHealth: 50,
                        healthLimit: 100,
                        healthLifetimeLimit: 150,
                        isSevered: false,
                        canBeSevered: true,
                        pointValue: 2,
                    },
                    {
                        name: LimbTypes.Torso,
                        regenerativeHealth: 50,
                        healthLimit: 100,
                        healthLifetimeLimit: 150,
                        isSevered: false,
                        canBeSevered: true,
                        pointValue: 2,
                    },
                    {
                        name: LimbTypes.RightArm,
                        regenerativeHealth: 50,
                        healthLimit: 100,
                        healthLifetimeLimit: 150,
                        isSevered: false,
                        canBeSevered: true,
                        pointValue: 2,
                    },
                    {
                        name: LimbTypes.LeftArm,
                        regenerativeHealth: 50,
                        healthLimit: 100,
                        healthLifetimeLimit: 150,
                        isSevered: false,
                        canBeSevered: true,
                        pointValue: 2,
                    },
                    {
                        name: LimbTypes.RightLeg,
                        regenerativeHealth: 50,
                        healthLimit: 100,
                        healthLifetimeLimit: 150,
                        isSevered: false,
                        canBeSevered: true,
                        pointValue: 2,
                    },
                    {
                        name: LimbTypes.LeftLeg,
                        regenerativeHealth: 50,
                        healthLimit: 100,
                        healthLifetimeLimit: 150,
                        isSevered: false,
                        canBeSevered: true,
                        pointValue: 2,
                    },
                ]
            },
            attributes: {
                availablePoints: 0,
                attributesList: [
                    {
                        name: "Strength",
                        value: Math.floor(Math.random() * (20 - 0 + 1)) + 0,
                        derivedStatistics: ["stat1", "stat2"],
                        effects: 5,
                    },
                    {
                        name: "Speed",
                        value: Math.floor(Math.random() * (20 - 0 + 1)) + 0,
                        derivedStatistics: ["stat3", "stat4"],
                        effects: 0,
                    },
                    {
                        name: "Durability",
                        value: Math.floor(Math.random() * (20 - 0 + 1)) + 0,
                        derivedStatistics: ["stat6"],
                        effects: -3,
                    },
                    {
                        name: "Endurance",
                        value: 10,
                        derivedStatistics: ["stat7", "stat8"],
                        effects: 2,
                    },
                    {
                        name: "Accuracy",
                        value: Math.floor(Math.random() * (20 - 0 + 1)) + 0,
                        derivedStatistics: ["stat9", "stat10"],
                        effects: -1,
                    },
                    {
                        name: "Charm",
                        value: Math.floor(Math.random() * (20 - 0 + 1)) + 0,
                        derivedStatistics: ["stat11", "stat12"],
                        effects: 7,
                    },
                ],
            },
            combatSkills: [
                {
                    category: CombatCategoryTypes.Unarmed,
                    discipline: DisciplineTypes.Boxing,
                    moveStatistics: {
                        level: 3,
                        currentExp: 50,
                        expToNextLevel: 100,
                        throws: 20,
                        hits: 15,
                        targetHits: 10,
                        misses: 5,
                        damage: 10,
                        hitRate: 0.75,
                        targetHitRate: 0.5,
                        missRate: 0.25,
                        move: "6094bbdc6f22b80f70f7b28a"
                    }
                },
                {
                    category: CombatCategoryTypes.Unarmed,
                    discipline: DisciplineTypes.Defence,
                    moveStatistics: {
                        level: 1,
                        currentExp: 20,
                        expToNextLevel: 50,
                        throws: 10,
                        hits: 5,
                        targetHits: 3,
                        misses: 2,
                        damage: 20,
                        hitRate: 0.5,
                        targetHitRate: 0.3,
                        missRate: 0.2,
                        move: "6094bbdc6f22b80f70f7b28b"

                    }
                },
                {
                    category: CombatCategoryTypes.Unarmed,
                    discipline: DisciplineTypes.Defence,
                    moveStatistics: {
                        level: 1,
                        currentExp: 20,
                        expToNextLevel: 50,
                        throws: 10,
                        hits: 5,
                        targetHits: 3,
                        misses: 2,
                        damage: 100,
                        hitRate: 0.5,
                        targetHitRate: 0.3,
                        missRate: 0.2,
                        move: "6094bbdc6f22b80f70f7b28c"
                    }
                },
            ]
        };

        fighter.name = "Tongy";
        const fighter1 = new Fighter(fighter);

        fighter._id = new Types.ObjectId();
        fighter.name = "Brody";
        const fighter2 = new Fighter(fighter);

        turn = {
            _id: "6094bbdc6f22b80f70f71114",
            turn: 1,
            attacker: fighter1,
            target: fighter2,
            attack: {
                combatSkill: {
                    category: CombatCategoryTypes.Unarmed,
                    discipline: DisciplineTypes.Boxing,
                    moveStatistics: {
                        level: 3,
                        currentExp: 50,
                        expToNextLevel: 100,
                        throws: 20,
                        hits: 15,
                        targetHits: 10,
                        misses: 5,
                        damage: 250,
                        hitRate: 0.75,
                        targetHitRate: 0.5,
                        missRate: 0.25,
                        move: {
                            _id: "6094bbdc6f22b80f70f7b28a",
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
                                [{ rangeDamage: RangeDamageTypes.Normal, x: 1, y: 0 }],
                                [{ rangeDamage: RangeDamageTypes.Normal, x: 0, y: 1 }],
                                [{ rangeDamage: RangeDamageTypes.Normal, x: -1, y: 0 }],
                                [{ rangeDamage: RangeDamageTypes.Normal, x: 0, y: -1 }],
                            ]
                        }
                    }
                },
                strikingWith: LimbTypes.LeftArm,
                target: LimbTypes.Head,
                damage: 5
            },
            defense: {
                combatSkill: {
                    category: CombatCategoryTypes.Unarmed,
                    discipline: DisciplineTypes.Defence,
                    moveStatistics: {
                        level: 3,
                        currentExp: 50,
                        expToNextLevel: 100,
                        throws: 20,
                        hits: 15,
                        targetHits: 10,
                        misses: 5,
                        damage: 10,
                        hitRate: 0.75,
                        targetHitRate: 0.5,
                        missRate: 0.25,
                        move: {
                            _id: "6094bbdc6f22b80f70f7b28a",
                            category: CombatCategoryTypes.Unarmed,
                            discipline: DisciplineTypes.Boxing,
                            name: 'Block',
                            targets: [LimbTypes.Head, LimbTypes.Torso],
                            strikingLimb: [LimbTypes.LeftArm, LimbTypes.RightArm],
                            baseMoveDamage: 5,
                            expPerLand: 2,
                            energyCost: 5,
                            criticalChance: 5,
                            canSevereLimb: false,
                            hypeOnTargetHit: 5,
                            rangePattern: [
                                [{ rangeDamage: RangeDamageTypes.Normal, x: 0, y: 0 }],
                            ]
                        }
                    }
                },
                pattern: { rangeDamage: RangeDamageTypes.Normal, x: 0, y: 0 },
                strikingWith: LimbTypes.LeftArm,
                target: LimbTypes.Head
            },
            moveTo: {
                cords: {
                    x: 1,
                    y: 1,
                }
            },
            results:{
                story:[]
            }
        };
    });

    test('Turn.StringifyStory returns the story as a string', async ()=>{
        testTurn = await new Turn(turn);

        testTurn.results.story = ["test", "is out \n", "new Line"];

        expect(testTurn.stringifyStory()).toEqual("testis out \nnew Line");
    });

    test('Turn.run runs a turn where the defender blocks an attack with a block that changes the target ', async () => {

        testTurn = await new Turn(turn);

        await testTurn.run();

        expect(testTurn.attack.target).toEqual(LimbTypes.LeftArm);
        expect(testTurn.target.health.limbs.find((limb) => limb.name === testTurn.attack.target).regenerativeHealth).toEqual(45);
        expect(testTurn.stringifyStory()).toEqual(
            `Tongy moves to (1, 1)\nTongy threw a Jab at Brody's Head\nBut Brody Block the attack with their Left Arm\nTotal Damage:  5`
        );

    });
    test('Turn.run runs a turn where the defender does not choose the right target for the block', async () => {

        turn.defense.target = LimbTypes.Torso;

        testTurn = await new Turn(turn);

        await testTurn.run();
        
        expect(testTurn.attack.target).toEqual(LimbTypes.Head);
        expect(testTurn.target.health.limbs.find((limb) => limb.name === testTurn.attack.target).regenerativeHealth).toEqual(40);
        expect(testTurn.stringifyStory()).toEqual(
            `Tongy moves to (1, 1)\nTongy threw a Jab at Brody's Head\nTotal Damage:  10`
        );
    });
    test('Turn.run runs a turn where the defender does nothing and gets his shit rocked', async () => {

        turn.defense.combatSkill = null;
        turn.defense.pattern= { rangeDamage: RangeDamageTypes.Normal, x: 0, y: 0 },

        testTurn = await new Turn(turn);

        await testTurn.run();

        expect(testTurn.stringifyStory()).toEqual("Tongy moves to (1, 1)\nTongy threw a Jab at Brody's Head\nBrody does nothing\nTotal Damage:  5")
    });
});