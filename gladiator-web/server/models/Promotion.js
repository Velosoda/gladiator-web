const mongoose = require('mongoose');
const { Schema } = mongoose;


const PromotionSchema = new Schema({

    name: {
        type: String,
        default: ""
    },
    popularity: {
        type: Number,
        default: 0
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    roster: [{
        type: Schema.Types.ObjectId,
        ref: 'Fighter'
    }],
})