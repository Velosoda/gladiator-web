const Move = require('../models/Move');

class MoveService {
    static async getAllMoves() {
        try {
            const moves = Move.find();
            return moves;
        } catch (error){
            console.error('Error fetching items:', error);
            throw error;
        }
    }
    
    static async getMoveByName(name) {
        try {
            const move = await Move.findOne({name: name});
            
            if (move){
                return move;
            }
            else {
                console.log(`Move ${name} not found.`);
            } 
        }catch(error){
            console.log(`Error with looking for move ${name} : ${error}`);
        }
    }
    
    static async refreshMoves() {
        try { 
            return Move.Refresh();
        } catch(error){ 
            console.log(`issue with refreshing the moves : ${error}` );
            throw error;
        }
    }
}

module.exports = MoveService;
