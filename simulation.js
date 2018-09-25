/* Conway's game of life simulation, © Bipin Oli
 * Rules:
 *	1) Any live cell with fewer than two live neighbors dies, as if caused by underpopulation.
 *	2) Any live cell with more than three live neighbors dies, as if by overcrowding.
 *	3) Any live cell with two or three live neighbors lives on to the next generation.
 *	4) Any dead cell with exactly three live neighbors becomes a live cell.
 */

const ALIVE = true, DEAD = false;
let cells = [];

// double buffering
// swap the roles of state alternately
// if currently it shows present world state then
// it will show future world state next time
// and vice versa
// this removes the need to copy the future sate into current state
// by changing the role of states



let cell_state_1 = [];
let cell_state_2 = [];
let state = [cell_state_1, cell_state_2];
let curr = 0;
let future = 1;

let rows = 30, cols = 30;
let wd = 600, ht = 600;
let szX = wd/rows, szY = ht/cols;


function init() {
  // initialize the states
  for (let i=0; i<rows*cols; i++) {
  	state[curr].push(false); // dead cell
    state[future].push(false);
  }
}

function randomize() {
  // random state at the beginning
  for (let x=0; x<cols; x++)
   for (let y=0; y<rows; y++)
     state[curr][x+y*cols] = (int)(Math.random()*2);
}


function setup() {
  init();

  // pre-populated random population
  // state[curr][22] = state[curr][42] = state[curr][62] = state[curr][140] = true;
  randomize();

  // create grid world in canvas
	let canvas = createCanvas(wd,ht);
	for (let i=0; i<rows; i++)
		for (let j=0; j<cols; j++)
			cells.push(rect(i*szX, j*szY, szX, szY));

  canvas.parent("simulation");
  noLoop();
}




function colorCell(x, y) {
  let r = Math.random() * 256;
  let g = Math.random() * 256;
  let b = Math.random() * 256;
  let a = Math.random() * 200 + 56;
	fill(r, g, b, a);
	cells[x+y*cols] = rect(x*szY, y*szX, szX, szY);
	fill(255);
}

function eraseCell(x, y) {
	fill(255);
  cells[x+y*cols] = rect(x*szX, y*szY, szX, szY);
}





function mousePressed() {
  // identify the cell and make that alive or dead accordingly
  let x = (int)(mouseX/szX);
  let y = (int)(mouseY/szY);

  if (state[curr][x+y*cols] === ALIVE) {// ALIVE const, to make it easy to read {
    eraseCell(x,y);
    state[curr][x+y*cols] = false;
  }
  else {
    colorCell(x,y);
    state[curr][x+y*cols] = true;
  }
}



function display() {

  // display the world
 	for (let x=0; x<cols; x++)
    for (let y=0; y<rows; y++) {
    	if (state[future][x+y*cols] == ALIVE)
        	colorCell(x,y);
      else
        eraseCell(x,y);
    }

  // change the role of states
  future = 1 - future;
  curr = 1 - curr;

  // reinitalize future states
  for (let x=0; x<cols; x++)
    for (let y=0; y<rows; y++)
      state[future][x+y*cols] = DEAD;

  // ALT: this could have been done by swaping the array
  // js variables are just tags like that in python
  // so swapping the array would mean swaping the tags or references
  // not whole array
}




function draw() {

  // change the world according to conway's rules
  for (let x=0; x<cols; x++) {
  	for (let y=0; y<rows; y++) {

      let neighbors = 0;
      for (let dx=-1; dx<=1; dx++)
        for (let dy=-1; dy<=1; dy++) {
        	if (dx == 0 && dy == 0) continue;
          if (x+dx < cols && x+dx >= 0 &&
              y+dy < rows && y+dy >= 0 &&
              state[curr][(x+dx)+(y+dy)*cols] == ALIVE)
          {
            neighbors += 1;
          }
        }

      // applying rules

      // live cell, neighbors < 2 => die
      if (state[curr][x+y*cols] == ALIVE && neighbors < 2)
        state[future][x+y*cols] = DEAD;

      // live cell, neighbors > 3 => die
      else if (state[curr][x+y*cols] == ALIVE && neighbors > 3)
        state[future][x+y*cols] = DEAD;

      // dead cell, neighbors = 3 => born
      else if (state[curr][x+y*cols] == DEAD && neighbors == 3)
        state[future][x+y*cols] = ALIVE;

      // live cell, neighbors in [2,3] => ALIVE
      else if (state[curr][x+y*cols] == ALIVE)
				state[future][x+y*cols] = ALIVE;
    }
  }

	display();

}



// ----------------------- Button events --------------------

document.getElementById("btn-run").onclick = function() {
  loop();
}

document.getElementById("btn-stop").onclick = function() {
  noLoop();
}
