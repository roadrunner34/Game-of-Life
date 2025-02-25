document.addEventListener('DOMContentLoaded', () => {
    // Game configuration
    const config = {
        cellSize: 15,
        gridColor: '#cccccc',
        aliveColor: '#3498db',
        fps: 10,
        gridWidth: 50,
        gridHeight: 30,
        speedMultiplier: 1,
        maxSpeedMultiplier: 5,
        minSpeedMultiplier: 0.5
    };

    // Game elements
    const canvas = document.getElementById('game-canvas');
    const ctx = canvas.getContext('2d');
    const startPauseButton = document.getElementById('start-pause');
    const fasterButton = document.getElementById('faster');
    const slowerButton = document.getElementById('slower');
    const speedDisplay = document.getElementById('speed-display');

    // Set canvas dimensions
    canvas.width = config.cellSize * config.gridWidth;
    canvas.height = config.cellSize * config.gridHeight;

    // Game state
    let grid = createEmptyGrid();
    let isRunning = false;
    let animationId = null;
    let lastUpdateTime = 0;
    
    // Create empty grid with all cells set to dead (0)
    function createEmptyGrid() {
        return Array(config.gridHeight).fill().map(() => Array(config.gridWidth).fill(0));
    }

    // Draw the grid
    function drawGrid() {
        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw cells
        for (let y = 0; y < config.gridHeight; y++) {
            for (let x = 0; x < config.gridWidth; x++) {
                const cellX = x * config.cellSize;
                const cellY = y * config.cellSize;
                
                // Draw cell border
                ctx.strokeStyle = config.gridColor;
                ctx.strokeRect(cellX, cellY, config.cellSize, config.cellSize);
                
                // Fill alive cells
                if (grid[y][x] === 1) {
                    ctx.fillStyle = config.aliveColor;
                    ctx.fillRect(cellX, cellY, config.cellSize, config.cellSize);
                }
            }
        }
    }

    // Update the grid based on Conway's Game of Life rules
    function updateGrid() {
        const newGrid = createEmptyGrid();
        
        for (let y = 0; y < config.gridHeight; y++) {
            for (let x = 0; x < config.gridWidth; x++) {
                const neighbors = countNeighbors(x, y);
                
                // Apply Conway's Game of Life rules
                if (grid[y][x] === 1) {
                    // Any live cell with 2 or 3 live neighbors lives
                    if (neighbors === 2 || neighbors === 3) {
                        newGrid[y][x] = 1;
                    }
                    // Any live cell with fewer than 2 or more than 3 neighbors dies
                } else {
                    // Any dead cell with exactly 3 live neighbors becomes alive
                    if (neighbors === 3) {
                        newGrid[y][x] = 1;
                    }
                }
            }
        }
        
        grid = newGrid;
    }

    // Count alive neighbors for a cell
    function countNeighbors(x, y) {
        let count = 0;
        
        for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
                if (dx === 0 && dy === 0) continue; // Skip the cell itself
                
                // Calculate neighbor coordinates without wrapping (creating walls)
                const nx = x + dx;
                const ny = y + dy;
                
                // Only count neighbors that are within the grid boundaries
                if (nx >= 0 && nx < config.gridWidth && ny >= 0 && ny < config.gridHeight) {
                    count += grid[ny][nx];
                }
            }
        }
        
        return count;
    }

    // Game loop
    function gameLoop(timestamp) {
        if (!lastUpdateTime) lastUpdateTime = timestamp;
        
        const elapsed = timestamp - lastUpdateTime;
        const interval = 1000 / (config.fps * config.speedMultiplier);
        
        if (elapsed > interval) {
            updateGrid();
            drawGrid();
            lastUpdateTime = timestamp;
        }
        
        if (isRunning) {
            animationId = requestAnimationFrame(gameLoop);
        }
    }

    // Toggle game state (start/pause)
    function toggleGame() {
        isRunning = !isRunning;
        
        if (isRunning) {
            startPauseButton.textContent = 'Pause';
            lastUpdateTime = 0;
            animationId = requestAnimationFrame(gameLoop);
        } else {
            startPauseButton.textContent = 'Start';
            if (animationId) {
                cancelAnimationFrame(animationId);
                animationId = null;
            }
        }
    }

    // Increase simulation speed
    function increaseSpeed() {
        if (config.speedMultiplier < config.maxSpeedMultiplier) {
            config.speedMultiplier += 0.5;
            updateSpeedDisplay();
        }
    }

    // Decrease simulation speed
    function decreaseSpeed() {
        if (config.speedMultiplier > config.minSpeedMultiplier) {
            config.speedMultiplier -= 0.5;
            updateSpeedDisplay();
        }
    }

    // Update speed display
    function updateSpeedDisplay() {
        speedDisplay.textContent = `${config.speedMultiplier}x`;
    }

    // Create a cell group with 3 connected cells in a random pattern
    function createCellGroup(centerX, centerY) {
        // Check if center cell is within bounds
        if (centerX < 0 || centerX >= config.gridWidth || centerY < 0 || centerY >= config.gridHeight) {
            return;
        }
        
        // Start with the center cell
        grid[centerY][centerX] = 1;
        
        // Possible directions: up, right, down, left, up-right, down-right, down-left, up-left
        const directions = [
            [0, -1], [1, 0], [0, 1], [-1, 0], 
            [1, -1], [1, 1], [-1, 1], [-1, -1]
        ];
        
        // Shuffle the directions array to randomize the pattern
        const shuffledDirections = [...directions].sort(() => Math.random() - 0.5);
        
        // Place the second cell in a random valid direction
        let secondCellPlaced = false;
        let secondCellX, secondCellY;
        
        for (const [dx, dy] of shuffledDirections) {
            const newX = centerX + dx;
            const newY = centerY + dy;
            
            if (newX >= 0 && newX < config.gridWidth && newY >= 0 && newY < config.gridHeight) {
                grid[newY][newX] = 1;
                secondCellX = newX;
                secondCellY = newY;
                secondCellPlaced = true;
                break;
            }
        }
        
        // If we couldn't place the second cell, return
        if (!secondCellPlaced) return;
        
        // For the third cell, we need to ensure it touches at least one of the existing cells
        // Get all valid positions that touch either the first or second cell
        const validPositions = [];
        
        for (const [dx, dy] of directions) {
            // Positions touching the first cell
            const pos1X = centerX + dx;
            const pos1Y = centerY + dy;
            
            // Positions touching the second cell
            const pos2X = secondCellX + dx;
            const pos2Y = secondCellY + dy;
            
            // Add positions that are within bounds and not already occupied
            if (pos1X >= 0 && pos1X < config.gridWidth && pos1Y >= 0 && pos1Y < config.gridHeight && 
                !(pos1X === centerX && pos1Y === centerY) && !(pos1X === secondCellX && pos1Y === secondCellY)) {
                validPositions.push([pos1X, pos1Y]);
            }
            
            if (pos2X >= 0 && pos2X < config.gridWidth && pos2Y >= 0 && pos2Y < config.gridHeight && 
                !(pos2X === centerX && pos2Y === centerY) && !(pos2X === secondCellX && pos2Y === secondCellY)) {
                validPositions.push([pos2X, pos2Y]);
            }
        }
        
        // If there are valid positions, randomly select one for the third cell
        if (validPositions.length > 0) {
            const [thirdX, thirdY] = validPositions[Math.floor(Math.random() * validPositions.length)];
            grid[thirdY][thirdX] = 1;
        }
    }

    // Handle canvas click to toggle cell state
    function handleCanvasClick(event) {
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        
        const clickX = (event.clientX - rect.left) * scaleX;
        const clickY = (event.clientY - rect.top) * scaleY;
        
        const cellX = Math.floor(clickX / config.cellSize);
        const cellY = Math.floor(clickY / config.cellSize);
        
        // Create a random pattern of 3 connected cells
        createCellGroup(cellX, cellY);
        drawGrid();
    }

    // Initialize game
    function init() {
        // Add event listeners
        startPauseButton.addEventListener('click', toggleGame);
        fasterButton.addEventListener('click', increaseSpeed);
        slowerButton.addEventListener('click', decreaseSpeed);
        canvas.addEventListener('click', handleCanvasClick);
        
        // Initialize speed display
        updateSpeedDisplay();
        
        // Random initial pattern (uncomment to start with random cells)
        // randomizeGrid();
        
        // Draw initial grid
        drawGrid();
    }

    // Randomize grid (optional feature)
    function randomizeGrid() {
        for (let y = 0; y < config.gridHeight; y++) {
            for (let x = 0; x < config.gridWidth; x++) {
                grid[y][x] = Math.random() > 0.7 ? 1 : 0;
            }
        }
    }

    // Start the game
    init();
}); 