const mongoose = require("mongoose");
const db = require('../../tests/db');
const _ = require('lodash');

require('../Move');
require('../Fighter');
require('../FightFloor');
require('../Fight');
require('../Arena');
require('../Turn');

const Fighter = mongoose.model('Fighter');
const Move = mongoose.model('Move');
const FightFloor = mongoose.model('FightFloor');
const Fight = mongoose.model('Fight');
const Arena = mongoose.model('Arena');
const Turn = mongoose.model('Turn');

const { Types } = mongoose;


const { CombatCategoryTypes, LimbTypes } = require("../Fighter");
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

    // test('addTurns creates an array of turns where each fighter goes once ', async () => {
    //     // Mock Math.random to return specific values
    //     const mockRandom = jest.spyOn(Math, 'random')
    //         .mockReturnValueOnce(0.1) // First fighter
    //         .mockReturnValueOnce(0.4) // First fighter
    //         .mockReturnValueOnce(0.6) // Second fighter
    //         .mockReturnValueOnce(0.8); // Second fighter

    //     // Define your fighters and turns
    //     const turns = 4;

    //     // Call the function under test
    //     let testFight = await new Fight(fight);
    //     testFight.addTurns(fighters, turns);

    //     // Assert that the result matches the expected order
    //     expect(testFight[0].attacker._id).toEqual(fighters[0]._id);
    //     expect(testFight[1].attacker._id).toEqual(fighters[0]._id);
    //     expect(testFight[2].attacker._id).toEqual(fighters[1]._id);
    //     expect(testFight[3].attacker._id).toEqual(fighters[1]._id);

    //     // Restore the original Math.random function
    //     mockRandom.mockRestore();
    // });

    test('addTurns returns the expected array structure of rounds and turns per round', async () => {
        let fightFloor = await FightFloor.create(ThreeByThreeFightFloor());
        let fighter1 = await Fighter.create(randomFighter("fighter1"));
        let fighter2 = await Fighter.create(randomFighter("fighter2"));
        let arena = await Arena.create(defaultArena(fightFloor._id));
        fight = await Fight.create({
            fighters: [fighter1, fighter2],
            arena: arena._id,
            winner: null,
            loser: null,
            fightReplay: [],
            combatCategory: CombatCategoryTypes.Unarmed,
            _id: new mongoose.Types.ObjectId(),
        });

        await fight.addTurns();

        const turns = await Turn.find({ _id: { $in: fight.turns.flat() } })
        const countObject = {};
        for(const turn of turns){
            if (countObject[turn.attacker]) {
                countObject[turn.attacker] += 1;
            } else {
                countObject[turn.attacker] = 1;
            }
        }

        console.log({countObject})

        expect(fight.turns.length).toEqual(fight.rounds);
        expect(fight.turns[0].length).toEqual(fight.turnsPerRound);
    });

    test('Run Fight returns a winner and a loser', async () => {
        let fightFloor = await FightFloor.create(ThreeByThreeFightFloor());
        let fighter1 = await Fighter.create(randomFighter("fighter1"));
        let fighter2 = await Fighter.create(randomFighter("fighter2"));
        let arena = await Arena.create(defaultArena(fightFloor._id));
        fight = await Fight.create({
            fighters: [fighter1._id, fighter2._id],
            arena: arena._id,
            winner: null,
            loser: null,
            fightReplay: [],
            combatCategory: CombatCategoryTypes.Unarmed,
            _id: new mongoose.Types.ObjectId(),
        });

        await fight.simulate();

        expect(fight.winner).not.toEqual(null);
        expect(fight.loser).not.toEqual(null);
    });

    test('checkScore returns the desired object ', async () => {

        let fightFloor = await FightFloor.create(ThreeByThreeFightFloor());
        let fighter1 = await Fighter.create(randomFighter());
        let fighter2 = await Fighter.create(randomFighter());
        let arena = await Arena.create(defaultArena(fightFloor._id));
        const turns = [
            new Turn({
                attacker: new mongoose.Types.ObjectId('605c72ef5d1b4a2e10f69461'),
                attack: {
                    target: LimbTypes.LeftArm,
                    damage: 10
                }
            }),
            new Turn({
                attacker: new mongoose.Types.ObjectId('605c72ef5d1b4a2e10f69461'),
                attack: {
                    target: LimbTypes.LeftArm,
                    damage: 10
                }
            }),
            new Turn({
                attacker: new mongoose.Types.ObjectId('605c72ef5d1b4a2e10f69461'),
                attack: {
                    target: LimbTypes.RightArm,
                    damage: 15
                }
            }),
            new Turn({
                attacker: new mongoose.Types.ObjectId('605c72ef5d1b4a2e10f69462'),
                attack: {
                    target: LimbTypes.LeftArm,
                    damage: 20
                }
            }),
            new Turn({
                attacker: new mongoose.Types.ObjectId('605c72ef5d1b4a2e10f69462'),
                attack: {
                    target: LimbTypes.Head,
                    damage: 20
                }
            })
        ];
        fight = await Fight.create({
            fighters: [fighter1, fighter2],
            arena: arena._id,
            winner: null,
            loser: null,
            fightReplay: [],
            combatCategory: CombatCategoryTypes.Unarmed,
            turns: turns,
            _id: new mongoose.Types.ObjectId(),
        });

        result = fight.checkScore();

        expect(result.get('605c72ef5d1b4a2e10f69461')).toEqual(2);
        expect(result.get('605c72ef5d1b4a2e10f69462')).toEqual(7);
    });
});
