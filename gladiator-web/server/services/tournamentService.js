var mongoose = require('mongoose');
const { CombatCategoryTypes } = require('../models/Fighter');

const Tournament = mongoose.model('Tournament');
const Fighter = mongoose.model('Fighter');
const Fight = mongoose.model('Fight');
const Arena = mongoose.model('Arena');

const FightService = require('../services/fightService');
var fightService = new FightService();

class TournamentService {
    async getEntryLevelArena(){
        try {
            return await Arena.find({ name: "Entry Level Arena"});
        }
        catch (error){
            console.error("issue Getting the entry level arena");
            throw error;
        }
    }

    async getNewFighters(count = 16) {
        try {
            return await Fighter.find({ pastFights: { $exists: true, $size: 0 } }, '_id').limit(count);
        } catch (error) {
            console.error('Issue with getting fighters for request:', error);
            throw error;
        }
    }

    async createTournament(fighters, arena) { // must pass fighters as ids 
        const fights = await fightService.createFights(fighters);

        // const arena = await Arena.find({ _id: arena});

        // Tournament.countDocuments({ name:  })
        //     .then(count => {
        //         console.log(`Number of tournaments with the name "${tournamentName}": ${count}`);
        //     })
        //     .catch(error => {
        //         console.error('Error:', error);
        //     });

        const newTournament = await new Tournament({
            name: 'Gateway Tournament',
            fighters: fighters,
            fights: fights,
            arena: arena,
        });
        await newTournament.save();
        return newTournament;
    }

    async nextRound(tournament, round){
        if(tournament.fighters == 1){
            return tournament;
        }

        for(let i = 0; i < tournament.fights[round]; i++){
            const fightId = tournament.fights[rount][i]; //this will be fight ids only so we need to do something else
            const fight = await Fight.find({_id: fightId});

            fight.simulate(tournament.arena);

            tournament.fighters = tournament.fighters.filter(fighter => fighter !== fight.loser);
        }

        tournament.fights.push(await fightService.createFights(tournament.fighters));
        nextRound(tournament, round + 1); 
    }

    createAndSimulate(size = 16) {
        //Grab fighters that have not participated in any fights
        //only get a certain threshold 16, 32, 64, (125?) power of 2
        //Randomly pick this
        //Fill the fighter array with these ^ guys
        const fighters = this.getNewFighters(size);

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