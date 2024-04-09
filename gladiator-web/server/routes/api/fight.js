var router = require('express').Router();

const FightService = require("../../services/fightService");
var service = new FightService();

router.get('/test', async(req, res) => {
    console.log("fight route Connected");
});

router.post('/create', async (req, res) => {
    try {
        const { fighters, combatCategory } = req.body;

        const fight = await service.createFights(fighters);

        res.status(200).json({ message: 'Success', data: { fight } });
    } catch (error) {
        // If an error occurs, send an error response
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;