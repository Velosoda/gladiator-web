import React, { useState, useRef } from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

import WarningIcon from '@mui/icons-material/Warning';

import './ArenaDesigner.css';

// const colorToTerrainMap = {
//     'black': '-', //flat fighting ground
//     'blue': 'xs', //knock out, safely/ minor damage
//     'red': 'xd', //knock out deadly
//     'white': '0', //where the "crowd" is. no white? crowd is still there just shows how small the ring is 
//     'gray': '|'
// }

const TerrainTypes = {
    CombatArea: 0,
    CriticalDamageArea: 1,
    KnockoutArea: 2,
    Wall: 3,
    Boundry: 4
};
const MarkerTypes = {
    RedCorner: 0,
    BlueCorner: 1,
    SomethingElse: 2,
}

const landSeparators = [
    TerrainTypes.CriticalDamageArea,
    TerrainTypes.Boundry,
    TerrainTypes.KnockoutArea,
    TerrainTypes.Wall
]

function detectIslands(grid) {
    const rows = grid.length;
    const cols = grid[0].length;
    let islandCount = 0;

    function isValid(row, col) {
        return (
            row >= 0 &&
            col >= 0 &&
            row < rows &&
            col < cols &&
            !landSeparators.includes(grid[row][col].terrain) &&
            !grid[row][col].visited
        )
    }

    function dfs(row, col) {
        const stack = [];
        stack.push([row, col]);

        while (stack.length > 0) {
            const [currentRow, currentCol] = stack.pop();
            // console.log(stack);

            if (isValid(currentRow, currentCol)) {
                grid[currentRow][currentCol].visited = 'visited'; // Mark the current cell as visited (optional)

                // Add adjacent cells to the stack
                stack.push([currentRow + 1, currentCol]);
                stack.push([currentRow - 1, currentCol]);
                stack.push([currentRow, currentCol + 1]);
                stack.push([currentRow, currentCol - 1]);
            }
        }
    }

    // Traverse the grid
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (!landSeparators.includes(grid[i][j].terrain) && !grid[i][j].visited) {
                // If the cell is land, it's part of an island
                islandCount++;
                dfs(i, j);
            }
        }
    }

    // Reset visited flag after traversal (optional)
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            if (grid[i][j] && !landSeparators.includes(grid[i][j].terrain)) {
                grid[i][j].visited = false;
            }
        }
    }
    console.log("In Function Island Count: ", islandCount);
    return islandCount;
}

const getAdjacentCell = (cell, grid, direction, distance) => {
    const { x, y } = cell.cords;

    if (direction === "north") {
        return grid?.[x + distance]?.[y] ?? null;
    }

    if (direction === "northeast") {
        return grid?.[x + distance]?.[y + distance] ?? null;
    }

    if (direction === "east") {
        return grid?.[x]?.[y + distance] ?? null;
    }

    if (direction === "southeast") {
        return grid?.[x + distance]?.[y - distance] ?? null;
    }

    if (direction === "south") {
        return grid?.[x]?.[y - distance] ?? null;
    }

    if (direction === "southwest") {
        return grid?.[x - distance]?.[y - distance] ?? null;
    }

    if (direction === "west") {
        return grid?.[x - distance]?.[y] ?? null;
    }

    if (direction === "northwest") {
        return grid?.[x - distance]?.[y + distance] ?? null;
    }
};

const PixelDrawingComponent = ({ initialSize, onSubmit }) => {
    const floors =
    {
        [TerrainTypes.CombatArea]: {
            color: 'black',
            name: "Combat Area",
            value: '-',
            validation: (cell) => {
                if (cell.terrain === TerrainTypes.CombatArea) {
                    const up = grid?.[cell.cords.x + 1]?.[cell.cords.y] ?? null;
                    const down = grid?.[cell.cords.x - 1]?.[cell.cords.y] ?? null;
                    const right = grid?.[cell.cords.x]?.[cell.cords.y + 1] ?? null;
                    const left = grid?.[cell.cords.x]?.[cell.cords.y - 1] ?? null;

                    let errors = [];

                    const importantDirections = [up, down, left, right];
                    console.log("Directions", importantDirections);


                    //Checks that theres at least one black upleftrightdown from the currentcell
                    let res = false
                    importantDirections.forEach(direction => {
                        if (direction?.terrain === TerrainTypes.CombatArea) {
                            res = true;
                            console.log(cell, "is ok ");
                        }
                    });
                    if (res === false) {
                        errors.push({
                            location: cell.cords,
                            error: "All Combat Area Tiles should be Connected to another Combat Area Tile"
                        });
                    }
                    cell.issues = errors
                    console.log("Errors Found: ", errors)
                    return cell;
                }
            }
        },
        [TerrainTypes.CriticalDamageArea]: {
            color: '#8a100f',
            name: 'Critical Damage Zone',
            value: 'xd',
            validation: (cell) => { }
        },
        [TerrainTypes.KnockoutArea]: {
            color: '#100f8a',
            name: 'Knock Out Zone',
            value: 'sd',
            validation: (cell) => { }
        },
        [TerrainTypes.Wall]: {
            color: 'gray',
            name: 'Wall',
            value: '|',
            validation: (cell) => { }
        },
        [TerrainTypes.Boundry]: {
            color: 'white',
            name: 'Boundary',
            value: '0',
            validation: (cell) => { }
        },
    }; // Add more colors as needed

    const markers =
    {
        [MarkerTypes.RedCorner]: {
            name: 'Red Corner',
            color: '#8a100f',
            value: 'rc',
            quantity: 1,
            validation: (cell) => {
                if (cell.markers.foreach(marker => marker.value === 'rc')) {
                    //Check for black middle 
                    const directions = ["north", "northeast", "east", "southeast", "south", "southwest", "west", "northwest"];

                    //This checks to see what tiles surrounding this marker are fight floors
                    const surroundingFightFloors = directions.some(
                        direction => getAdjacentCell(cell, grid, direction, 1)?.terrain === TerrainTypes.CombatArea
                    );

                    console.log("Surrounding Fight Floors RC: ", surroundingFightFloors)
                    //check the surrounding fight floors to see if there is a corner

                    //check to see if this is null / empty return error
                    // if (fightFloorCellsFound.length == 0) return {
                    //     location: cell.cords,
                    //     error: "There must be at most 1 Fight Floor Cell between corners"
                    // }
                    // else {
                    //     for (let i = 0; i < fightFloorCellsFound.length; i++) {
                    //         const cellsNextToFightFloors = [
                    //             goUp(fightFloorCellsFound[i], grid, 1)?.markers.some((marker) => marker.value == 'bc'),
                    //             goDown(fightFloorCellsFound[i], grid, 1)?.markers.some((marker) => marker.value == 'bc'),
                    //             goLeft(fightFloorCellsFound[i], grid, 1)?.markers.some((marker) => marker.value == 'bc'),
                    //             goRight(fightFloorCellsFound[i], grid, 1)?.markers.some((marker) => marker.value == 'bc')
                    //         ];

                    //         for (let j = 0; j < cellsNextToFightFloors.length; j++) {
                    //             const currentCell = cellsNextToFightFloors[j];
                    //             for (let m = 0; m < currentCell.markers.length; m++) {
                    //                 const marker = currentCell.markers[m];
                    //                 if (marker.value === 'bc') {
                    //                     return true;
                    //                 }
                    //             }
                    //         }
                    //     }
                    //     return {
                    //         location: cell.cords,
                    //         error: "No opposite Corner found in correct place"
                    //     }
                    // }
                }
            }
        },
        [MarkerTypes.BlueCorner]: {
            name: 'Blue Corner',
            color: '#100f8a',
            value: 'bc',
            quantity: 1,
        }
    }

    const [floorSelection, setFloorSelection] = useState(TerrainTypes.CombatArea);
    const [isMouseDown, setMouseDown] = useState(false);
    const [settingMarker, setSettingMarker] = useState(null);
    const [islands, setIslands] = useState(0);
    const [hoveredCell, setHoveredCell] = useState(null);
    const [validationErrors, setValidationErrors] = useState([]);
    const [size, setSize] = useState(initialSize);
    const [gridErrors, setGridErrors] = useState([]);
    const [grid, setGrid] = useState(() => {
        return Array.from({ length: size }, (_, row) => Array.from({ length: size }, (_, col) => ({
            terrain: TerrainTypes.Boundry,
            color: 'white',
            cords: {
                x: row,
                y: col,
            },
            markers: [],
            issues: []
        })))
    });

    const canvasRef = useRef(null);

    const handleCellClick = (cell) => {
        const { x, y } = cell.cords
        if (settingMarker !== null) {
            console.log(cell);

            //checks to see if this mark that we are trying to add and have selected already exists in the grid
            const foundMarker = findMarker(settingMarker);
            const updatedGrid = grid.map((row) => row.slice());

            if (foundMarker !== null) {
                //remove the marker and continue
                const markedCell = updatedGrid[foundMarker.cords.x][foundMarker.cords.y]
                markedCell.markers.splice(foundMarker.index, 1);
                markedCell.color = 'white';
                markedCell.terrain = TerrainTypes.Boundry;
            }
            const markerToAdd = markers[settingMarker];

            updatedGrid[x][y].markers.push({
                color: markerToAdd.color,
                name: markerToAdd.name,
                value: markerToAdd.value,
                type: settingMarker
            });
            console.log("Cell Click.cellMArkers", updatedGrid[x][y].markers);

            updatedGrid[x][y].terrain = TerrainTypes.Boundry;
            updatedGrid[x][y].color = 'black';
            // validateGrid(updatedGrid);
            setGrid(updatedGrid);
        }
        else {
            const updatedGrid = grid.map((row) => row.slice());
            updatedGrid[x][y].terrain = floorSelection;
            updatedGrid[x][y].color = floors[floorSelection].color;
            // validateGrid(updatedGrid);
            setGrid(updatedGrid);
        }
    };
    const handleMouseEnter = (cell) => {
        setHoveredCell(cell);

        const { x, y } = cell.cords
        if (isMouseDown && settingMarker === null) {

            //check to see if we selected the corner
            //check if theres already a corner placed 
            //if not set the corner value to the right thing, set the color to the previously used color
            //if theres one already 

            //console.log({ 'x': x, 'y': y });
            const updatedGrid = grid.map((row) => row.slice());
            updatedGrid[x][y].terrain = floorSelection;
            updatedGrid[x][y].color = floors[floorSelection].color;
            // validateGrid(updatedGrid);
            setGrid(updatedGrid);
        }
    };

    const handleMouseLeave = (event) => {
        setHoveredCell(null);
        setMouseDown(false);
        // console.log("out")
    };

    const handleFloorChange = (event) => {
        console.log("New Floor Change", floors[event.target.value]);
        setFloorSelection(event.target.value);
    };

    const handleSizeChange = (event, newSize) => {
        const updatedSize = Math.max(1, newSize); // Ensure the size is at least 1
        setSize(updatedSize);
        setGrid(
            Array.from({ length: updatedSize }, (_, row) => Array.from({ length: updatedSize }, (_, col) => ({
                terrain: TerrainTypes.Boundry,
                color: 'white',
                cords: {
                    x: row,
                    y: col,
                },
                markers: [],
                issues: []
            }))));
    };

    const handleSubmit = () => {
        validateGrid();
        onSubmit(grid);
    };

    const handleMouseDown = (event, cell) => {
        event.preventDefault();
        setMouseDown(true)
        console.log(cell);
        const { x, y } = cell.cords
        const updatedGrid = grid.map((row) => row.slice());
        updatedGrid[x][y].terrain = floorSelection;
        updatedGrid[x][y].color = floors[floorSelection].color;
        setGrid(updatedGrid);
    }

    const handleMouseUp = () => {
        setMouseDown(false);
        // console.log('Up');
    };

    const handleSetMarker = (e, markerType) => {
        if (settingMarker === null) {
            setSettingMarker(markerType);
            return;
        }

        if (settingMarker === markerType) {
            setSettingMarker(null);
            return;
        }

        setSettingMarker(markerType);
    }

    const findMarker = (markerType) => {
        let result = null;

        grid.find((row, i) => {
            row.find((cell, j) => {
                const foundMarker = cell.markers.find((currentMarker, m) => {
                    if (currentMarker.type === markerType) {
                        result = { index: m, cords: cell.cords };
                        return true; // Stop iteration once the marker is found
                    }
                    return false;
                });
                return foundMarker;
            });
            return result; // Stop iteration if the marker is found
        });
        return result;
    };

    const validateGrid = () => {
        //validate combat area
        //validate cdz 
        //validate koz
        //validate markers

        //Validate grid only one island max 

        let tempGrid = [...grid];
        let combatAreaCount = 0;
        let errors = [];
        tempGrid.forEach(row => {
            row.forEach(currentCell => {
                // Validation based on terrain
                floors[currentCell.terrain]?.validation(currentCell);

                // Validation based on markers
                currentCell.markers.forEach(currentMarker => {
                    markers[currentMarker.type]?.validation(currentCell);
                });

                //Validate % of combat areas
                if (currentCell.terrain === TerrainTypes.CombatArea) {
                    combatAreaCount++;
                }
            });
        });
        const percentOfCombatArea = Math.round((combatAreaCount / Math.pow(size, 2)) * 100);
        if (percentOfCombatArea < 30) {
            errors.push({
                error: `Must make 30% of the tiles Combat Area Tiles. Current Combat Area Coverage ${percentOfCombatArea}%`
            });
        }
        setGridErrors(errors);
        // console.log("Temp Grid after validation step: ", grid);
        setGrid(tempGrid);
        setIslands(detectIslands(tempGrid));
    }
    return (
        <div style={{ position: 'relative' }}>

            {/* Zone Selection */}
            <div className="toggle-section">
                <h2>Zones</h2>
                <ToggleButtonGroup
                    value={floorSelection}
                    exclusive
                    onChange={handleFloorChange}
                    disabled={settingMarker !== null}
                // defaultValue={TerrainTypes.CombatArea}
                >
                    {Object.entries(floors).map(([key, floor]) => (
                        <ToggleButton key={floor.name} value={key}>
                            {floor.name}
                        </ToggleButton>
                    ))}
                </ToggleButtonGroup>
            </div>

            {/* Marker selection */}
            <div className="toggle-section">
                <h2>Markers</h2>
                <Stack spacing={2}>
                    {Object.entries(markers).map(([key, marker]) => {
                        const foundMarker = findMarker(marker);
                        return (
                            <Stack key={marker.name} direction="row" textAlign={"center"} alignItems={"center"} spacing={2} width="100%">
                                <Typography className='marker-data'>{marker.name}</Typography>
                                {
                                    foundMarker === null ?
                                        <Typography className='marker-data'> Not Set <WarningIcon /></Typography>
                                        :
                                        <Typography className='marker-data'> ({foundMarker.cords.x} , {foundMarker.cords.y})</Typography>
                                }
                                <Button
                                    className='marker-data-button'
                                    variant='contained'
                                    color={settingMarker !== key ? "primary" : "success"}
                                    name={marker.name}
                                    onClick={(e) => handleSetMarker(e, key)}
                                >
                                    {settingMarker !== key ? "Set" : "Confirm"}
                                </Button>
                            </Stack>
                        )
                    })}
                </Stack>
            </div>

            {/* Size Changer */}
            <label>
                Canvas Size:
                <input
                    type="range"
                    min="3"
                    max="20"
                    value={size}
                    onChange={(e) => handleSizeChange(e, parseInt(e.target.value))}
                />
                {size * size}
            </label>

            {/* The Grid */}
            <div
                ref={canvasRef}
                style={{
                    width: `100%`,
                    height: `800px`,
                    display: 'grid',
                    gridTemplateColumns: `repeat(${size}, 1fr)`,
                }}
                onMouseLeave={(e) => handleMouseLeave(e)}
            >
                {grid.map((row, rowIndex) => (
                    row.map((cell, colIndex) => (
                        // Cell
                        <div
                            key={`(${cell.cords.x},${cell.cords.y})`}
                            style={{
                                border: '1px solid grey',
                                backgroundColor:
                                    hoveredCell?.cords.x === rowIndex && hoveredCell?.cords.y === colIndex
                                        ? 'rgba(0, 255, 0, 0.2)' : cell.color, // Transparent green during hover function where we check if they can place that block there. green true red false
                                cursor: 'cell',
                            }}
                            onClick={() => handleCellClick(cell)}
                            onMouseEnter={() => handleMouseEnter(cell)}
                            onMouseDown={(e) => handleMouseDown(e, cell)}
                            onMouseUp={handleMouseUp}
                        >
                            {/* displays marker texts */}
                            {cell.markers.map((marker, index) => {
                                return (
                                    <Box display="flex" alignItems="center" justifyContent="center" py={1} key={index}>
                                        <Typography fontWeight={'bold'} height='100%' color={marker.color} bgcolor={'gray'} px={1} borderRadius={1}>
                                            {marker.name}
                                        </Typography>
                                    </Box>
                                )
                            })}
                            {/* Displays Cords */}
                            <Box display="flex" alignItems="center" justifyContent="center">
                                <Typography height='100%' color={cell.color !== 'white' ? 'white' : 'black'}>
                                    ({cell.cords.x},{cell.cords.y})
                                </Typography>
                            </Box>
                        </div>

                    ))
                ))}
            </div>
            {/* Validation Section */}
            <div className='log-container'>
                <h2>Validations</h2>
                <Typography>
                    {validationErrors}
                </Typography>
                <Typography>
                    {gridErrors.map((error, index) => {
                        return error.error;
                    })}
                </Typography>
                <Typography>
                    Number of islands: {islands}
                </Typography>
                <Typography>
                    Max Corners {Math.ceil(size/2)}
                </Typography>
                <Typography>
                    Min Corners {Math.ceil(size/3)}
                </Typography>
            </div>

            <button onClick={handleSubmit}>Submit</button>
        </div>
    );
};

// Example usage:
export const UserHome = () => {
    const initialCanvasSize = 3;

    const handleCanvasSubmit = (matrix) => {
        console.log('Canvas Matrix:', matrix);
        // You can perform further actions with the matrix
    };

    return (
        <div className='page-container'>
            <h1>Arena Builder</h1>
            <PixelDrawingComponent initialSize={initialCanvasSize} onSubmit={handleCanvasSubmit} />
        </div>
    );
};


//Validation next

//75% of the canvas must be filled with a color
//Every Black must be next to another black either up down left or right not diagonal
//reds and blues must make contact with another black
//there must be one square between the red corner and the blue corner 