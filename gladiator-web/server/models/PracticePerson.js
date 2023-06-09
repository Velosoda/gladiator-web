const mongoose = require('mongoose');

const practicePersonSchema = new mongoose.Schema({
    name: {
        required: true,
        type: String
    },
    age: {
        required: true,
        type: Number
    }
});

module.exports = mongoose.model('PracticePerson', practicePersonSchema);
