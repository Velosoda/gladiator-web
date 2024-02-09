var mongoose = require('mongoose');
const Chance = require('chance');
const Fighter = mongoose.model('Fighter');
const Limb = mongoose.model('Limb');
const CombatSkills = mongoose.model('CombatSkills');
const Attribute = mongoose.model('Attribute');
const Move = require('../models/Move');
const {
    LimbTypes,
    AttributeTypes,
    CombatCategoryTypes,
    DisciplineTypes,
    INITIAL_ATTRIBUTE_POINTS
} = require('../models/Fighter');

const chance = new Chance();

const CombatCategories = {
    [CombatCategoryTypes.Unarmed]: [
        DisciplineTypes.Boxing,
        DisciplineTypes.Wrestling,
        DisciplineTypes.Kicking,
        DisciplineTypes.Dirty
    ],
    [CombatCategoryTypes.Ranged]: [
        DisciplineTypes.Archery,
        DisciplineTypes.Gunmanship,
        DisciplineTypes.EnergyWeaponry
    ],
    [CombatCategoryTypes.Melee]: [
        DisciplineTypes.SingleHanded,
        DisciplineTypes.DualWielding,
        DisciplineTypes.TwoHanded,
    ]
};

function getRandomInt(min, max) {
    // min is inclusive, max is exclusive
    return Math.floor(Math.random() * (max - min) + min);
}

function hundredthsSlice(number) {
    return Math.round(number * Math.pow(10, 2)) / Math.pow(10, 2)
}

function generateStats() {
    const level = getRandomInt(1, 10);
    const throws = getRandomInt(10, 100);
    const hits = throws - getRandomInt(1, throws);
    const targetHits = hits - getRandomInt(1, hits);
    const misses = throws - hits;
    const expToNexLevel = level * 15;

    return {
        level: level,
        currentExp: getRandomInt(0, expToNexLevel - 1),
        expToNexLevel: level * 15,
        throws: throws,
        hits: hits,
        targetHits: targetHits,
        misses: misses,
        hitRate: hundredthsSlice((hits / throws) * 100),
        targetHitRate: hundredthsSlice((targetHits / throws) * 100),
        missRate: hundredthsSlice((misses / throws) * 100),
    }
}

function initializeLimbs() {
    var limbs = []
    Object.values(LimbTypes).map(limbType => {
        let pointValue = 2; // Default point value for arms and legs

        if (limbType === LimbTypes.Head || limbType === LimbTypes.Torso) {
            pointValue = 5;
        } else if (limbType.includes('Arm')) {
            pointValue = 2;
        } else if (limbType.includes('Leg')) {
            pointValue = 3;
        }

        limbs.push(new Limb({
            name: limbType,
            regenerativeHealth: 100,
            healthLimit: 100,
            healthLifetimeLimit: 100,
            isSevered: false,
            canBeSevered: true,
            pointValue: pointValue
        }));
    });
    return limbs;
}

async function initializeCombatSkills() {
    const combatSkillsInstances = [];

    for (const [category, disciplines] of Object.entries(CombatCategories)) {
        for (const discipline of disciplines) {
            const currentMoveList = await Move.find({ category: category, discipline: discipline });
            
            console.log(`Category: ${category}, Discipline: ${discipline}`);
            
            for(const move of currentMoveList){
                const stats = generateStats();
                const combatSkillsInstance = new CombatSkills({
                    category: category,
                    discipline: discipline,
                    moveStatistics: {
                        moveName: move.name,
                        level: stats.level,
                        currentExp: stats.currentExp,
                        expToNexLevel: stats.expToNexLevel,
                        throws: stats.throws,
                        hits: stats.hits,
                        targetHits: stats.targetHits,
                        misses: stats.misses,
                        damage: move.baseMoveDamage,
                        hitRate: stats.hitRate,
                        targetHitRate: stats.targetHitRate,
                        missRate: stats.missRate,
                    }
                });
                combatSkillsInstances.push(combatSkillsInstance);
            }
        }
    }

    console.log("CombatSKills: ", combatSkillsInstances);
    return combatSkillsInstances;
}

function initializeAttributes() {
    var remainingAttributePoints = INITIAL_ATTRIBUTE_POINTS;
    var attributes = [];
    for (const [key, value] of Object.entries(AttributeTypes)) {
        console.log(`Attribute: ${key}, Type: ${value}`);

        const assignPoints = getRandomInt(1, remainingAttributePoints);
        
        if (remainingAttributePoints > 0) {
            const attribute = new Attribute({
                name: value,
                value: assignPoints,
                derivedStatistics: ["test"],
                effects: 1
            })
            remainingAttributePoints -= assignPoints;
            attributes.push(attribute);
        }
        else {
            const attribute = new Attribute({
                name: value,
                value: assignPoints,
                derivedStatistics: ["test"],
                effects: 1
            })
            attributes.push(attribute);
        }
    }
    // console.log("Attribute ", attributes);
    return attributes;
}

class FighterService {
    getCombatSkillAverage(fighter) {
        let res = {};

        const combatSkills = fighter.combatSkills;

        for (const category in combatSkills) {
            // Iterate over the disciplines within each category
            for (const discipline in combatSkills[category]) {
                let disciplineSum = 0;

                // Iterate over the attacks within each discipline
                for (const attack of combatSkills[category][discipline]) {
                    disciplineSum += attack.level;
                }
                res[discipline] = Math.floor(disciplineSum / combatSkills[category][discipline].length);
            }
        }
        return res;
    }

    async refreshFighterPool(count = 20) {
        try {
            const fighters = Array.from({ length: count }, async () => {
                const combatSkills = await initializeCombatSkills();
                const newFighter = await new Fighter({
                    name: chance.name({ gender: 'male' }),
                    health: {
                        limbs: initializeLimbs()
                    },
                    attributes: {
                        attributesList: initializeAttributes()
                    },
                    combatSkills: combatSkills
                });
                console.log("Fighter: " , newFighter)
                await newFighter.save();
            });

            return fighters;
        } catch (error) {
            console.log(`issue trying to add fighters ${error}`);
            throw error;
        }
    }

    async setMovesLearned(newFighter) {
        const combatSkillAverageMap = this.getCombatSkillAverage(newFighter);

        return await Move.findMovesByCombatSkillAverage(combatSkillAverageMap);
    };

    async getFighterById(id) {
        try {
            return await Fighter.findOne({ _id: id });
        } catch (error) {
            console.log(`There was an issue trying to retrieve the fighter with id ${id}`);
            throw error;
        }
    }
}


module.exports = FighterService;