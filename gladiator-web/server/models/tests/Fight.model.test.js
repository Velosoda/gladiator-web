const mongoose = require("mongoose");
const db = require('../../tests/db');
const _ = require('lodash');

require('../Move');
require('../Fighter');
require('../FightFloor');
require('../Fight');
require('../Arena');

const Fighter = mongoose.model('Fighter');
const Move = mongoose.model('Move');
const FightFloor = mongoose.model('FightFloor');
const Fight = mongoose.model('Fight');
const Arena = mongoose.model('Arena');
const { Types } = mongoose;


const { CombatCategoryTypes } = require("../Fighter");
const { randomFighter, defaultArena, movesList, ThreeByThreeFightFloor } = require("./fixtures");
const { MarkerTypes } = require("../FightFloor");

let fightFloor;
let fighter;
let fight;

describe('FightFloor Model', () => {
    beforeAll(async () => {
        await db.connect();
    });
    afterAll(async () => await db.closeDatabase())
    afterEach(async () => await db.clearDatabase())
    beforeEach(async () => {
        await Move.insertMany(movesList);
        // console.log("Arena - Test ", await Arena.findById(arena._id));
        // console.log("FightFloor - Test ", await FightFloor.find());
        // console.log("Fight - Test ", await Fight.find());
        // console.log("Fighter - Test ", await Fighter.find());
        // console.log("Move - Test ", await Move.find());

        // const collections = ['Arena', 'FightFloor', 'Fight', 'Fighter', 'Move'];

        // for (const collection of collections) {
        //     console.log(`${collection} - Test`, await mongoose.model(collection).find());
        // }
    });

    test('addTurns creates an array of turns where each fighter goes once ', async () => {
        // Mock Math.random to return specific values
        const mockRandom = jest.spyOn(Math, 'random')
            .mockReturnValueOnce(0.1) // First fighter
            .mockReturnValueOnce(0.4) // First fighter
            .mockReturnValueOnce(0.6) // Second fighter
            .mockReturnValueOnce(0.8); // Second fighter

        // Define your fighters and turns
        const turns = 4;

        // Call the function under test
        let testFight = await new Fight(fight);
        testFight.addTurns(fighters, turns);

        // Assert that the result matches the expected order
        expect(testFight[0].attacker._id).toEqual(fighters[0]._id);
        expect(testFight[1].attacker._id).toEqual(fighters[0]._id);
        expect(testFight[2].attacker._id).toEqual(fighters[1]._id);
        expect(testFight[3].attacker._id).toEqual(fighters[1]._id);

        // Restore the original Math.random function
        mockRandom.mockRestore();
    });
    test.only('Run Fight returns a winner and a loser', async () => {
        let fightFloor = await FightFloor.create(ThreeByThreeFightFloor()); 
        let fighter1 = await Fighter.create(randomFighter());
        let fighter2 = await Fighter.create(randomFighter());
        let arena = await Arena.create(defaultArena(fightFloor._id));

        // console.log({ fightFloor, fighter1, fighter2, arena });

        fight = await Fight.create({
            fighters: [fighter1, fighter2],
            arena: arena._id,
            winner: null,
            loser: null,
            fightReplay: [],
            combatCategory: CombatCategoryTypes.Unarmed,
            turns: [],
            _id: new mongoose.Types.ObjectId(),
        });


        await fight.simulate();
        
        expect(fight.winner).not.toEqual(null);
        expect(fight.loser).not.toEqual(null);
    });
});
