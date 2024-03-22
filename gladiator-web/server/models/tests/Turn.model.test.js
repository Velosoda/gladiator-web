const mongoose = require("mongoose");
const { Types } = mongoose;
const db = require('../../tests/db');
const _ = require('lodash');
const { v4: uuidv4 } = require('uuid');

require('../Move');
require('../Fighter');
require('../FightFloor');

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
            name: "",
            health: {
                limbs: [{
                    name: LimbTypes.Head,
                    regenerativeHealth: 50,
                    healthLimit: 100,
                    healthLifetimeLimit: 150,
                    isSevered: false,
                    canBeSevered: true,
                    pointValue: 2,
                }]
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
                        derivedStatistics: ["stat5", "stat6"],
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
                        damage: 250,
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
                        damage: 120,
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
                        damage: 120,
                        hitRate: 0.5,
                        targetHitRate: 0.3,
                        missRate: 0.2,
                        move: "6094bbdc6f22b80f70f7b28c"
                    }
                },
            ]
        };

    });

    test('Turn.getDamage gets approprate damage values ', async () => {

        let sampleTurn = {
            turn: 1,
            currentFighter: new Fighter(fighter),
            target: new Fighter(fighter),
            actions: {
                opponentDefensivePosture: {
                    opponentDefenseCombatSkillMove: {
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
                    opponentDefenseDirection: { rangeDamage: RangeDamageTypes.Normal, x: 0, y: 0 },
                },
                moveTo: {
                    cords: {
                        x: 1,
                        y: 1,
                    }
                },
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
                        { rangeDamage: RangeDamageTypes.Normal, x: 1, y: 0 },
                        { rangeDamage: RangeDamageTypes.Normal, x: 0, y: 1 },
                        { rangeDamage: RangeDamageTypes.Normal, x: -1, y: 0 },
                        { rangeDamage: RangeDamageTypes.Normal, x: 0, y: -1 },
                    ]
                },
                strikingWith: LimbTypes.LeftArm,
                target: LimbTypes.Head,
                damage: 5
            },
            results:[]
        };

        let turn = new Turn(sampleTurn);
        


    });
});