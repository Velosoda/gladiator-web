var mongoose = require('mongoose');
const Chance = require('chance');
const Fighter = mongoose.model('Fighter');
const Move = require('../models/Move');

const chance = new Chance();
const { ObjectId } = mongoose.Types;

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

    return {
        level: level,
        currentExp: 0,
        expToNexLevel: level * 15,
        throws: throws,
        hits: hits,
        targetHits: targetHits,
        misses: misses,
        damage: 0,
        hitRate: hundredthsSlice((hits / throws) * 100),
        targetHitRate: hundredthsSlice((targetHits / throws) * 100),
        missRate: hundredthsSlice((misses / throws) * 100),
    }
}
function setGeneratedCombatSkills() {
    return {
        Unarmed: {
            Boxing: [
                {
                    name: "Jab",
                    ...generateStats()
                },
                {
                    name: "Hook",
                    ...generateStats()
                },
                {
                    name: "Cross",
                    ...generateStats()
                },
                {
                    name: "Block",
                    ...generateStats()
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


class FighterService {
    static getCombatSkillAverage(fighter) {
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
    static async setMovesLearned(newFighter) {
        const combatSkillAverageMap = this.getCombatSkillAverage(newFighter);
        
        return await Move.findMovesByCombatSkillAverage(combatSkillAverageMap);
    };

    static refreshFighterPool(count = 20) {
        try {
            const fighters = Array.from({ length: count }, async () => {
                const newFighter = new Fighter({
                    name: chance.name({ gender: 'male' }),
                    combatSkills: setGeneratedCombatSkills(),
                });
                await newFighter.save();
            });

            return fighters;
        } catch (error) {
            console.log(`issue trying to add fighters ${error}`);
            throw error;
        }
    }
    static async getFighterById(id){
        try {
            return await Fighter.findOne({_id: id});
        } catch (error) {
            console.log(`There was an issue trying to retrieve the fighter with id ${id}`);
            throw error;
        }
    }
}


module.exports = FighterService;