const mongoose = require('mongoose');
const mockingoose = require('mockingoose');

require('../../models/Fight');

const Fight = require('../../models/Fight');

const { simulate } = require('../fight');

describe('Fight service', () => {
    describe('simulate', () => {
        it('returns a winner and loser', async () =>{ 
            fightFloor = await FightFloor.create(ThreeByThreeFightFloor()); // Create a deep copy
            let fighter1 = await Fighter.create(randomFighter());
            let fighter2 = await Fighter.create(randomFighter());
            let arena = await Arena.create(defaultArena(fightFloor._id));
            const id =new mongoose.Types.ObjectId()
            mockingoose(Fight).toReturn({
                fighters: [fighter1._id, fighter2._id],
                arena: arena._id,
                winner: null,
                loser: null,
                fightReplay: [],
                combatCategory: CombatCategoryTypes.Unarmed,
                turns: [],
                _id: new mongoose.Types.ObjectId(),
            }, 'findById');

            const results = await simulate(id);
            expect(results)


        });
    });
});