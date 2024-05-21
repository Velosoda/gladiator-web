
// Import the function and any necessary dependencies
const mongoose = require("mongoose");
require('../FightFloor');
const FightFloor = mongoose.model('FightFloor');
const { MarkerTypes } = require('../FightFloor');
const db = require('../../tests/db');
const { ThreeByThreeFightFloor } = require('./fixture');
const _ = require('lodash');

describe('FightFloor Model', () => {
    let fightFloor;

    beforeAll(async () => {
        await db.connect();
    });
    afterAll(async () => await db.closeDatabase())
    afterEach(async () => await db.clearDatabase())
    beforeEach(() => {
        fightFloor = _.cloneDeep(ThreeByThreeFightFloor()); // Create a deep copy
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
    });
    test('addFighter should add a fighter for every corner (2) and place another fighter anywhere else', async () => {
        const mockRandom = jest.spyOn(Math, 'random')
            .mockReturnValueOnce(0) //x
            .mockReturnValueOnce(1) //y
        // Mock data
        const fighters = [
            { name: 'Fighter1', _id: '123' },
            { name: 'Fighter2', _id: '456' },
            { name: 'Fighter3', _id: '789' }
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

        let fighterCount = 0
        fightFloor.grid.forEach((row) => {
            row.forEach((column) => {
                if(column.markers.some((marker) => marker.type === MarkerTypes.Fighter)){
                    fighterCount ++;
                }
            })
        });

        expect(fighterCount).toEqual(3);
        expect(fightFloor.grid[2][0].markers[0].name).toEqual('Fighter3');
        expect(fightFloor.grid[2][0].markers[0].value).toEqual('789');
        expect(fightFloor.grid[2][0].markers[0].type).toEqual(MarkerTypes.Fighter);
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

    test.skip('rangeToNearestFighter returns the expected range and other values to another fighter', () => {
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

        let result = new FightFloor(fightFloor).rangeToNearestFighter(1, 0);

        expect(result).toEqual({
            x: 2,
            y: 0,
            stepsX: 1, // The number of modifications made to move towards the opponent along the x-axis
            stepsY: 0, // The number of modifications made to move towards the opponent along the y-axis
            opponentId: '1234'
        });
    });

    test.skip('rangeToNearestFighter returns the closest range values to the nearest fighter and other values ', () => {
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

        let result = new FightFloor(fightFloor).rangeToNearestFighter(1, 0);

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
    test.skip('rangeToNearestFighter returns the closest range values to the nearest fighter and other values when a fighter has to go back', () => {
        const fighter1 = { name: 'Figher1', _id: '1234' }
        const fighter2 = { name: 'Figher2', _id: '6454' }


        // fightFloor.grid[1][2] = {
        //     terrain: 0,
        //     cords: { x: 2, y: 1 },
        //     markers: [{ name: fighter1.name, value: fighter1._id, type: MarkerTypes.Fighter }],
        //     issues: []
        // };
        // fightFloor.grid[1][0] = {
        //     terrain: 0,
        //     cords: { x: 0, y: 1 },
        //     markers: [{ name: fighter2.name, value: fighter2._id, type: MarkerTypes.Fighter }],
        //     issues: []
        // };


        let testFightFloor = new FightFloor(fightFloor)
        testFightFloor.addFighters([fighter1, fighter2])

        const result = testFightFloor.rangeToNearestFighter(2, 1);

        expect(result).toEqual({
            x: 1,
            y: 0,
            stepsX: 0, // The number of modifications made to move towards the opponent along the x-axis
            stepsY: -1, // The number of modifications made to move towards the opponent along the y-axis
            opponentId: '6454'
        });
    });

    test('Move moves a given fighter to a given cell cord', async () => {
        const fighter = { name: 'Figher1', _id: '1234' }

        fightFloor.grid[1][1] = {
            terrain: 0,
            cords: { x: 1, y: 1 },
            markers: [{ name: fighter.name, value: fighter._id, type: MarkerTypes.Fighter }],
            issues: []
        };

        const moveTo = { x: 1, y: 0 };

        testFightFloor = await new FightFloor(fightFloor);
        testFightFloor.move(fighter, moveTo);

        expect(testFightFloor.grid[1][1].markers.length === 0).toEqual(true);
        expect(testFightFloor.grid[1][1].markers.some((marker) =>
            marker.value === fighter._id
        )).toEqual(false);

        expect(testFightFloor.grid[moveTo.y][moveTo.x].markers.length > 0).toEqual(true);
        expect(testFightFloor.grid[moveTo.y][moveTo.x].markers.some((marker) =>
            marker.value === fighter._id
        )).toEqual(true);

    });

    test('getCellsByMarkerType Returns the cell with the expected markerType', async () => {

        let testFightFloor = await new FightFloor(fightFloor);

        const corners = testFightFloor.getCellsByMarkerType(MarkerTypes.Corner);

        expect(corners[0].cords.x).toEqual(0);
        expect(corners[0].cords.y).toEqual(1);

        expect(corners[1].cords.x).toEqual(2);
        expect(corners[1].cords.y).toEqual(1);

    });

    test('getNeighboringCells, gives me all 4 surrounding cells when the fighter is in the middle', async () => {
        let testFightFloor = await new FightFloor(fightFloor);

        const fighter1 = { name: 'Figher1', _id: '6454' }

        testFightFloor.grid[1][1] = { // fighter in the middle 
            terrain: 0,
            cords: { x: 1, y: 1 },
            markers: [{ name: fighter1.name, value: fighter1._id, type: MarkerTypes.Fighter }],
            issues: []
        };

        let res = testFightFloor.getNeighboringCells(1, 1);

        expect(res[0].cords).toEqual({ x: 0, y: 1 });
        expect(res[1].cords).toEqual({ x: 2, y: 1 });
        expect(res[2].cords).toEqual({ x: 1, y: 0 });
        expect(res[3].cords).toEqual({ x: 1, y: 2 });
        expect(res.length).toEqual(4);
    });
    test('getNeighboringCells, gives me the 3 surrounding cells when the fighter is against a wall', async () => {
        let testFightFloor = await new FightFloor(fightFloor);

        const fighter1 = { name: 'Figher1', _id: '6454' }


        testFightFloor.grid[1][0] = {
            terrain: 0,
            cords: { x: 0, y: 1 },
            markers: [{ name: fighter1.name, value: fighter1._id, type: MarkerTypes.Fighter }],
            issues: []
        };

        let res = testFightFloor.getNeighboringCells(0, 1);

        expect(res[1].cords).toEqual({ x: 0, y: 0 });
        expect(res[0].cords).toEqual({ x: 1, y: 1 });
        expect(res[2].cords).toEqual({ x: 0, y: 2 });
        expect(res.length).toEqual(3);

    });
    test('getNeighboringCells, gives me the 2 surrounding cells when the fighter is against a corner', async () => {
        let testFightFloor = await new FightFloor(fightFloor);

        const fighter1 = { name: 'Figher1', _id: '6454' }

        testFightFloor.grid[0][0] = {
            terrain: 0,
            cords: { x: 0, y: 0 },
            markers: [{ name: fighter1.name, value: fighter1._id, type: MarkerTypes.Fighter }],
            issues: []
        };

        let res = testFightFloor.getNeighboringCells(0, 0);

        expect(res[0].cords).toEqual({ x: 1, y: 0 });
        expect(res[1].cords).toEqual({ x: 0, y: 1 });
        expect(res.length).toEqual(2);
    });
    test('getNeighboringCells, gives me the 1 surrounding cells when the fighter is against a corner and a fighter is in 1 cell range of them', async () => {
        let testFightFloor = await new FightFloor(fightFloor);

        const fighter1 = { name: 'Figher1', _id: '6454' }
        const fighter2 = { name: 'Figher2', _id: '1234' }


        testFightFloor.grid[0][2] = {
            terrain: 0,
            cords: { x: 2, y: 0 },
            markers: [{ name: fighter1.name, value: fighter1._id, type: MarkerTypes.Fighter }],
            issues: []
        };
        testFightFloor.grid[0][1] = {
            terrain: 0,
            cords: { x: 1, y: 0 },
            markers: [{ name: fighter2.name, value: fighter2._id, type: MarkerTypes.Fighter }],
            issues: []
        };

        let res = testFightFloor.getNeighboringCells(2, 0);

        console.log(res)

        expect(res[0].cords).toEqual({ x: 1, y: 0 })
        expect(res[1].cords).toEqual({ x: 2, y: 1 });
        expect(res.length).toEqual(2);
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