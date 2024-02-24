var router = require('express').Router();

const TournamentService = require("../../services/tournamentService");
var service = new TournamentService();

router.get('/test', async(req, res) => {
    console.log("tournament route Connected");
});

router.post('/create', async(req, res)=> {
    try {
        const { arena } = req.body;
        const fighters = await service.getNewFighters();
        const tournament = await service.createTournament(fighters, arena);
        
        res.status(200).json({ message: 'Success', data: { tournament } });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
})


router.post('/:tournament/simulate', async(req,res) => {
    res.setHeader('Content-Type', 'application/json');
    try {
        const { tournament } = req.params;
        
        const result = await service.simulate( tournament );
        
        res.status(200).json({ message: 'Success', data: { result } });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


module.exports = router;