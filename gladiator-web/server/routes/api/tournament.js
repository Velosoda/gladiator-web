var router = require('express').Router();

const TournamentService = new (require("../../services/tournament"))();
const FighterService = new (require('../../services/fighter'))();


router.post('/create', async(req, res)=> {
    try {
        const { arena, fighters } = req.body;
        const tournament = await TournamentService.createTournament(fighters, arena);
        
        res.status(200).json({ message: 'Success', data: { tournament } });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
// router.post('/create/:size', async(req, res)=> {
//     try {
//         const { size } = req.params
//         const { arena } = req.body;
//         const tournament = await TournamentService.createTournamentWithExistingFighters(size, arena);
        
//         res.status(200).json({ message: 'Success', data: { tournament } });
//     } catch (error) {
//         console.error('Error:', error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// });

router.post('/create/refreshTournament', async (req, res) => {
    let tournament;
    try {
        const { size, arena } = req.body;
        const fighters = await FighterService.refreshFighterPool(size);
        // const fighters = await Promise.all(FighterService.refreshFighterPool(size));

        tournament = await TournamentService.createTournament(fighters, arena);
        
        res.status(200).json({ message: 'Success', data: { tournament } });
    } catch (error) {
        console.error('Error in refreshing tournament:', error);
        res.status(500).json({ error: 'Internal Server Error '+error , tournament:tournament });
    }
    return tournament
});

router.post('/:tournament/simulate', async(req,res) => {
    res.setHeader('Content-Type', 'application/json');
    try {
        const { tournament } = req.params;
        
        const result = await TournamentService.simulate( tournament );
        
        res.status(200).json({ message: 'Success', data: { result } });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


module.exports = router;