const mongoose = require('mongoose');
const { LimbTypes, DisciplineTypes, CombatCategoryTypes } = require('./Fighter');

const { Schema } = mongoose;

const MoveList = [
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
    },
];

const MoveSchema = new Schema({
    category: {
        type: String,
        enum: Object.values(CombatCategoryTypes), // Enum based on CombatCategoryTypes object
    },
    discipline:{
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
  
const Move = mongoose.model('Move', MoveSchema);
module.exports = Move;
