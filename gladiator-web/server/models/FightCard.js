const mongoose = require('mongoose');
const { Schema } = mongoose;

const FightCardStatusTypes = {

}

const FightCard = new Schema({
    name: {
        type: String,
        default: "",
    },
    scheduledDate:{
        type: Date,
    },
    arena: {
        type: Schema.Types.ObjectId,
        ref: 'Arena'
    },
    promotion: {
        type: Schema.Types.ObjectId,
        ref: 'Promotion'
    },
    fightCardStatus:{
        type: String,
        enum: Object.values(FightCardStatusTypes)
    },
    fights:[{
        type: Schema.Types.ObjectId,
        ref: "Fights",
    }],
})