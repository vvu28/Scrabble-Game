/** Let's think: What aspects of this game am i going to need to complete?
 * Which functions/methods, objects, arrays, etc...
 * 
 * Well, first I'll need to create a coordinate-based board (idk how...)
 * boolean isHorizontal/isVertical: ensures proper user input
 * calculateScore: Calculates score
 * special tiles: maybe each tile as an object - make specialTile a boolean property or something
 * 
 * And then the bot obviously...
 * Give the bot random tiles too
 * Make an algorithm to determine the optimal move, play optimal move
 */


const map = [
    [5,1,1,2,1,1,1,5,1,1,1,2,1,1,5],
    [1,4,1,1,1,3,1,1,1,3,1,1,1,4,1],
    [1,1,4,1,1,1,2,1,2,1,1,1,4,1,1],
    [2,1,1,4,1,1,1,2,1,1,1,4,1,1,2],
    [1,1,1,1,4,1,1,1,1,1,4,1,1,1,1],
    [1,3,1,1,1,3,1,1,1,3,1,1,1,3,1],
    [1,1,2,1,1,1,2,1,2,1,1,1,2,1,1],
    [5,1,1,2,1,1,1,4,1,1,1,2,1,1,5], //middle
    [1,1,2,1,1,1,2,1,2,1,1,1,2,1,1],
    [1,3,1,1,1,3,1,1,1,3,1,1,1,3,1],
    [1,1,1,1,4,1,1,1,1,1,4,1,1,1,1],
    [2,1,1,4,1,1,1,2,1,1,1,4,1,1,2],
    [1,1,4,1,1,1,2,1,2,1,1,1,4,1,1],
    [1,4,1,1,1,3,1,1,1,3,1,1,1,4,1],
    [5,1,1,2,1,1,1,5,1,1,1,2,1,1,5]
]

function displayBoard() {
  const board = document.getElementById("board");
  board.innerHTML = ""; // clear existing content

  for (let r = 0; r < map.length; r++) {
    for (let c = 0; c < map[r].length; c++) {
      const square = document.createElement("div"); // create square
      square.classList.add("square"); // base styling

      const type = map[r][c]; // read the number from your map

      // Apply color based on tile type
      if (type > 1) {
        square.classList.add(`bonus-${type}`);
      }
      // Add coordinate data (optional)
      square.dataset.row = r;
      square.dataset.col = c;

      // Finally, add this square to the board grid
      board.appendChild(square);
    }
  }
}


function Tile(letter, points, amount){
    this.letter = letter;
    this.points = points;
    this.amount = amount;
}

const bag=[
    new Tile("a",1,9),
    new Tile("b",3,2),
    new Tile("c",3,2),
    new Tile("d",2,4),
    new Tile("e",1,12),
    new Tile("f",4,2),
    new Tile("g",2,3),
    new Tile("h",2,4),
    new Tile("i",1,9),
    new Tile("j",8,1),
    new Tile("k",5,1),
    new Tile("l",1,4),
    new Tile("m",2,3),
    new Tile("n",1,6),
    new Tile("o",1,8),
    new Tile("p",3,2),
    new Tile("q",10,1),
    new Tile("r",1,6),
    new Tile("s",1,4),
    new Tile("t",1,6),
    new Tile("u",1,4),
    new Tile("v",4,2),
    new Tile("w",4,2),
    new Tile("x",8,1),
    new Tile("y",4,2),
    new Tile("z",10,1),
    new Tile("_",0,2) // blank tiles
]

//adjusting letter frequency
const adjBag = bag.flatMap(tile => Array(tile.getAmount).fill(tile));

//Picking a random tile
function pickRandom(){
    const index = Math.floor(Math.random()*adjBag.length);
    const letterPicked = adjBag[index];
    adjBag.splice(index, 1);
    return letterPicked;
}

let playerHand = [
    pickRandom(),
    pickRandom(),
    pickRandom(),
    pickRandom(),
    pickRandom(),
    pickRandom(),
    pickRandom(),
]

//A set to hold selected tiles
let selectedTiles = new Set();
function toggleTileSelection(tile, index){
    if(!selectedTiles.has(index)){
        selectedTiles.add(index);
        tile.classList.add("selected");
    }
    else{
        selectedTiles.delete(index);
        tile.classList.remove("selected");
    }
}

//Drag and drop functionality
function enableBoardDropping() {
  const squares = document.querySelectorAll(".square");
  squares.forEach(square => {
    // Allow tiles to be dragged over
    square.addEventListener("dragover", (event) => {
      event.preventDefault(); // Necessary for drop
      square.style.backgroundColor = "#ddd"; // optional highlight
    });
    // Remove highlight when leaving
    square.addEventListener("dragleave", () => {
      const type = map[square.dataset.row][square.dataset.col];
      square.style.backgroundColor = type > 1 ? getBonusColor(type) : "burlywood";
    });
    // Handle drop
    square.addEventListener("drop", (event) => {
      event.preventDefault();
      const tileIndex = event.dataTransfer.getData("text/plain");
      const tileData = playerHand[tileIndex];
      // Place tile on board
      square.textContent = tileData.letter;
      square.dataset.tileIndex = tileIndex; // store which tile is here
      // Remove tile from rack
      const rackTile = document.getElementById(tileData.letter === "_" ? "blank" : `tile ${tileIndex}`);
      if (rackTile) rackTile.remove();
      // Optionally remove from playerHand temporarily
      playerHand[tileIndex] = null;
    });
  });
}

// Helper to get bonus color
function getBonusColor(type){
  switch(type){
    case 2: return "#87cefa";
    case 3: return "#ff7f7f";
    case 4: return "#ffa500";
    case 5: return "#dc143c";
    default: return "burlywood";
  }
}

// print letters
function displayHand() {
  const rack = document.getElementById("playerRack");
  rack.innerHTML = ""; // clear old tiles
  for (let i = 0; i < playerHand.length; i++) {
    const tileData = playerHand[i];
    if (!tileData) continue; // skip null tiles
    const tile = document.createElement("div");
    tile.classList.add("tile");
    if(tileData.letter === "_"){
        tile.id = "blank";
    } else{
        tile.id = `tile ${i}`;
    }
    tile.textContent = tileData.letter;
    tile.setAttribute("draggable", "true");
    // On drag start
    tile.addEventListener("dragstart", (event) => {
      event.dataTransfer.setData("text/plain", i);
      event.dataTransfer.effectAllowed = "move";
    });
    // Click selection
    tile.addEventListener("click", () => toggleTileSelection(tile, i));
    rack.appendChild(tile);
  }
}

//To put the tile back
const rack = document.getElementById("playerRack");
rack.addEventListener("dragover", e => e.preventDefault());
rack.addEventListener("drop", (event) => {
  event.preventDefault();
  const tileIndex = event.dataTransfer.getData("text/plain");
  // Only drop if the slot is empty
  if(playerHand[tileIndex] === null){
    playerHand[tileIndex] = pickRandom(); // Or store original tile data somewhere
    displayHand();
  }
});

// function displayHand() {
//   const rack = document.getElementById("playerRack");
//   rack.innerHTML = ""; // clear old tiles
//   for (let i = 0; i < playerHand.length; i++) {
//     const tile = document.createElement("div");
//     tile.classList.add("tile");
//     if(playerHand[i].letter==="_"){
//         tile.id = "blank";
//     }
//     else{
//         tile.id = `tile ${i}`;
//     }
//     tile.textContent = playerHand[i].letter;
//     tile.setAttribute("draggable", "true");
//     // On drag start, store which tile is being dragged
//     tile.addEventListener("dragstart", (event) => {
//       event.dataTransfer.setData("text/plain", i); // store tile index
//       event.dataTransfer.effectAllowed = "move";
//     });
//     // Add click listener for selection
//     tile.addEventListener("click", () => toggleTileSelection(tile, i));
//     rack.appendChild(tile);
//   }
// }
displayHand();
displayBoard();
enableBoardDropping();

function swapTiles(){
    if(selectedTiles.size>0){
        for(i=0;i<7;i++){
            if(selectedTiles.has(i)){
                playerHand[i]=pickRandom();
            }
        }
    }
    selectedTiles.clear();
    displayHand();
}

//replacing tiles
function replaceTiles(){
    while(playerHand.length<7){
        playerHand.push(pickRandom());
    }
}

function submit(){
    if(
        (isHorizontal||isVertical)
        && isAdjacent
        && isValidWord
    ){
        playerHand.splice(index, 1);
        replaceTiles();
    }
    displayHand()
}

let playerScore =0;
let botScore=0;
// const inputWord = document.getElementById("inputWord").value.trim();
// let isValidWord = dictionary.includes(inputWord.toLowerCase());