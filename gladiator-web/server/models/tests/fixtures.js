const mongoose = require("mongoose");

const Marker = mongoose.model('Marker');
const Cell = mongoose.model('Cell');
const FightFloor = mongoose.model('FightFloor');

const { CombatCategoryTypes, DisciplineTypes, LimbTypes } = require("../Fighter");
const { RangeDamageTypes } = require("../Move");
const { MarkerTypes, FightFloorTerrainTypes } = require("../FightFloor");

const defaultArena = (fightFloorId) => {
    return {
        name: "Arena 1",
        seats: 1000,
        pricePerSeat: 50,
        prestige: 100,
        arenasCut: 0.1,
        pastFights: [],
        fightFloor: fightFloorId,
        _id: new mongoose.Types.ObjectId(),
    }
}

const randomFighter = (name= 'Test Fighter') => {
    return {
        name: name,
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
                    value: Math.floor(Math.random() * 20) + 1,
                    derivedStatistics: ["stat1", "stat2"],
                    effects: 5,
                },
                {
                    name: "Speed",
                    value: Math.floor(Math.random() * 20) + 1,
                    derivedStatistics: ["stat3", "stat4"],
                    effects: 0,
                },
                {
                    name: "Durability",
                    value: Math.floor(Math.random() * 20) + 1,
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
                    value: Math.floor(Math.random() * 20) + 1,
                    derivedStatistics: ["stat9", "stat10"],
                    effects: -1,
                },
                {
                    name: "Charm",
                    value: Math.floor(Math.random() * 20) + 1,
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
                discipline: DisciplineTypes.Kicking,
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
    }
};

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

const ThreeByThreeFightFloor = () => {
    return {
        size: 9,
        sizeExponent: 1,
        grid: [
            [
                { terrain: FightFloorTerrainTypes.CombatArea, cords: { x: 0, y: 0 }, markers: [], issues: [] },
                { terrain: FightFloorTerrainTypes.CombatArea, cords: { x: 1, y: 0 }, markers: [], issues: [] },
                { terrain: FightFloorTerrainTypes.CombatArea, cords: { x: 2, y: 0 }, markers: [], issues: [] },
            ],
            [
                { terrain: FightFloorTerrainTypes.CombatArea, cords: { x: 0, y: 1 }, markers: [new Marker({ name: "Red Corner", value: "rc", type: MarkerTypes.Corner })], issues: [] },
                { terrain: FightFloorTerrainTypes.CombatArea, cords: { x: 1, y: 1 }, markers: [], issues: [] },
                { terrain: FightFloorTerrainTypes.CombatArea, cords: { x: 2, y: 1 }, markers: [new Marker({ name: "Blue Corner", value: "bc", type: MarkerTypes.Corner })], issues: [] },
            ],
            [
                { terrain: FightFloorTerrainTypes.CombatArea, cords: { x: 0, y: 2 }, markers: [], issues: [] },
                { terrain: FightFloorTerrainTypes.CombatArea, cords: { x: 1, y: 2 }, markers: [], issues: [] },
                { terrain: FightFloorTerrainTypes.CombatArea, cords: { x: 2, y: 2 }, markers: [], issues: [] },
            ]
        ],
        _id: new mongoose.Types.ObjectId(),
    }
};

module.exports = {
    randomFighter,
    defaultArena,
    movesList,
    ThreeByThreeFightFloor
} 