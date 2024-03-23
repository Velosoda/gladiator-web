// Import the function and any necessary dependencies
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

const { MarkerTypes } = require('../FightFloor');
const { CombatCategoryTypes, DisciplineTypes, LimbTypes } = require("../Fighter");
const { RangeDamageTypes, MoveList } = require("../Move");
const { ThreeByThreeFightFloor, simpleFighter } = require('./utils');

describe('Fighter Model', () => {
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

    test('inFightRecovery basic minimum value is given to the limb', async () => {
        mockRandom = jest.spyOn(Math, "random")
            .mockReturnValue(0.2); // min value chosen

        let f1 = await new Fighter(fighter).inFightRecovery();

        expect(f1.health.limbs[0].regenerativeHealth).toEqual(90);
    });

    test('auto select cell to move gives me an appropriate cell to move to ', async () => {
        const fighter1 = new Fighter(fighter);
        const fighter2 = new Fighter(fighter);

        fightFloor = await new FightFloor(fightFloor).addFighters([fighter1, fighter2]);
        result = fighter1.autoMoveToPosition(fightFloor);

        expect(result).toEqual({
            x: fightFloor.getFighterCords(fighter1._id.toString()).cords.x + 1,
            y: fightFloor.getFighterCords(fighter1._id.toString()).cords.y
        });
    });

    test('ai select cell does not select a cell if that cell has a fighter on there already', async () => {
        const fighter1 = new Fighter(fighter);
        const fighter2 = new Fighter(fighter);

        fightFloor = await new FightFloor(fightFloor).addFighters([fighter1, fighter2]);

        result = fighter1.autoMoveToPosition(fightFloor);

        expect(result).not.toEqual({
            x: 2,
            y: 1
        });
    });

    test('ai select attack selects the appropriate attack', async () => {
        const fighter1 = new Fighter(fighter);

        mockRandom = jest.spyOn(Math, "random")
            .mockReturnValue(0.1);

        result = await fighter1.autoSelectAttack(fighter.combatSkills);

        expect(result).toEqual(fighter.combatSkills[0]);
    });

    test('auto Select Defense CombatSkill selects the appropriate attack', async () => {
        await Move.insertMany(movesList);

        const fighter1 = new Fighter(fighter);
        
        mockRandom = jest.spyOn(Math, "random")
            .mockReturnValue(0);

        result = await fighter1.autoSelectDefenseCombatSkill();

        expect(result).toEqual(fighter1.combatSkills[1]);
    });

    test('getAvailableMoves, returns expected moves ', async () =>{
        await Move.insertMany(movesList);

        const fighter1 = new Fighter(fighter);

        result = await fighter1.getAvailableMoves(1,0);

        console.log(result[0], movesList[0]);
        
        expect(result[0]._id.toString()).toEqual(movesList[0]._id);
    })
});