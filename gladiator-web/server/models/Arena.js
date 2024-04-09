const mongoose = require('mongoose');
const { Schema } = mongoose;


const FightFloor = require('../models/FightFloor');

const EntryLevelFightFloor = {
    grid: [
        [
            {
                terrain: 0,
                cords: {
                    x: 0,
                    y: 0
                },
                markers: [],
                issues: [],
            },
            {
                terrain: 0,
                cords: {
                    x: 0,
                    y: 1
                },
                markers: [],
                issues: [],
            },
            {
                terrain: 0,
                cords: {
                    x: 0,
                    y: 2
                },
                markers: [],
                issues: [],
            }
        ],
        [
            {
                terrain: 4,
                cords: {
                    x: 1,
                    y: 0
                },
                markers: [
                    {
                        name: "Red Corner",
                        value: "rc",
                        type: 0
                    }
                ],
                issues: []
            },
            {
                terrain: 0,
                cords: {
                    x: 1,
                    y: 1
                },
                markers: [],
                issues: [],
            },
            {
                terrain: 4,
                cords: {
                    x: 1,
                    y: 2
                },
                markers: [
                    {
                        name: "Blue Corner",
                        value: "bc",
                        type: 1
                    }
                ],
                issues: []
            }
        ],
        [
            {
                terrain: 0,
                cords: {
                    x: 2,
                    y: 0
                },
                markers: [],
                issues: [],
            },
            {
                terrain: 0,
                cords: {
                    x: 2,
                    y: 1
                },
                markers: [],
                issues: [],
            },
            {
                terrain: 0,
                cords: {
                    x: 2,
                    y: 2
                },
                markers: [],
                issues: [],
            }
        ]
    ],
};

const ArenaSchema = new Schema({
    name: {
        type: String,
        default: ""
    },
    seats: {
        type: Number,
        default: 0
    },
    pricePerSeat: {
        type: Number,
        default: 0
    },
    prestige: {
        type: Number,
        default: 0
    },
    arenasCut: {
        type: Number,
        default: 0.0
    },
    fightFloor: {
        type: Schema.Types.ObjectId,
        ref: 'FightFloor'
    },
    pastFights: [{
        type: Schema.Types.ObjectId,
        ref: 'Fight'
    }]
});

ArenaSchema.statics.updateEntryLevelArena = async function () {
    try {
        const entryLevelArena = await this.find({ name: "Entry Level Arena" });
        if (entryLevelArena.length === 0) {
            return await this.create({
                name: "Entry Level Arena",
                seats: 1000,
                pricePerSeat: 10,
                prestige: 0,
                arenasCut: .2,
                fightFloor: await FightFloor.create({ grid: EntryLevelFightFloor.grid }), // Update the fight floor
                pastFights: [],
            })
                .then(doc => console.log(doc))
                .catch(err => console.log(err)); // Save the changes
        }
        return entryLevelArena;
    } catch (error) {
        console.error('Error updating entry level arena:', error);
        throw error; // Re-throw the error to handle it outside
    }
}

module.exports = mongoose.model('Arena', ArenaSchema);
