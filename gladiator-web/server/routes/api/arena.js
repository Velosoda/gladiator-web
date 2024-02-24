var router = require('express').Router();

const ArenaService = require("../../services/arenaService");
var service = new ArenaService();

router.get('/test', async(req, res) => {
    console.log("Arena route Connected");
});

router.patch('/entryLevelArena/update', async(req, res) => {
    res.setHeader('Content-Type', 'application/json');
    try {
        const updatedArena = await service.updateEntryLevelArena();
        
        res.status(200).json({ message: 'Success', data: { updatedArena } });
    } catch (error) {
        throw error;
    }
});

module.exports = router;