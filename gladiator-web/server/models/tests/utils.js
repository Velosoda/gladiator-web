const mongoose = require("mongoose");

const { MarkerTypes } = require("../FightFloor");
const Marker = mongoose.model('Marker');

const ThreeByThreeFightFloor = {
    sizeExponent: 1,
    grid: [
        [
            { terrain: 0, cords: { x: 0, y: 0 }, markers: [], issues: [] },
            { terrain: 0, cords: { x: 1, y: 0 }, markers: [], issues: [] },
            { terrain: 0, cords: { x: 2, y: 0 }, markers: [], issues: [] }
        ],
        [
            { terrain: 0, cords: { x: 0, y: 1 }, markers: [new Marker({ name: "Red Corner", value: "rc", type: MarkerTypes.Corner })], issues: [] },
            { terrain: 0, cords: { x: 1, y: 1 }, markers: [], issues: [] },
            { terrain: 0, cords: { x: 2, y: 1 }, markers: [new Marker({ name: "Blue Corner", value: "bc", type: MarkerTypes.Corner })], issues: [] }
        ],
        [
            { terrain: 0, cords: { x: 0, y: 2 }, markers: [], issues: [] },
            { terrain: 0, cords: { x: 1, y: 2 }, markers: [], issues: [] },
            { terrain: 0, cords: { x: 2, y: 2 }, markers: [], issues: [] }
        ]
    ]
};

// const simpleFighter = {
//     name: "",
//     attributes: {
//         availablePoints: 0,
//         attributesList: [
//             {
//                 name: "Strength",
//                 value: Math.floor(Math.random() * (20 - 0 + 1)) + 0,
//                 derivedStatistics: ["stat1", "stat2"],
//                 effects: 5,
//             },
//             {
//                 name: "Speed",
//                 value: Math.floor(Math.random() * (20 - 0 + 1)) + 0,
//                 derivedStatistics: ["stat3", "stat4"],
//                 effects: 0,
//             },
//             {
//                 name: "Durability",
//                 value: Math.floor(Math.random() * (20 - 0 + 1)) + 0,
//                 derivedStatistics: ["stat5", "stat6"],
//                 effects: -3,
//             },
//             {
//                 name: "Endurance",
//                 value: Math.floor(Math.random() * (20 - 0 + 1)) + 0,
//                 derivedStatistics: ["stat7", "stat8"],
//                 effects: 2,
//             },
//             {
//                 name: "Accuracy",
//                 value: Math.floor(Math.random() * (20 - 0 + 1)) + 0,
//                 derivedStatistics: ["stat9", "stat10"],
//                 effects: -1,
//             },
//             {
//                 name: "Charm",
//                 value: Math.floor(Math.random() * (20 - 0 + 1)) + 0,
//                 derivedStatistics: ["stat11", "stat12"],
//                 effects: 7,
//             },
//         ],
//     },
//     _id: new Types.ObjectId(),
//     combatSkills: [{
//         category: CombatCategoryTypes.Unarmed,
//         discipline: DisciplineTypes.Boxing,
//         moveStatistics: {
//             move: {
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
// };

module.exports = {
    ThreeByThreeFightFloor,
    // simpleFighter
}