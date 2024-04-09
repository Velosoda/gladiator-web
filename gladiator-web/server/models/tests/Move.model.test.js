// Import the function and any necessary dependencies
const mongoose = require("mongoose");
require('../Move');
const Move = mongoose.model('Move');
const db = require('../../tests/db');
const { RangeDamageTypes } = require("../Move");
const { CombatCategoryTypes, DisciplineTypes, LimbTypes } = require("../Fighter");

describe('FightFloor Model', () => {
    let moves;

    beforeAll(async () => {
        await db.connect();
    });
    afterAll(async () => await db.closeDatabase())
    afterEach(async () => await db.clearDatabase())
    beforeEach(() => {
        moves = [
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
                        { rangeDamage: RangeDamageTypes.Normal, x: 1, y: 0 },
                        { rangeDamage: RangeDamageTypes.Normal, x: 2, y: 0 },
                    ],
                    [
                        { rangeDamage: RangeDamageTypes.Normal, x: 0, y: 1 },
                        { rangeDamage: RangeDamageTypes.Normal, x: 0, y: 2 },
                    ],
                    [
                        { rangeDamage: RangeDamageTypes.Normal, x: -1, y: 0 },
                        { rangeDamage: RangeDamageTypes.Normal, x: -2, y: 0 },
                    ],
                    [
                        { rangeDamage: RangeDamageTypes.Normal, x: 0, y: -1 },
                        { rangeDamage: RangeDamageTypes.Normal, x: 0, y: -2 },
                    ],
                ]
            }
        ];
    });

    test('inRange returns true if the allowence is enough', async () => {
        expect(await new Move(moves[0]).inRange(2, 2)).toEqual({
            inRange: false,
            patterns: null
        });
        expect(await new Move(moves[0]).inRange(-1, 2)).toEqual({
            inRange: false,
            patterns: null
        });
        expect(await new Move(moves[0]).inRange(-1, 0)).toMatchObject({
            inRange: true,
            patterns: [{
                rangeDamage: 'Normal',
                x: 1,
                y: 0
            }]
        });

        expect(await new Move(moves[3]).inRange(-1, 0)).toMatchObject({
            inRange: true,
            patterns: [
                {
                    rangeDamage: 'Normal',
                    x: 1,
                    y: 0
                },
                {
                    rangeDamage: 'Normal',
                    x: 2,
                    y: 0
                }
            ]
        });

    });

    test('autoSelectPattern returns a pattern', async () => {
        mockRandom = jest.spyOn(Math, "random")
            .mockReturnValue(0);

        expect(await new Move(moves[3]).autoSelectPattern()).toMatchObject(
            moves[3].rangePattern[0]
        );
    });

    test('autoSelectPattern returns the only pattern when theres one', async () => {
        expect(await new Move(moves[2]).autoSelectPattern()).toMatchObject(
            moves[2].rangePattern[0]
        );
    });
});