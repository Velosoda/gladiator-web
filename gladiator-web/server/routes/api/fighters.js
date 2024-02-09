var router = require('express').Router();

const FighterService = require('../../services/fighterService');
var service = new FighterService();

router.get('/test', async (req, res) => {
    console.log("test!");
    res.json("Endpoint Parent Works");
    return;
})

router.put('/refresh', async (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    try {
        const data = await service.refreshFighterPool();
        res.json(data);
        
        return data;
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
});
router.put('/refresh/:count', async (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    try {
        const { count } = req.params;
        const data = await service.refreshFighterPool(count);
        
        res.json(data);
        return data;
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
});

router.get('/:fighterId', async (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    try {
        const { fighterId } = req.params;
        
        //Check to see if fighter exists
        const fighter = await service.getFighterById(fighterId);
        if (fighter == null) {
            res.json(null);
        }
        res.json(fighter);
        return JSON.stringify(fighter);;
    } catch (error) {
        res.status(500).json({ message: error.message })
        throw error;
    }
});

router.get('/:fighterId/disciplineAvg', async (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    try {
        const { fighterId } = req.params;
        
        //Check to see if fighter exists
        const fighter = await service.getFighterById(fighterId);
        if (fighter == null) {
            res.json(null);
        }
        
        const disciplineAvg = service.getCombatSkillAverage(fighter);
        res.json(disciplineAvg);
        return disciplineAvg;
    } catch (error) {
        res.status(500).json({ message: error.message })
        throw error;
    }
});

router.get('/:fighterId/combatSkills', async (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    try {
        const { fighterId } = req.params;

        //Check to see if fighter exists
        const fighter = await service.getFighterById(fighterId);
        if (fighter == null) {
            res.json(null);
        }

        res.json(fighter.combatSkills);
        return JSON.stringify(fighter);
    } catch (error) {
        res.status(500).json({ message: error.message })
        throw error;
    }
});


module.exports = router;