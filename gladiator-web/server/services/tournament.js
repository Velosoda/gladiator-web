var mongoose = require('mongoose');
const { CombatCategoryTypes } = require('../models/Fighter');

const Tournament = mongoose.model('Tournament');
const Fighter = mongoose.model('Fighter');
const Fight = mongoose.model('Fight');
const Arena = mongoose.model('Arena');

const FightService = new (require("./fight"))();
const FighterService = new (require('./fighter'))();

class TournamentService {
    async getEntryLevelArena(){
        try {
            const fighters = await Fighter.aggregate([
                { $sample: { size: count } } // Randomly selects 'count' number of fighters
            ]);
            return fighters 
        }
        catch (error){
            console.error("Error fetching random fighters:", error);
            throw error;        }
    }

    async generateFighters(count = 16){
        try {
            return await FighterService.refreshFighterPool(count);
        }
        catch(e){
            console.error("Issue Generating fighters ");
            throw e;
        }
    }

    async createTournament(fighters, arena) { 
        const fights = await FightService.createFights(fighters, arena);

        const newTournament = await new Tournament({
            name: 'Gateway Tournament',
            fighters: fighters,
            fights: fights,
            arena: arena,
        });

        await newTournament.save();
        return newTournament;
    }

    async createRefreshTournament(size, arena) {
        const fighters = await FighterService.refreshFighterPool(size);
        const newTournament = await this.createTournament(fighters, arena)
        await newTournament.save();
        if(newTournament === null) {
            throw {name : "tournament never created", }; 
        }
        return newTournament;
    }
    
    async createTournamentWithExistingFighters(count = 16, arena){
        const fighters = await FighterService.getExistingFighters(count);
        const newTournament = await this.createTournament(fighters, arena)
        await newTournament.save();
        return newTournament;
        
    }

    async run(tournament) {
        let round = 0;
    
        while (tournament.fighters.length > 1) {
            let winners = [];
    
            for (const fightId of tournament.fights[round]) {
                const fight = await Fight.findById(fightId);
                await fight.simulate();
                winners.push(fight.winners[0]);
            }
    
            tournament.fights.push(await FightService.createFights(winners, tournament.arena)); // we have to add the combattypes
            tournament.fighters = winners;
            round++;
            console.log({round}, tournament.arena)
        }
    
        await tournament.save();
        return tournament;
    }

    createAndSimulate(size = 16, newFighters = true) {
        //Grab fighters that have not participated in any fights
        //only get a certain threshold 16, 32, 64, (125?) power of 2
        //Randomly pick this
        //Fill the fighter array with these ^ guys
        let fighters;
        if(newFighters){
            fighters = this.generateFighters(size);
        }
        else {
            fighters = this.getNewFighters(size);
        }

        //Generate a tournament
        //Set  up the fights
        //ex fighters = [1,2,3,4] -> 
        //  generateFights() -> 
        //      (0,1)=fight[0] (2,3)=fight[1] 
        //
        //they can be organized in order who cares
        const tournament = this.createTournament(fighters, getEntryLevelArena());

        //Run the Fights
        //when theres only one gut left in fighters the tournament is over
        //Winner of stay in fighters, Loser gets removed from fighters
        const winner = this.nextRound(tournament).fighters[0];
        


        return {fighters, tournament, winner}
    }
    async simulate(tournament){
        // get tournament
        const currentTournament = await Tournament.findById(tournament)

        if (currentTournament != null){
            return await this.run(currentTournament)
        }

        else return null
    }   
}

module.exports = TournamentService;
