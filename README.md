# Conway's Game of Life

An interactive implementation of Conway's Game of Life with user controls.

## Features

- Interactive grid where users can:
  - Click on empty cells to create new life (creates 3 cells at once)
  - Click on filled cells to remove life (toggles 3 cells at once)
- Bounded grid with walls (cells don't wrap around the edges)
- Control buttons:
  - Start/Pause: Toggle the simulation
  - Faster: Increase the simulation speed
  - Slower: Decrease the simulation speed
- Responsive design that works on different screen sizes

## How to Use

1. Open `index.html` in a web browser
2. Click on the grid to add or remove cells (each click affects 3 cells at once)
3. Use the Start button to begin the simulation
4. Adjust the speed with the Faster and Slower buttons

## About Conway's Game of Life

Conway's Game of Life is a cellular automaton devised by mathematician John Horton Conway in 1970. It follows these rules:

1. Any live cell with fewer than two live neighbors dies (underpopulation)
2. Any live cell with two or three live neighbors lives on
3. Any live cell with more than three live neighbors dies (overpopulation)
4. Any dead cell with exactly three live neighbors becomes a live cell (reproduction)

## Technologies Used

- HTML5 Canvas for rendering
- JavaScript for game logic
- CSS for styling
