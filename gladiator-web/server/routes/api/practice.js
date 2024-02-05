var mongoose = require('mongoose');
var router = require('express').Router();
var Practice = mongoose.model('PracticePerson');

//Post Method
router.post('/createNewPerson', async (req, res) => {
  const data = new Practice({
    name: req.body.name,
    age: req.body.age
  })
  try {
    const dataToSave = await data.save();
    res.status(200).json(dataToSave)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

//Get all Method
router.get('/getAll', async (req, res) => {
  try {
    const data = await Practice.find();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

//Get by ID Method
router.get('/getById/:id', async (req, res) => {
  try {
    const data = await Practice.findById(req.params.id);
    res.json(data)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

//Get by Name Method
router.get('/getByName/:name', async (req, res) => {
  try {
    const data = await Practice.find({
      name: req.params.name
    })
    res.json(data)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

//Update by ID Method
router.patch('/updateAge/:name', async (req, res) => {
  try {
    const searchName = req.params.name;
    const updatedData = req.body.age;
    const options = { new: true };

    const result = await Practice.updateMany(
      { name: searchName },
      { age: updatedData },
      options
    );
    res.send(result)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

//Delete by ID Method
router.delete('/delete/:name', async (req, res) => {
  try {
    const nameToDelete = req.params.name;
    const data = await Practice.findOneAndDelete({
      name: nameToDelete
    })
    res.send(`Document with ${data.name} has been deleted..`)
  } catch (error) {
    res.status(400).json({ message: error.message })
  }
})

module.exports = router;