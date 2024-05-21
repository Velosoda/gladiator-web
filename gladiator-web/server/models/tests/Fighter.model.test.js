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
                    [{ rangeDamage: RangeDamageTypes.Normal, x: 1, y: 0 }],
                    [{ rangeDamage: RangeDamageTypes.Normal, x: 0, y: 1 }],
                    [{ rangeDamage: RangeDamageTypes.Normal, x: -1, y: 0 }],
                    [{ rangeDamage: RangeDamageTypes.Normal, x: 0, y: -1 }],
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
                    [{ rangeDamage: RangeDamageTypes.Normal, x: 0, y: 0 }],
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
                    [{ rangeDamage: RangeDamageTypes.Normal, x: 1, y: 0 }],
                    [{ rangeDamage: RangeDamageTypes.Normal, x: 0, y: 1 }],
                    [{ rangeDamage: RangeDamageTypes.Normal, x: -1, y: 0 }],
                    [{ rangeDamage: RangeDamageTypes.Normal, x: 0, y: -1 }],
                ]
            },
            {
                _id: "6094bbdc6f22b80f70f7b290",
                category: CombatCategoryTypes.Unarmed,
                discipline: DisciplineTypes.Kicking,
                name: 'Side Kick',
                targets: [
                    LimbTypes.Head,
                    LimbTypes.Torso,
                    LimbTypes.LeftLeg,
                    LimbTypes.RightLeg,
                ],
                strikingLimb: [
                    LimbTypes.LeftLeg,
                    LimbTypes.RightLeg,
                ],
                baseMoveDamage: 10,
                expPerLand: 5,
                energyCost: 20,
                criticalChance: 10,
                canSevereLimb: false,
                hypeOnTargetHit: 10,
                rangePattern: [
                    [
                        { rangeDamage: RangeDamageTypes.Low, x: 1, y: 0 },
                        { rangeDamage: RangeDamageTypes.Normal, x: 2, y: 0 },
                    ],
                    [
                        { rangeDamage: RangeDamageTypes.Low, x: 0, y: 1 },
                        { rangeDamage: RangeDamageTypes.Normal, x: 0, y: 2 },
                    ],
                    [
                        { rangeDamage: RangeDamageTypes.Low, x: -1, y: 0 },
                        { rangeDamage: RangeDamageTypes.Normal, x: -2, y: 0 },
                    ],
                    [
                        { rangeDamage: RangeDamageTypes.Low, x: 0, y: -1 },
                        { rangeDamage: RangeDamageTypes.Normal, x: 0, y: -2 },
                    ],
                ]
            }
        ];

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
                    discipline: DisciplineTypes.Boxing,
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
                        move: "6094bbdc6f22b80f70f7b290"

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

        attack = {
            combatSkill: {
                category: CombatCategoryTypes.Unarmed,
                discipline: DisciplineTypes.Boxing,
                moveStatistics: {
                    move: {
                        _id: new Types.ObjectId("6094bbdc6f22b80f70f7b28a"),
                        category: CombatCategoryTypes.Unarmed,
                        discipline: DisciplineTypes.Boxing,
                        name: 'Jab',
                        targets: [LimbTypes.Head, LimbTypes.Torso],
                        strikingLimb: [LimbTypes.LeftArm, LimbTypes.RightArm],
                        requiredLevel: 0,
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
                        ],
                        __v: 0
                    },
                    level: 3,
                    currentExp: 50,
                    throws: 20,
                    hits: 15,
                    targetHits: 10,
                    misses: 5,
                    damage: 250,
                    hitRate: 0.75,
                    targetHitRate: 0.5,
                    missRate: 0.25,
                    expToNexLevel: 15
                },
                _id: new Types.ObjectId("661e044a88f66b64e372b9ec")
            },
            strikingWith: LimbTypes.LeftArm,
            target: LimbTypes.Head,
            damage: 5
        };
        defense = {
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
        }
    });

    test('inFightRecovery basic minimum value is given to the limb', async () => {
        mockRandom = jest.spyOn(Math, "random")
            .mockReturnValue(0.2); // min value chosen

        let f1 = await new Fighter(fighter).inFightRecovery();

        expect(f1.health.limbs[0].regenerativeHealth).toEqual(90);
    });

    test.skip('auto select cell to move gives me an appropriate cell to move to ', async () => {
        const fighter1 = new Fighter(fighter);
        const fighter2 = new Fighter(fighter);

        fightFloor = await new FightFloor(fightFloor).addFighters([fighter1, fighter2]);
        result = fighter1.autoSetupMovement(fightFloor);

        expect(result).toEqual({
            x: fightFloor.getFighterCords(fighter1._id.toString()).cords.x + 1,
            y: fightFloor.getFighterCords(fighter1._id.toString()).cords.y
        });
    });

    test.skip('ai select cell does not select a cell if that cell has a fighter on there already', async () => {
        const fighter1 = new Fighter(fighter);
        const fighter2 = new Fighter(fighter);

        fightFloor = await new FightFloor(fightFloor).addFighters([fighter1, fighter2]);

        result = fighter1.autoSetupMovement(fightFloor);

        expect(result).not.toEqual({
            x: 2,
            y: 1
        });
    });

    test('ai select attack selects the appropriate combatSkill, strikingWith and target', async () => {

        await Move.insertMany(movesList);

        const fighter1 = new Fighter(fighter);

        mockRandom = jest.spyOn(Math, "random")
            .mockReturnValue(0.1)
            .mockReturnValue(0.1)
            .mockReturnValue(0.1);

        await fighter1.populate(`combatSkills.${0}.moveStatistics.move`);

        result = await fighter1.autoSelectAttack([fighter1.combatSkills[0]]);

        expect(result.combatSkill).toEqual(fighter1.combatSkills[0]);
        expect(result.strikingWith).toEqual(fighter1.combatSkills[0].moveStatistics.move.strikingLimb[0]);
        expect(result.target).toEqual(fighter1.combatSkills[0].moveStatistics.move.targets[0]);
    });

    test('getAvailableMoves, returns expected moves ', async () => {
        await Move.insertMany(movesList);

        const fighter1 = new Fighter(fighter);

        result = await fighter1.getAvailableMoves(1, 0);

        // console.log(getObjectDifferences(attack.combatSkill , result[0].combatSkill));
        // console.log(attack.combatSkill , result[0].combatSkill);

        console.log(JSON.stringify(result[0]));
        expect(result[0].patterns).toMatchObject(
            [
                {
                    rangeDamage: RangeDamageTypes.Normal,
                    x: 1,
                    y: 0,
                }
            ]
        );
        expect(result[0].combatSkill.moveStatistics.move._id.toString()).toEqual(movesList[0]._id);
        expect(result[0].combatSkill.category).toEqual(fighter1.combatSkills[0].category);
        expect(result[0].combatSkill.discipline).toEqual(fighter1.combatSkills[0].discipline);
        expect(result[0].combatSkill.moveStatistics).toEqual(fighter1.combatSkills[0].moveStatistics);
    })
    test.skip('autoSelectDefenceCombatSkills returns a combatskill that is populated and is defence', async () => {
        await Move.insertMany(movesList);

        const fighter1 = new Fighter(fighter);

        mockRandom = jest.spyOn(Math, "random")
            .mockReturnValue(0)
            .mockReturnValue(0)
            .mockReturnValue(0)
            .mockReturnValue(0);

        result = await fighter1.autoSelectDefensiveCombatSkill();

        expect(result).toEqual({
            combatSkill: fighter1.combatSkills[1],
            target: LimbTypes.Head,
            strikingLimb: LimbTypes.LeftArm,
            pattern: fighter1.combatSkills[1].moveStatistics.move.rangePattern[0],
        });
    });

    test('applyDamage Applies the correct damage to the limb ', async () => {

        let fighter1 = new Fighter(fighter);

        await fighter1.applyDamage(10, LimbTypes.Head);

        const limb = fighter1.health.limbs.find((limb) => limb.name === LimbTypes.Head);

        expect(limb.regenerativeHealth).toEqual(40);
    });
    test('applyDamage Applies the correct damage to the limbs health limit when theres no more regenHealth ', async () => {

        let fighter1 = new Fighter(fighter);

        let limb = fighter1.health.limbs.find((limb) => limb.name === LimbTypes.Head);
        limb.regenerativeHealth = 0;

        await fighter1.applyDamage(10, LimbTypes.Head);

        expect(limb.healthLimit).toEqual(90);
    });
    test('damageAbsorption changes target and does not modify damage of attack', async () => {
        let fighter1 = new Fighter(fighter);

        const result = await fighter1.damageAbsorption(attack, defense);

        expect(result).toEqual(true);
        expect(attack.target).toEqual(LimbTypes.LeftArm);
        expect(attack.damage).toEqual(5);

    });
    test('damageAbsorption returns Critical hit if attack hits and has a different target than the defense target', async () => {
        let fighter1 = new Fighter(fighter);
        attack.target = LimbTypes.Torso;

        const result = await fighter1.damageAbsorption(attack, defense);
        expect(result).toEqual(false); // damageabsoption is false because the target just got hit straight up 
        expect(attack.target).toEqual(LimbTypes.Torso);
        expect(attack.damage).toEqual(10);
    });

    //TODO: ADD NOTHING TYPE WITH A PATTERN OF BLOCKING AND no striking limbs and target limbs and 0 stats
    test('damageAbsorption returns false when attack does not hit', async () => {
        let fighter1 = new Fighter(fighter);
        attack.rangePattern = [
            { rangeDamage: RangeDamageTypes.Normal, x: 1, y: 0 }
        ]
        defense.pattern = [
            { rangeDamage: RangeDamageTypes.Normal, x: 0, y: 1 }
        ]

        const result = await fighter1.damageAbsorption(attack, defense);
        expect(result).toEqual(false);
        expect(attack.target).toEqual(LimbTypes.Head);
        expect(attack.damage).toEqual(5);
    });

    test('movesInRangeOfAnotherFighter returns moves when theres a fighter in range of a move', async () => {
        let fighter1 = new Fighter(fighter);
        let fighter2 = new Fighter(fighter);
        let testFightFloor = await new FightFloor(fightFloor);
        await Move.insertMany(movesList);

        testFightFloor.grid[0][0] = {
            terrain: 0,
            cords: { x: 0, y: 0 },
            markers: [{ name: fighter1.name, value: fighter1._id, type: MarkerTypes.Fighter }],
            issues: []
        };
        testFightFloor.grid[0][1] = {
            terrain: 0,
            cords: { x: 1, y: 0 },
            markers: [{ name: fighter2.name, value: fighter2._id, type: MarkerTypes.Fighter }],
            issues: []
        };

        const result = await fighter1.movesInRangeOfAnotherFighter(
            testFightFloor
        );

        expect(result.length).toEqual(2);
        expect(result[0].cords.x).toEqual(1);
        expect(result[0].cords.y).toEqual(0);
        expect(result[0].rangeDamage).toEqual(RangeDamageTypes.Normal);
        expect(result[0].opponentId).toEqual(fighter2._id.toString());

        expect(result[1].cords.x).toEqual(1);
        expect(result[1].cords.y).toEqual(0);
        expect(result[1].rangeDamage).toEqual(RangeDamageTypes.Low);
        expect(result[1].opponentId).toEqual(fighter2._id.toString());

    })
    test('movesInRangeOfAnotherFighter returns nothing when theres no fighter in range of a move', async () => {
        await Move.insertMany(movesList);

        let fighter1 = new Fighter(fighter);
        let fighter2 = new Fighter(fighter);
        let testFightFloor = await new FightFloor(fightFloor);

        testFightFloor.grid[0][0] = {
            terrain: 0,
            cords: { x: 0, y: 0 },
            markers: [{ name: fighter1.name, value: fighter1._id, type: MarkerTypes.Fighter }],
            issues: []
        };
        testFightFloor.grid[2][2] = {
            terrain: 0,
            cords: { x: 2, y: 2 },
            markers: [{ name: fighter2.name, value: fighter2._id, type: MarkerTypes.Fighter }],
            issues: []
        };

        const result = await fighter1.movesInRangeOfAnotherFighter(
            testFightFloor
        );

        expect(result.length).toEqual(0);
    });
});
