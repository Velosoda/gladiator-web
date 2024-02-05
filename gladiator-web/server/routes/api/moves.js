var router = require('express').Router();
const MoveService = require('../../services/MoveService');

router.get('/test', async (req, res) => {
    console.log("test!");
    res.json("Endpoint Parent Works");
    return;
})

router.post('/refresh', async (req, res) => {
    try {
        const data = await MoveService.refreshMoves();
        res.json(data)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
});

module.exports = router;