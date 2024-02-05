const mongoose = require('mongoose');

const AttacksSchema = new mongoose.Schema({
    name: String,
    level: Number,
    currentExp: Number,
    expToNextLevel: Number,
    throws: Number,
    targetHits: Number,
    hits: Number,
    misses: Number,
    damage: Number,
    hitRate: Number,
    targetHitRate: Number,
    missRate: Number,
});

module.exports = mongoose.model('Attack', AttacksSchema);
