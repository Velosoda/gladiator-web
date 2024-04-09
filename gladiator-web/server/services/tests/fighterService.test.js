// const mongoose = require("mongoose");
// require('../../models/Fighter');
// var Fighter = mongoose.model('Fighter');
// const FighterService = require('../fighterService');
// const { dbConnect, dbDisconnect } = require("../../utils/test-utils/dbHandler.utils");
// var service = new FighterService();
// const { MongoMemoryServer } = require('mongodb-memory-server');

// let mongod;

// beforeAll(async () => {
//   mongod = await MongoMemoryServer.create();
//   process.env.MONGO_URI = mongod.getUri();
// });

// afterAll(async () => {
//   await mongod.stop();
// });

test('', async() => {
  
})

// test('getCombatSkillAverage should return the expected dictionary', async () => {
//     // Arrange
//     const expectedAverage = 5;

//     const newFighter = new Fighter();
//     newFighter.combatSkills.Unarmed.Boxing = newFighter.combatSkills.Unarmed.Boxing.map((attack) => {
//         // Update the specific property in each object
//         attack.level = 5;

//         return attack; // Return the updated object
//     });


//     // Act
//     const result = await service.getCombatSkillAverage(newFighter);

//     // Assert
//     expect(result['Boxing']).toEqual(expectedAverage);
// });

// test('setMovesLearned should return the correct amount of moves for the given level', async () => {
//     // Assuming you have some test data or mocks, adjust this accordingly

//     const newFighter = new Fighter();
//     newFighter.combatSkills.Unarmed.Boxing = newFighter.combatSkills.Unarmed.Boxing.map((attack) => {
//         // Update the specific property in each object
//         attack.level = 5;

//         return attack; // Return the updated object
//     });

//     // Now call your async function
//     const moves = await service.setMovesLearned(newFighter);

//     // Check if the asynchronous function worked as expected
//     expect(moves.length).toEqual(3);
// });