
// Import the function and any necessary dependencies
const mongoose = require("mongoose");
require('../FightFloor');
const FightFloor = mongoose.model('FightFloor');
const { MarkerTypes } = require('../FightFloor');
const db = require('../../tests/db');
const {ThreeByThreeFightFloor} = require('./utils');
const _ = require('lodash');

describe('FightFloor Model', () => {
    let fightFloor;

    beforeAll(async () => {
        await db.connect();
    });
    afterAll(async () => await db.closeDatabase())
    afterEach(async () => await db.clearDatabase())
    beforeEach(() => {
        fightFloor = _.cloneDeep(ThreeByThreeFightFloor); // Create a deep copy
    });
    

    test('addFighter should add one fighter per cell with a corner marker', async () => {
        // Mock data
        const fighters = [
            { name: 'Fighter1', _id: '123' },
            { name: 'Fighter2', _id: '456' }
        ];
        // Call the function
        fightFloor = await new FightFloor(fightFloor).addFighters(fighters);

        // Assertions
        expect(fightFloor.grid[1][0].markers[1].name).toEqual('Fighter1');
        expect(fightFloor.grid[1][0].markers[1].value).toEqual('123');
        expect(fightFloor.grid[1][0].markers[1].type).toEqual(MarkerTypes.Fighter);

        expect(fightFloor.grid[1][2].markers[1].name).toEqual('Fighter2');
        expect(fightFloor.grid[1][2].markers[1].value).toEqual('456');
        expect(fightFloor.grid[1][2].markers[1].type).toEqual(MarkerTypes.Fighter);

        fightFloor.grid.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {
                if ((rowIndex === 1 && colIndex === 0) || (rowIndex === 1 && colIndex === 2)) {
                    return;
                }
                if (cell.markers.some(marker => marker.type === MarkerTypes.Fighter)) {

                    expect(cell.markers).not.toContainEqual(
                        expect.objectContaining({ type: MarkerTypes.Fighter })
                    );
                }
            }); 
        });
    });

    test('getFighterCords returns the expected cord of a the give fighter', () => {
        const fighter = { name: 'Figher1', _id: '1234' }

        fightFloor.grid[0][1] = {
            terrain: 0,
            cords: { x: 1, y: 0 },
            markers: [{ name: fighter.name, value: fighter._id, type: MarkerTypes.Fighter }],
            issues: []
        };

        expect(fightFloor.grid[0][1].markers.some(marker => marker.type === MarkerTypes.Fighter)).toEqual(true);

        const resCell = new FightFloor(fightFloor).getFighterCords(fighter._id);

        expect(resCell.cords).toEqual({ x: 1, y: 0 });
    });

    test('rangeToOpponent returns the expected range and other values to another fighter', () => {
        const fighter1 = { name: 'Figher1', _id: '1234' }
        const fighter2 = { name: 'Figher2', _id: '6454' }


        fightFloor.grid[0][2] = {
            terrain: 0,
            cords: { x: 2, y: 0 },
            markers: [{ name: fighter1.name, value: fighter1._id, type: MarkerTypes.Fighter }],
            issues: []
        };
        fightFloor.grid[0][1] = {
            terrain: 0,
            cords: { x: 1, y: 0 },
            markers: [{ name: fighter2.name, value: fighter2._id, type: MarkerTypes.Fighter }],
            issues: []
        };

        let result = new FightFloor(fightFloor).rangeToOpponent(1, 0);

        expect(result).toEqual({
            x: 2,
            y: 0,
            stepsX: 1, // The number of modifications made to move towards the opponent along the x-axis
            stepsY: 0, // The number of modifications made to move towards the opponent along the y-axis
            opponentId: '1234'
        });
    });

    test('rangeToOpponent returns the closest range values to the nearest fighter and other values ', () => {
        const fighter1 = { name: 'Figher1', _id: '1234' }
        const fighter2 = { name: 'Figher2', _id: '6454' }


        fightFloor.grid[0][2] = {
            terrain: 0,
            cords: { x: 2, y: 0 },
            markers: [{ name: fighter1.name, value: fighter1._id, type: MarkerTypes.Fighter }],
            issues: []
        };
        fightFloor.grid[0][1] = {
            terrain: 0,
            cords: { x: 1, y: 0 },
            markers: [{ name: fighter2.name, value: fighter2._id, type: MarkerTypes.Fighter }],
            issues: []
        };
        fightFloor.grid[2][2] = {
            terrain: 0,
            cords: { x: 2, y: 2 },
            markers: [{ name: fighter2.name, value: fighter2._id, type: MarkerTypes.Fighter }],
            issues: []
        };

        let result = new FightFloor(fightFloor).rangeToOpponent(1, 0);

        expect(result).toEqual({
            x: 2,
            y: 0,
            stepsX: 1, // The number of modifications made to move towards the opponent along the x-axis
            stepsY: 0, // The number of modifications made to move towards the opponent along the y-axis
            opponentId: '1234'
        });
        expect(result).not.toEqual({
            x: 2,
            y: 2,
            stepsX: 2, // The number of modifications made to move towards the opponent along the x-axis
            stepsY: 2, // The number of modifications made to move towards the opponent along the y-axis
            opponentId: '1234'
        });
    });

    test('Move moves a given fighter to a given cell cord', async () => {
        const fighter = { name: 'Figher1', _id: '1234' }

        const startingLocation = {
            terrain: 0,
            cords: { x: 1, y: 1 },
            markers: [{ name: fighter.name, value: fighter._id, type: MarkerTypes.Fighter }],
            issues: []
        };

        fightFloor.grid[1][1] = startingLocation;

        const moveTo = {x: 1, y: 0}

        fightFloor = await new FightFloor(fightFloor).move(fighter, moveTo);

        expect(fightFloor.grid[startingLocation.cords.y][startingLocation.cords.x].markers.length < 2).toEqual(true);
        expect(fightFloor.grid[startingLocation.cords.y][startingLocation.cords.x].markers.some((marker) =>
        marker.value === fighter._id
        )).toEqual(false);

        expect(fightFloor.grid[moveTo.y][moveTo.x].markers.length > 0).toEqual(true);
        expect(fightFloor.grid[moveTo.y][moveTo.x].markers.some((marker) =>
            marker.value === fighter._id
        )).toEqual(true);

    });

    // test('move does not move to a square if theres a fighter on there already', ()=> {

    // });
    
    // test.only('RangeToOne Gives me the coordinates of the closest 1 to the coords given', () =>{
    //     const matrix = [
    //         [0, 0, 0, 0, 1],
    //         [0, 1, 0, 0, 0],
    //         [0, 0, 0, 1, 0],
    //         [0, 0, 0, 0, 0],
    //         [1, 0, 0, 0, 0]
    //     ];


    //     let closestOne = new FightFloor(matrix).rangeToOne(matrix, 2,2);
    //     expect(closestOne).toEqual({x: 3, y: 2, stepsX: 1, stepsY: 0 });
        
    //     closestOne = new FightFloor(matrix).rangeToOne(matrix, 0,0);
    //     expect(closestOne).not.toEqual({x: 4, y: 0, stepsX: 1, stepsY: 0});
    //     expect(closestOne).toEqual({x: 1, y: 1, stepsX: 1, stepsY: 1});

    // });
});