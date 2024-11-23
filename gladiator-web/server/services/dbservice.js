var mongoose = require('mongoose');

const Fighter = mongoose.model('Fighter');
const Fight = mongoose.model('Fight');
const Tournament = mongoose.model('Tournament');
const Move = mongoose.model('Move');

class DBService {
    async removeFighters() {
        try {
            console.log("removing fighters ")
            return await Fighter.deleteMany({});
        } catch (e) {
            console.log("Error removing all Fighters, ", e)
        }
    }

    async removeTournaments() {
        try {
            return await Tournament.deleteMany({});
        } catch (e) {
            console.log("Error removing all Tournaments, ", e)
        }
    }

    async removeMoves() {
        try {
            return await Move.deleteMany({});
        } catch (e) {
            console.log("Error removing all Moves, ", e)
        }
    }

    async removeFights() {
        try {
            return await Fight.deleteMany({});
        } catch (e) {
            console.log("Error removing all Fights, ", e)
        }
    }

    async removeAllObjects() {
        try {
            await this.removeFighters();
            await this.removeTournaments();
            // await this.removeMoves();
            await this.removeFights();

        } catch (e) {
            console.log("Error removing all Objects , ", e)
        }
    }

}

module.exports = DBService;