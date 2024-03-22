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
});

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
};

FightFloorSchema.methods.getFighterCords = function (fighterId) {
    return GetFighterCords(fighterId, this);
};

function GetFighterCords (fighterId, fightFloor){
    for (let rowIndex = 0; rowIndex < fightFloor.grid.length; rowIndex++) {
        const row = fightFloor.grid[rowIndex];
        for (let colIndex = 0; colIndex < row.length; colIndex++) {
            const cell = row[colIndex];

            if (cell.markers.some((marker) => (marker.type === MarkerTypes.Fighter) && (marker.value === fighterId))){
                return cell;
            }
        }
    }
}

FightFloorSchema.methods.move = async function(fighter, cord) {
    const startingLocation = GetFighterCords(fighter._id, this);
    
    console.log({startingLocation, cord})

    let markerToAdd;
    //remove fighter from marker
    this.grid[startingLocation.cords.y][startingLocation.cords.x].markers.forEach((marker)=> {
        if(marker.type === MarkerTypes.Fighter){

            markerToAdd = marker
            this.grid[startingLocation.cords.y][startingLocation.cords.x].markers.remove(marker);
        }
    });

    //add the fighter to the new marker
    this.grid[cord.y][cord.x].markers.push(markerToAdd);

    await this.save();
    return this;
};

FightFloorSchema.methods.rangeToOpponent = function(startX, startY) {
    const rows = this.grid.length;
    const cols = this.grid[0].length;
    const currentFighterMarker = this.grid[startY][startX].markers.find((marker) =>{
        if(marker.type === MarkerTypes.Fighter){
            return marker.value;
        }
    });
    
    const visited = new Set();
    const queue = [{ x: startX, y: startY, stepsX: 0, stepsY: 0}];
    
    while (queue.length > 0) {
        const { x, y, stepsX, stepsY} = queue.shift();
        
        visited.add(`${x},${y}`);

        // Check if the cell has a marker
        for (const marker of this.grid[y][x].markers) {
            if (marker.type === MarkerTypes.Fighter && marker.value != currentFighterMarker.value){
                return {
                    x,
                    y, 
                    stepsX,
                    stepsY,
                    opponentId: marker.value
                };
            }
        }
        
        const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
       
        for (const [dx, dy] of directions) {
            const nx = x + dx;
            const ny = y + dy;
            
            if (nx >= 0 && nx < cols && ny >= 0 && ny < rows && !visited.has(`${nx},${ny}`)) {
                visited.add(`${nx},${ny}`);
                queue.push({ x: nx, y: ny, stepsX: stepsX + dx, stepsY: stepsY + dy });
            }
        }
    }
    return null;
};

module.exports = mongoose.model('FightFloor', FightFloorSchema);
module.exports = mongoose.model('Marker', MarkerSchema);
module.exports = {
    MarkerTypes
}