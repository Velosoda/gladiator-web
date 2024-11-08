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

    async nextRound(tournament, round){
        if(tournament.fighters == 1){
            return tournament;
        }

        for(let i = 0; i < tournament.fights[round]; i++){
            const fightId = tournament.fights[round][i]; //this will be fight ids only so we need to do something else
            const fight = await Fight.find({_id: fightId});

            fight.simulate(tournament.arena);

            tournament.fighters = tournament.fighters.filter(fighter => fighter !== fight.loser);
        }

        tournament.fights.push(await fightService.createFights(tournament.fighters));
        nextRound(tournament, round + 1); 
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

        const currentTournament = await Tournament.find({_id: tournament})

        return winner = this.nextRound(currentTournament).fighters[0];
    }   
}

module.exports = TournamentService;
