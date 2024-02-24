
// Import the function and any necessary dependencies
const mongoose = require("mongoose");
require('../FightFloor');
const FightFloor = mongoose.model('FightFloor');
const Marker = mongoose.model('Marker');
const { MarkerTypes } = require('../FightFloor');
const db = require('../../tests/db');


describe('FightFloor Model', () => {
    let fightFloor;

    beforeAll(async () => {
        await db.connect();
    });
    afterAll(async () => await db.closeDatabase())
    afterEach(async () => await db.clearDatabase())
    beforeEach(() => {
        fightFloor = {
            grid: [
                [
                    { terrain: 0, cords: { x: 0, y: 0 }, markers: [], issues: [] },
                    { terrain: 0, cords: { x: 1, y: 0 }, markers: [], issues: [] },
                    { terrain: 0, cords: { x: 2, y: 0 }, markers: [], issues: [] }
                ],
                [
                    { terrain: 0, cords: { x: 0, y: 1 }, markers: [new Marker({ name: "Red Corner", value: "rc", type: MarkerTypes.Corner })], issues: [] },
                    { terrain: 0, cords: { x: 1, y: 1 }, markers: [], issues: [] },
                    { terrain: 0, cords: { x: 2, y: 1 }, markers: [new Marker({ name: "Blue Corner", value: "bc", type: MarkerTypes.Corner })], issues: [] }
                ],
                [
                    { terrain: 0, cords: { x: 0, y: 2 }, markers: [], issues: [] },
                    { terrain: 0, cords: { x: 1, y: 2 }, markers: [], issues: [] },
                    { terrain: 0, cords: { x: 2, y: 2 }, markers: [], issues: [] }
                ]
            ]
        }
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

        const resCell = new FightFloor(fightFloor).getFighterCords(fighter);

        expect(resCell.cords).toEqual({ x: 1, y: 0 });
    });

    test('rangeToOpponent returns the expected range and other values to another fighter', () => {
        const fighter = { name: 'Figher1', _id: '1234' }

        fightFloor.grid[0][2] = {
            terrain: 0,
            cords: { x: 2, y: 0 },
            markers: [{ name: fighter.name, value: fighter._id, type: MarkerTypes.Fighter }],
            issues: []
        };

        let result = new FightFloor(fightFloor).rangeToOpponent(0, 0);

        expect(result).toEqual({
            opponentX: 2,
            opponentY: 0,
            distance: 2,
            xModifications: 2, // The number of modifications made to move towards the opponent along the x-axis
            yModifications: 0, // The number of modifications made to move towards the opponent along the y-axis
            opponentId: '1234'
        });
        
        result = new FightFloor(fightFloor).rangeToOpponent(0, 1);

        expect(result).toEqual({
            opponentX: 2,
            opponentY: 0,
            distance: 3,
            xModifications: 2, // The number of modifications made to move towards the opponent along the x-axis
            yModifications: -1,// we start from y = 1 but if we go up we are actually going down hence the y<0 
            opponentId: '1234'
        });
    });

    test('rangeToOpponent returns the closest range values to the nearest fighter and other values ', () => {
        const fighter = { name: 'Figher1', _id: '1234' }

        fightFloor.grid[0][2] = {
            terrain: 0,
            cords: { x: 2, y: 0 },
            markers: [{ name: fighter.name, value: fighter._id, type: MarkerTypes.Fighter }],
            issues: []
        };
        fightFloor.grid[0][1] = {
            terrain: 0,
            cords: { x: 1, y: 0 },
            markers: [{ name: fighter.name, value: fighter._id, type: MarkerTypes.Fighter }],
            issues: []
        };

        let result = new FightFloor(fightFloor).rangeToOpponent(0, 0);

        expect(result).toEqual({
            opponentX: 1,
            opponentY: 0,
            distance: 1,
            xModifications: 1, // The number of modifications made to move towards the opponent along the x-axis
            yModifications: 0, // The number of modifications made to move towards the opponent along the y-axis
            opponentId: '1234'
        });
    });
});