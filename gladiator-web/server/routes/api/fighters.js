var router = require('express').Router();

const FighterService = require('../../services/fighterService');

router.get('/test', async (req, res) => {
    console.log("test!");
    res.json("Endpoint Parent Works");
    return;
})

router.post('/refresh', async (req, res) => {
    try {
        const data = await FighterService.refreshFighterPool(2);
        res.json(data);

    } catch (error) {
        res.status(500).json({ message: error.message })
    }
});

router.get('/:fighterId', async (req, res) => {
    try {
        const { fighterId } = req.params;

        //Check to see if fighter exists
        const fighter = await FighterService.getFighterById(fighterId);
        if (fighter == null) {
            res.json(null);
        }
        res.json(fighter);
        return fighter;
    } catch (error) {
        res.status(500).json({ message: error.message })
        throw error;
    }
});

router.get('/:fighterId/disciplineAvg', async (req, res) => {
    try {
        const { fighterId } = req.params;

        //Check to see if fighter exists
        const fighter = await FighterService.getFighterById(fighterId);
        if (fighter == null) {
            res.json(null);
        }

        const disciplineAvg = FighterService.getCombatSkillAverage(fighter);
        res.json(disciplineAvg);
        return disciplineAvg;
    } catch (error) {
        res.status(500).json({ message: error.message })
        throw error;
    }
});

router.get('/:fighterId/combatSkills', async (req, res) => {
    try {
        const { fighterId } = req.params;

        //Check to see if fighter exists
        const fighter = await FighterService.getFighterById(fighterId);
        if (fighter == null) {
            res.json(null);
        }

        res.json(fighter.combatSkills);
        return fighter.combatSkills;
    } catch (error) {
        res.status(500).json({ message: error.message })
        throw error;
    }
});


module.exports = router;