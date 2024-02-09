const mongoose = require('mongoose');
const { Schema } = mongoose;

const INITIAL_ATTRIBUTE_POINTS = 15;

const LimbTypes = {
    Head: 'Head',
    Torso: 'Torso',
    LeftArm: 'LeftArm',
    RightArm: 'RightArm',
    LeftLeg: 'LeftLeg',
    RightLeg: 'RightLeg',
};

const AttributeTypes = {
    Strength: "Strength",
    Speed: "Speed",
    Durability: "Durability",
    Endurance: "Endurance",
    Accuracy: "Accuracy",
    Charm: "Charm",
};

const DisciplineTypes = {
    Boxing: "Boxing",
    Wrestling: "Wrestling",
    Kicking: "Kicking",
    Dirty: "Dirty",
    Archery: "Archery",
    Gunmanship: "Gunmanship",
    EnergyWeaponry: "Energy Weaponry",
    SingleHanded: "Single Handed",
    DualWielding: "Dual Wielding",
    TwoHanded: "Two Handed",
};

const CombatCategoryTypes = {
    Unarmed: "Unarmed",
    Ranged: "Ranged",
    Melee: "Melee",
};

const LimbSchema = new Schema({
    name: {
        type: String,
        enum: Object.values(LimbTypes), // Enum based on LimbTypes object
    },
    regenerativeHealth: {
        type: Number,
        default: 100 // Default regenerativeHealth value
    },
    healthLimit: {
        type: Number,
        default: 100 // Default healthLimit value
    },
    healthLifetimeLimit: {
        type: Number,
        default: 100 // Default healthLifetimeLimit value
    },
    isSevered: {
        type: Boolean,
        default: false // Default isSevered value
    },
    canBeSevered: {
        type: Boolean,
        default: true // Default canBeSevered value
    },
    pointValue: {
        type: Number,
        default: 2 // Default pointValue value
    }
});

const AttributesSchema = new Schema({
    name: {
        type: String,
        enum: Object.values(AttributeTypes), // Enum based on LimbTypes object
    },
    value: {
        type: Number,
        default: INITIAL_ATTRIBUTE_POINTS // Default value
    },
    derivedStatistics: {
        type: [String], // Array of strings
        default: [] // Default empty array
    },
    effects: {
        type: Number,
        default: 0 // Default effects value
    }
});

const CombatSkillsSchema = new Schema({
    category: {
        type: String,
        enum: Object.values(CombatCategoryTypes), // Enum based on CombatCategoryTypes object
    },
    discipline:{
        type: String,
        enum: Object.values(DisciplineTypes)
    },
    moveStatistics: {
        moveName: {
            type: String,
            default: "" // Default name value
        },
        level: {
            type: Number,
            default: 0 // Default level value
        },
        currentExp: {
            type: Number,
            default: 0 // Default currentExp value
        },
        expToNexLevel: {
            type: Number,
            default: 15 // Default expToNexLevel value
        },
        throws: {
            type: Number,
            default: 0 // Default throws value
        },
        hits: {
            type: Number,
            default: 0 // Default hits value
        },
        targetHits: {
            type: Number,
            default: 0 // Default targetHits value
        },
        misses: {
            type: Number,
            default: 0 // Default misses value
        },
        damage: {
            type: Number,
            default: 0 // Default damage value
        },
        hitRate: {
            type: Number,
            default: 0.0 // Default hitRate value
        },
        targetHitRate: {
            type: Number,
            default: 0.0 // Default targetHitRate value
        },
        missRate: {
            type: Number,
            default: 0.0 // Default missRate value
        },
    }
});

const FighterSchema = new Schema(
    {
        name: {
            type: String,
            default: ""
        },
        speed: {
            type: Number,
            default: 0
        },
        popularity: {
            type: Number,
            default: 0
        },
        money: {
            type: Number,
            default: 0
        },
        record: {
            wins: {
                type: Number,
                default: 0
            },
            losses: {
                type: Number,
                default: 0
            },
            noContests: {
                type: Number,
                default: 0
            }
        },
        health: {
            isDead: {
                type: Boolean,
                default: false
            },
            limbs: [LimbSchema],
        },
        attributes: {
            availablePoints: {
                type: "Number",
                default: 15
            },
            attributesList: [AttributesSchema]
        },
        combatSkills: [CombatSkillsSchema]
    }
);

module.exports = mongoose.model('Fighter', FighterSchema);
module.exports = mongoose.model('Attribute', AttributesSchema);
module.exports = mongoose.model('Limb', LimbSchema);
module.exports = mongoose.model('CombatSkills', CombatSkillsSchema);
module.exports = {
    LimbTypes,
    AttributeTypes,
    CombatCategoryTypes,
    DisciplineTypes,
    INITIAL_ATTRIBUTE_POINTS,
};
