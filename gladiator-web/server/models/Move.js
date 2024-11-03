const mongoose = require('mongoose');
const { Schema } = mongoose;

const { LimbTypes, DisciplineTypes, CombatCategoryTypes } = require('./Fighter');

const RangeDamageTypes = {
    Nothing: "Nothing",
    Normal: "Normal",
    Low: "Low",

};

const MoveList = [
    {
        category: CombatCategoryTypes.Nothing,
        discipline: DisciplineTypes.Nothing,
        name: 'Nothing',
        targets: [],
        strikingLimb: [],
        baseMoveDamage: 0,
        expPerLand: 0,
        energyCost: 0,
        criticalChance: 0,
        canSevereLimb: false,
        hypeOnTargetHit: 0,
        rangePattern: [
            [{ rangeDamage: RangeDamageTypes.Nothing, x: 0, y: 0 }],
        ]
    },
    {
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
        category: CombatCategoryTypes.Unarmed,
        discipline: DisciplineTypes.Boxing,
        name: 'Nothing',
        targets: [],
        strikingLimb: [],
        baseMoveDamage: 0,
        expPerLand: 0,
        energyCost: 0,
        criticalChance: 0,
        canSevereLimb: false,
        hypeOnTargetHit: 0,
        rangePattern: [{ rangeDamage: RangeDamageTypes.Nothing, x: 0, y: 0 }]
    },
    {
        category: CombatCategoryTypes.Unarmed,
        discipline: DisciplineTypes.Boxing,
        name: 'Cross',
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
        category: CombatCategoryTypes.Unarmed,
        discipline: DisciplineTypes.Boxing,
        name: 'Hook',
        targets: [LimbTypes.Head, LimbTypes.Torso],
        strikingLimb: [LimbTypes.LeftArm, LimbTypes.RightArm],
        baseMoveDamage: 10,
        expPerLand: 4,
        energyCost: 10,
        criticalChance: 10,
        canSevereLimb: false,
        hypeOnTargetHit: 8,
        rangePattern: [
            [{ rangeDamage: RangeDamageTypes.Normal, x: 1, y: 0 }],
            [{ rangeDamage: RangeDamageTypes.Normal, x: 0, y: 1 }],
            [{ rangeDamage: RangeDamageTypes.Normal, x: -1, y: 0 }],
            [{ rangeDamage: RangeDamageTypes.Normal, x: 0, y: -1 }],
        ]
    },
    {
        category: CombatCategoryTypes.Unarmed,
        discipline: DisciplineTypes.Boxing,
        name: 'Block',
        targets: [LimbTypes.Head, LimbTypes.Torso],
        strikingLimb: [LimbTypes.LeftArm, LimbTypes.RightArm],
        baseMoveDamage: 40,
        expPerLand: 2,
        energyCost: 0,
        criticalChance: 0,
        canSevereLimb: false,
        hypeOnTargetHit: 0,
        rangePattern: [
            [{ rangeDamage: RangeDamageTypes.Normal, x: 0, y: 0 }],
        ]
    },
];


const MoveSchema = new Schema({
    category: {
        type: String,
        enum: Object.values(CombatCategoryTypes), // Enum based on CombatCategoryTypes object
    },
    discipline: {
        type: String,
        enum: Object.values(DisciplineTypes)
    },
    name: {
        type: String,
        required: true,
    },
    targets: [{
        type: String,
        enum: Object.values(LimbTypes),
        required: true,
    }],
    strikingLimb: [{
        type: String,
        enum: Object.values(LimbTypes),
        required: true,
    }],
    requiredLevel: {
        type: Number,
        default: 0
    },
    baseMoveDamage: {
        type: Number,
        required: true,
    },
    expPerLand: {
        type: Number,
        required: true,
    },
    energyCost: {
        type: Number,
        required: true,
    },
    criticalChance: {
        type: Number,
        required: true,
    },
    canSevereLimb: {
        type: Boolean,
        required: true,
    },
    hypeOnTargetHit: {
        type: Number,
        required: true,
    },
    rangePattern: [
        [
            {
                rangeDamage: {
                    type: String,
                    enum: Object.values(RangeDamageTypes),
                },
                x: {
                    type: Number,
                    default: 0
                },
                y: {
                    type: Number,
                    default: 0
                }
            }
        ]
    ]
});

MoveSchema.statics.Refresh = async function () {
    try {
        // Check if moves already exist in the database
        const existingMoves = await this.find();

        // If no moves exist, insert the predefined moves
        if (existingMoves.length === 0) {
            await this.insertMany(MoveList);
            console.log('Moves initialized successfully.');
            return true
        } else {
            console.log('Moves already exist in the database. No refresh needed.');
            return true
        }
    } catch (error) {
        console.error('Error initializing moves:', error.message);
        return false
    }
};

MoveSchema.statics.findMovesByCombatSkillAverage = async function (combatSkillAverageMap) {
    const moveSearchResults = [];

    for (const [category, minLevel] of Object.entries(combatSkillAverageMap)) {
        const moves = await this.find({ name: { $regex: category, $options: 'i' }, level: { $lt: minLevel } });
        moveSearchResults.push(...moves);
    }

    return moveSearchResults;
};

//using the xDistance and yDistance see if this move is in range with its aoe
MoveSchema.methods.inRange = function (xDistance, yDistance) {
    for (const patterns of this.rangePattern) {
        for (const pattern of patterns) {
            // const xDiff = xDistance - pattern.x;
            // const yDiff = yDistance - pattern.y;
        
            if (pattern.x >= xDistance && pattern.y >= yDistance) {
                return { inRange: true, patterns };
            }
        }
    }

    return { inRange: false, patterns: null };
}

MoveSchema.methods.autoSelectPattern = function(){
    return this.rangePattern[Math.floor(Math.random() * this.rangePattern.length)];
}
// MoveSchema.methods.autoSelectPatternTowardsOpponent = function(){
//     return this.rangePattern[Math.floor(Math.random() * this.rangePattern.length)];
// }

module.exports = mongoose.model("Move", MoveSchema);
module.exports = {
    RangeDamageTypes,
    MoveList,
};
