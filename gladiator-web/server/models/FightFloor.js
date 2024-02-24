const mongoose = require('mongoose');
const { Schema } = mongoose;


const FightFloorTerrainTypes = {
    CombatArea: 0,
    CriticalDamageArea: 1,
    KnockoutArea: 2,
    Wall: 3,
    Boundry: 4
};


const MarkerTypes = {
    None: 'None',
    Corner: 'Corner',
    Fighter: 'Fighter',
}
const MarkerSchema = new Schema({
    name: {
        type: String,
        default: ""
    },
    value: {
        type: String, //This should be a ref
    },
    type: {
        type: String,
        enum: Object.values(MarkerTypes)
    },
})

const CellSchema = new Schema({
    terrain: {
        enum: Object.values(FightFloorTerrainTypes),
    },
    cords: {
        x: { type: Number, default: 0 },
        y: { type: Number, default: 0 }
    },
    markers: [MarkerSchema],
    issues: { type: Array, default: [] }
});

const FightFloorSchema = new Schema({
    size: {
        type: Number,
        default: 9
    },
    sizeExponent: { // on the slider the number of ticks on the slider is the exponent
        type: Number,
        default: 1
    },
    grid: [[CellSchema]],
})

FightFloorSchema.methods.addFighters = async function (fighters) {
    fighters.forEach((fighter) => {
        for (let yIndex = 0; yIndex < this.grid.length; yIndex++) {
            const row = this.grid[yIndex];
            for (let xIndex = 0; xIndex < row.length; xIndex++) {
                const cell = row[xIndex];
                const hasCornerMarker = cell.markers.some(marker => marker.type === "Corner");
                const hasFighterMarker = cell.markers.some(marker => marker.type === "Fighter");
                if (hasCornerMarker && hasFighterMarker === false) {
                    cell.markers.push({
                        name: fighter.name,
                        value: fighter._id,
                        type: MarkerTypes.Fighter
                    })
                    break;
                }
            }
        }
    });
    return await this.save();
}

FightFloorSchema.methods.getFighterCords = function (fighter) {
    for (let rowIndex = 0; rowIndex < this.grid.length; rowIndex++) {
        const row = this.grid[rowIndex];
        for (let colIndex = 0; colIndex < row.length; colIndex++) {
            const cell = row[colIndex];

            if (cell.markers.some(marker => marker.type === MarkerTypes.Fighter && marker.value === fighter._id)) {
                return cell;
            }
        }
    }
}

FightFloorSchema.methods.rangeToOpponent = function (fromX, fromY) {
    const queue = [{ xIndex: fromY, yIndex: fromX, distance: 0 }];
    const visited = new Set();

    let xModifications = 0;
    let yModifications = 0;
    let opponentX = 0;
    let opponentY = 0;
    let opponentId = null;

    while (queue.length > 0) {
        const { xIndex, yIndex, distance } = queue.shift();
        const cell = this.grid[yIndex][xIndex];

        // Check if the cell has a marker
        for (const marker of cell.markers) {
            if (marker.type === MarkerTypes.Fighter) {
                opponentX = xIndex;
                opponentY = yIndex;
                opponentId = marker.value;
                // Calculate xModifications and yModifications based on the direction of movement
                xModifications = opponentX - fromX;
                yModifications = opponentY - fromY;

                //return values should be how humans interperate x and y
                return { opponentX, opponentY, distance, xModifications, yModifications, opponentId };
            }
        }

        // Enqueue neighboring cells
        for (const [dx, dy] of [[0, -1], [0, 1], [-1, 0], [1, 0]]) {
            const nx = yIndex + dy;
            const ny = xIndex + dx;
            const key = `${nx},${ny}`;
            if (nx >= 0 && nx < this.grid.length && ny >= 0 && ny < this.grid[0].length && !visited.has(key)) {
                visited.add(key);
                queue.push({ xIndex: nx, yIndex: ny, distance: distance + 1 });
            }
        }
    }

    // If no marker is found
    return null;
}




module.exports = mongoose.model('FightFloor', FightFloorSchema);
module.exports = mongoose.model('Marker', MarkerSchema);
module.exports = {
    MarkerTypes
}