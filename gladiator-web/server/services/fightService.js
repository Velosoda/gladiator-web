var mongoose = require('mongoose');
const { CombatCategoryTypes } = require('../models/Fighter');

const Fight = mongoose.model('Fight');

class FightService {
    async createFights(fighters, combatCategory = CombatCategoryTypes.Unarmed) {
        let fights = [];
    
        for (let i = 1; i < fighters.length; i += 2) {
            const newFight = await new Fight({
                redCornerFighter: fighters[i - 1],
                blueCornerFighter: fighters[i],
                combatCategory: combatCategory,
            });
            fights.push(newFight._id);
            await newFight.save();
        }
        return fights;
    }
}

module.exports = FightService;