const mongoose = require("mongoose");
const db = require('../../tests/db');
const _ = require('lodash');
const { Types } = mongoose;

require('../../models/Fighter');
require('../../models/Tournament');
require('../../models/Arena');

const TournamentService = require('../tournament'); // Adjust the path accordingly
const FighterService = require('../fighter');
const FightService = require('../fight');

const Fighter = mongoose.model('Fighter');
const Tournament = mongoose.model('Tournament');
const Arena = mongoose.model('Arena');

jest.mock('../fighter'); // Mock FighterService
jest.mock('../fight'); // Mock FightService
jest.mock('../../models/Tournament'); // Mock the Tournament model
jest.mock('../../models/Fighter'); // Mock the Fighter model
jest.mock('../../models/Arena'); // Mock the Arena model

beforeAll(async () => {
    await db.connect();
});
afterAll(async () => await db.closeDatabase())
afterEach(async () => {
    await db.clearDatabase();
    jest.restoreAllMocks();
});

describe('TournamentService', () => {
    let tournamentService;

    beforeEach(() => {
        tournamentService = new TournamentService();
    });

    describe('getEntryLevelArena', () => {
        it('should return the entry level arena', async () => {
            const mockArena = { name: 'Entry Level Arena' };
            Arena.find.mockResolvedValue([mockArena]);

            const result = await tournamentService.getEntryLevelArena();
            expect(Arena.find).toHaveBeenCalledWith({ name: "Entry Level Arena" });
            expect(result).toEqual([mockArena]);
        });

        it('should throw an error if there is an issue', async () => {
            Arena.find.mockRejectedValue(new Error('Database Error'));

            await expect(tournamentService.getEntryLevelArena()).rejects.toThrow('Database Error');
        });
    });

    describe('getExistingFighters', () => {
        it('should return a list of existing fighters', async () => {
            const mockFighters = [{ _id: 'fighter1' }, { _id: 'fighter2' }];
            Fighter.find.mockResolvedValue(mockFighters);

            const result = await tournamentService.getExistingFighters(2);
            expect(Fighter.find).toHaveBeenCalledWith({ pastFights: { $exists: true, $size: 0 } }, '_id');
            expect(result).toEqual(mockFighters);
        });

        it('should throw an error if there is an issue', async () => {
            Fighter.find.mockRejectedValue(new Error('Database Error'));

            await expect(tournamentService.getExistingFighters()).rejects.toThrow('Database Error');
        });
    });

    describe('generateFighters', () => {
        it('should generate fighters', async () => {
            const mockFighters = [{ name: 'Fighter1' }, { name: 'Fighter2' }];
            FighterService.refreshFighterPool.mockResolvedValue(mockFighters);

            const result = await tournamentService.generateFighters(2);
            expect(FighterService.refreshFighterPool).toHaveBeenCalledWith(2);
            expect(result).toEqual(mockFighters);
        });

        it('should throw an error if there is an issue', async () => {
            FighterService.refreshFighterPool.mockRejectedValue(new Error('Error generating fighters'));

            await expect(tournamentService.generateFighters()).rejects.toThrow('Error generating fighters');
        });
    });

    describe('createTournament', () => {
        it('should create a tournament', async () => {
            const mockFighters = ['fighter1', 'fighter2'];
            const mockArena = 'arena1';
            const mockFights = ['fight1', 'fight2'];
            FightService.createFights.mockResolvedValue(mockFights);
            Tournament.prototype.save = jest.fn().mockResolvedValue();

            const result = await tournamentService.createTournament(mockFighters, mockArena);
            expect(FightService.createFights).toHaveBeenCalledWith(mockFighters, mockArena);
            expect(Tournament.prototype.save).toHaveBeenCalled();
            expect(result).toEqual(expect.objectContaining({
                name: 'Gateway Tournament',
                fighters: mockFighters,
                fights: mockFights,
                arena: mockArena,
            }));
        });
    });

    describe('createRefreshTournament', () => {
        it('should create a refresh tournament', async () => {
            const size = 16;
            const mockArena = 'arena1';
            const mockFighters = ['fighter1', 'fighter2'];
            FighterService.refreshFighterPool.mockResolvedValue(mockFighters);
            Tournament.prototype.save = jest.fn().mockResolvedValue();

            const result = await tournamentService.createRefreshTournament(size, mockArena);
            expect(FighterService.refreshFighterPool).toHaveBeenCalledWith(size);
            expect(result).toEqual(expect.objectContaining({
                name: 'Gateway Tournament',
                fighters: mockFighters,
                arena: mockArena,
            }));
        });
    });

    // Add additional tests for nextRound and simulate methods as needed
});

