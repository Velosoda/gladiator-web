const mongoose = require('mongoose');
const { Schema } = mongoose;

const FightFloorTerrainTypes = {
    CombatArea: "CombatArea",
    CriticalDamageArea: "CriticalDamageArea",
    KnockoutArea: "KnockoutArea",
    Wall: "Wall",
    Boundry: "Boundry" 
};

const MarkerTypes = {
    None: 'None',
    Corner: 'Corner',
    Fighter: 'Fighter',
};

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
});

const CellSchema = new Schema({
    terrain: {
        type: String,
        enum: Object.values(FightFloorTerrainTypes),
        default: FightFloorTerrainTypes.CombatArea
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

FightFloorSchema.methods.getCellsByMarkerType = function (markerType) {
    let cellsWithMarker = [];

    // Loop through each row
    for (let i = 0; i < this.grid.length; i++) {
        const row = this.grid[i];

        // Loop through each cell in the row
        for (let j = 0; j < row.length; j++) {
            const cell = row[j];
            for (let m = 0; m < cell.markers.length; m++) {
                const marker = cell.markers[m];
                if (marker.type === markerType.toString()) {
                    cellsWithMarker.push(cell);
                }
            }
        }
    }

    return cellsWithMarker;
}

FightFloorSchema.methods.addFighters = async function (fighters) {
    const gridWidth = this.grid[0].length - 1;
    const gridHeight = this.grid.length - 1;

    let remainingFighters = [...fighters];

    //array of corners
    let corners = this.getCellsByMarkerType(MarkerTypes.Corner).map(cell => cell.cords);

    corners.forEach((cord) => {
        const selectedFighter = remainingFighters.shift();

        this.grid[cord.y][cord.x].markers.push({
            name: selectedFighter.name,
            value: selectedFighter._id,
            type: MarkerTypes.Fighter
        });
    })

    if (remainingFighters.length > 0) {
        let isInList

        // Repeat until we find a coordinate not in the list
        do {
            // Generate random coordinates
            const x = Math.floor(Math.random() * gridWidth); // maxX is the maximum x value allowed
            const y = Math.floor(Math.random() * gridHeight); // maxY is the maximum y value allowed

            // Check if the generated coordinates are in the list
            isInList = corners.some((corner) => corner.x === x && corner.y === y);

            // If the coordinates are not in the list, set randomCoordinate and exit the loop
            if (!isInList && (this.grid[y][x].markers.length === 0 ||
                this.grid[y][x].markers.some((marker) => marker.type != MarkerTypes.Fighter.toString()))
            ) {
                const leftOverFighter = remainingFighters.shift();

                this.grid[y][x].markers.push({
                    name: leftOverFighter.name,
                    value: leftOverFighter._id,
                    type: MarkerTypes.Fighter
                });
            }
            else {
                corners.push({ x, y });
            }
        } while (isInList || remainingFighters.length > 0);
    }

    return await this.save();
};

FightFloorSchema.methods.getFighterCords = function (fighterId) {
    for (let rowIndex = 0; rowIndex < this.grid.length; rowIndex++) {
        const row = this.grid[rowIndex];
        for (let colIndex = 0; colIndex < row.length; colIndex++) {
            const cell = row[colIndex];
            for (let i = 0; i < cell.markers.length; i++) {
                const marker = cell.markers[i];
                if (marker.type === MarkerTypes.Fighter && marker.value === fighterId) {
                    return cell;
                }
            }
        }
    }
};

FightFloorSchema.methods.move = async function (fighter, cord) {
    const startingLocation = this.getFighterCords(fighter._id.toString());
    //remove fighter from marker
    this.grid[startingLocation.cords.y][startingLocation.cords.x].markers.forEach((marker) => {
        if (marker.type === MarkerTypes.Fighter) {
            this.grid[startingLocation.cords.y][startingLocation.cords.x].markers.remove(marker); // this isnt working
            
            //add the fighter to the new marker
            this.grid[cord.y][cord.x].markers.push(marker);

            // await this.findOneAndUpdate({ _id: id }, { $set: { grid: newGrid } }, { new: true, upsert: false });
        }
    });
    return await this.save();
};

FightFloorSchema.methods.rangeToNearestFighter = function (currentFighter, startX, startY) {

    const rows = this.grid.length;
    const cols = this.grid[0].length;
    const currentFighterMarker = this.grid[startY][startX].markers.find((marker) => {
        if (marker.type === MarkerTypes.Fighter) {
            return marker.value;
        }
    });

    const visited = new Set();
    const queue = [{ x: startX, y: startY, stepsX: 0, stepsY: 0 }];

    while (queue.length > 0) {
        const { x, y, stepsX, stepsY } = queue.shift();

        visited.add(`${x},${y}`);

        // Check if the cell has a marker
        for (const marker of this.grid[y][x].markers) {
            if (marker.type === MarkerTypes.Fighter && marker.value != currentFighterMarker.value) {
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

FightFloorSchema.methods.getNeighboringCells = function (fromX, fromY) {
    const possibleCords = [
        { x: -1, y: 0 }, // Left
        { x: 1, y: 0 },  // Right
        { x: 0, y: -1 }, // Up
        { x: 0, y: 1 }   // Down
    ]

    let allPossibleCords = [];

    // Loop through possibleCords and push the calculated coordinates to res
    for (const cord of possibleCords) {
        allPossibleCords.push({
            x: fromX + cord.x,
            y: fromY + cord.y
        });
    }

    // Filter the possibleCords based on grid boundaries and cell markers
    let filteredPossibleCords = [];

    for (let i = 0; i < allPossibleCords.length; i++) {
        const cord = allPossibleCords[i];
        // console.log({cord})
        if (cord.x >= 0 && cord.y >= 0 && cord.y < this.grid.length && cord.x < this.grid[cord.y].length) {
            const cell = this.grid[cord.y][cord.x];
            // if (cell.markers.length > 0) {
            //     for (const marker of cell.markers) {
            //         // console.log({ marker }, marker.type != MarkerTypes.Fighter.toString());
            //         if (marker.type != MarkerTypes.Fighter.toString()) {
            //             filteredPossibleCords.push(cell);
            //         }
            //         else {
            //             filteredPossibleCords.push(cell);
            //         }
            //     }
            // }

            filteredPossibleCords.push(cell);
        }
    }

    return filteredPossibleCords;
};
FightFloorSchema.methods.clearFightFloor = function () {
    
};


module.exports = mongoose.model('FightFloor', FightFloorSchema);
module.exports = mongoose.model('Marker', MarkerSchema);
module.exports = mongoose.model('Cell', CellSchema);
module.exports = {
    MarkerTypes, 
    FightFloorTerrainTypes
}