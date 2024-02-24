const FightFloor = require('../models/FightFloor');
const asyncHandler = require('express-async-handler');

const createFightFloor = asyncHandler(async (req, res) => {

    const { fightFloor } = req.body.fightFloor 

    const floor = new FightFloor({
        fightFloor: fightFloor 
    });

    await floor.save();

    return res.status(200).json({
        floor
    });

});


module.exports = {
    createFightFloor,
}