var mongoose = require('mongoose');

const Arena = mongoose.model('Arena');

class AreneService {

    async getArena(name){
        return await Arena.find({name: name});
    }

    async updateEntryLevelArena(){
        return await Arena.updateEntryLevelArena();
    }
}

module.exports = AreneService;