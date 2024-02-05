const mongoose = require('mongoose');
const { Schema } = mongoose;

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

const CombatCategories = {
    Unarmed: {
        Boxing: "Boxing",
        Wrestling: "Wrestling",
        Kicking: "Kicking",
        Dirty: "Dirty",
    },
    Ranged: {
        ...this.Unarmed,
        Archery: "Archery",
        Gunmanship: "Gunmanship",
        EnergyWeaponry: "Energy Weaponry",
    },
    Melee: {
        ...this.Unarmed, // Include everything from Unarmed
        SingleHanded: "Single Handed",
        DualWielding: "Dual Wielding",
        TwoHanded: "Two Handed",
    },
};


const defaultStats = () => {
    return {
        level: 0,
        // move: move,
        currentExp: 0,
        expToNexLevel: 15,
        throws: 0,
        hits: 0,
        targetHits: 0,
        misses: 0,
        damage: 0,
        hitRate: 0.0,
        targetHitRate: 0.0,
        missRate: 0.0,
    }
}

const getDefaultAttacks = () => {
    return {
        Unarmed: {
            Boxing: [
                {
                    name: "Jab",
                    ...defaultStats()
                },
                {
                    name: "Hook",
                    ...defaultStats()
                },
                {
                    name: "Block",
                    ...defaultStats()
                },
            ],
            Wrestling: [],
            Kicking: [],
            Dirty: [],
        },
        Ranged: {
            Archery: [],
            Gunmanship: [],
            EnergyWeaponry: [],
        },
        Melee: {
            SingleHanded: [],
            DualWielding: [],
            TwoHanded: [],
        }
    }
}

const limbSchema = {
    currentHealth: 100,
    overallHealth: 100,
    isSevered: false,
    canBeSevered: true,
    pointValue: 2
};

const attributesSchema = {
    level: 0,
    currentExp: 0,
    expToNextLevel: 5
}

// const attacksSchema = new Schema({
//     name: String,
//     level: Number,
//     currentExp: Number,
//     expToNextLevel: Number,
//     throws: Number,
//     targetHits: Number,
//     hits: Number,
//     misses: Number,
//     damage: Number,
//     hitRate: Number,
//     targetHitRate: Number,
//     missRate: Number,
// });

const nameGenerator = () => {
    return
}
const FighterSchema = new Schema(
    {
        name: {
            type: String,
            default: ""
        },
        speed: {
            type: Number
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
            limbs: {
                type: Object,
                default: Object.keys(LimbTypes).reduce((limbs, limb) => ({ ...limbs, [limb]: limbSchema }), {}),
            }
        },
        attributes: {
            type: Object,
            default: Object.keys(AttributeTypes).reduce((attrs, attr) => ({ ...attrs, [attr]: attributesSchema }), {}),
        },
        combatSkills: {
            type: Object,
            default: Object.entries(CombatCategories).reduce((categories, [category, categoryValue]) => {
                console.log(`Processing category: ${category}`);
                const defaultAttacks = getDefaultAttacks();

                const defaultAttacksForDiscipline = defaultAttacks[category];

                if (!defaultAttacksForDiscipline) {
                    console.error(`No default attacks found for category: ${category}`);
                    return categories;
                }

                const categorySchema = Object.keys(categoryValue).reduce(
                    (disciplines, discipline) => {
                        console.log(`  Processing discipline: ${discipline}`);

                        const defaultAttacksForDiscipline = defaultAttacks[category][discipline];

                        if (!defaultAttacksForDiscipline) {
                            console.error(`    No default attacks found for discipline: ${discipline}`);
                            return disciplines;
                        }

                        const disciplineSchema = defaultAttacksForDiscipline.map( (defaultAttack) => {
                            return {
                                ...defaultAttack,
                            };
                        });

                        return {
                            ...disciplines,
                            [discipline]: disciplineSchema,
                        };
                    },
                    {}
                );

                return { ...categories, [category]: categorySchema };
            }, {}),
        }
    }
);

// FighterSchema.statics.RefreshFighterPool = async function (count) {
//     // try {
//     //     const fightersFound = await this.countDocuments(); 

//     //     // if(fightersFound < count){
//     //     //     for(let i = i)
//     //     // }

//     //     console.log("Fighters Found " + fightersFound)

//     //     await FighterSchema.


//     // } catch (error) {

//     // }
// };

module.exports = mongoose.model('Fighter', FighterSchema);
module.exports = {
    LimbTypes
};
