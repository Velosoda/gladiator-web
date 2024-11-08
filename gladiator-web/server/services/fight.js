var mongoose = require('mongoose');
const { CombatCategoryTypes } = require('../models/Fighter');
const { FightStatusTypes } = require('../models/Fight');

const Fight = mongoose.model('Fight');

class FightService {

    async createFights (fighters, arena, combatCategory = CombatCategoryTypes.Unarmed){
        let fights = [];
    
        for (let i = 1; i < fighters.length; i += 2) {
    
            const fighter1 = fighters[i-1]
            const fighter2 = fighters[i]
    
            const newFight = await new Fight({
                fighters: [fighter1._id, fighter2._id],
                arena: arena,
                combatCategory: combatCategory,
                status: FightStatusTypes.CONFIRMED
            });
    
            fights.push(newFight._id);
            await newFight.save();
        }
        return fights;
    };
    
    
    async simulateFight(fight){
        await fight.simulate();
    };

}

module.exports = FightService