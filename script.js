let gameboard = [
    [1,2,3,4,5,6,7],
    [8,9,10,11,12,13,14],
    [15,16,17,18,19,20,21],
    [22,23,24,25,26,27,28],
    [29,30,31,32,33,34,35],
    [36,37,38,39,40,41,42]
   ];

let parallelBoard = [
   [1,2,3,4,5,6,7],
   [8,9,10,11,12,13,14],
   [15,16,17,18,19,20,21],
   [22,23,24,25,26,27,28],
   [29,30,31,32,33,34,35],
   [36,37,38,39,40,41,42]
   ];

let playerOne
let playerTwo
let indexPick
let availableIndexes
let gameType
let playerOneTurn = true
let itsAOnePlayerGame = false
let itsAHardGame = false
let itsTwoPlayerGame = false
let isThereAWinner = true

let player
let depth
let boardValue

let score  // = 0

// DOM creation

let mainDiv = document.createElement("div");
mainDiv.setAttribute('class', 'mainDiv')
document.body.append(mainDiv);

let selectorHolder = document.createElement("div") 
selectorHolder.setAttribute('class', 'selectorHolder')
selectorHolder.setAttribute('id', 'selectorHolder')
mainDiv.append(selectorHolder)

let selectorTable = document.createElement("table") 
selectorTable.setAttribute('class', 'selectorTable')
selectorTable.setAttribute('id', 'selectorTable')
selectorHolder.append(selectorTable)

function drawSelector() {  
let selectorRow = document.createElement("tr") 
selectorRow.setAttribute('class', 'selectorRow')
selectorTable.append(selectorRow)

for (i=0; i<7; i++){
let selectorCell = document.createElement("td") 
selectorCell.setAttribute('class', 'selectorCell')

let innerSelectorCell = document.createElement("div") 
innerSelectorCell.setAttribute('class', 'innerSelectorCell')
innerSelectorCell.setAttribute('id', [i])
selectorCell.append(innerSelectorCell)

innerSelectorCell.addEventListener("mouseover", function(event) {
if (playerOneTurn == true) {
innerSelectorCell.classList.add('yellowBG')}
else {innerSelectorCell.classList.add('redBG')
}
})

innerSelectorCell.addEventListener("mouseout", function(event) {
if (playerOneTurn == true) {
innerSelectorCell.classList.remove('yellowBG')}
else {innerSelectorCell.classList.remove('redBG')
}
})

innerSelectorCell.onclick = function(){
   if (isThereAWinner == true){
       alert("Select game")
   }
   else {
       indexPick = parseInt(this.id)
       claimSpot()
       }
}
selectorRow.append(selectorCell)
}        
};

drawSelector()

// Draw Main Gameboard

let mainTable = document.createElement("table");
mainTable.setAttribute('class', 'mainTable')
mainDiv.append(mainTable)

function drawBoard() {
for (i=0; i<gameboard.length; i++){
let row = document.createElement("tr")
mainTable.append(row)

   for (j=0; j<gameboard[i].length; j++){
       let outerCell = document.createElement('td')
       outerCell.setAttribute('class', 'outerCell')
       row.append(outerCell)
       let innerCell = document.createElement('div')
       innerCell.setAttribute('class', 'innerCell')
       innerCell.classList.add(gameboard[i][j])
       innerCell.setAttribute('innerHTML', gameboard[i][j])
       outerCell.append(innerCell)
   }   
}
};

drawBoard()

function validateRadio() {
let ele = document.getElementsByName('gameType');    
for(i = 0; i < ele.length; i++) {
   if(ele[i].checked){
   gameType = (ele[i].value)
   beginGame()
   }
}
};

function resetBoard() {
gameboard = [
[1,2,3,4,5,6,7],
[8,9,10,11,12,13,14],
[15,16,17,18,19,20,21],
[22,23,24,25,26,27,28],
[29,30,31,32,33,34,35],
[36,37,38,39,40,41,42]
]
parallelBoard = [
[1,2,3,4,5,6,7],
[8,9,10,11,12,13,14],
[15,16,17,18,19,20,21],
[22,23,24,25,26,27,28],
[29,30,31,32,33,34,35],
[36,37,38,39,40,41,42]
]
mainTable.innerHTML = ""
drawBoard()
};

function beginGame() {
isThereAWinner = false
playerOneTurn = true
document.getElementsByName("announcements")[0].innerHTML = "Current Player: " + whosPlaying() + "&nbsp;"

if (gameType == "1PEasy"){
itsAOnePlayerGame = true
resetBoard()
}
else if (gameType == "1PHard"){
itsAHardGame = true
resetBoard()
}
else if (gameType == "2P"){
itsATwoPlayerGame = true
resetBoard()
}
};

function swapTurns() {
if (isThereAWinner == true) {return}
else {
selectorTable.innerHTML = ""
drawSelector()
playerOneTurn = !playerOneTurn
document.getElementsByName("announcements")[0].innerHTML = "Current Player: " + whosPlaying() + "&nbsp;"
}
};

// GAMEPLAY

function whosPlaying() {
if (playerOneTurn) {
return "Yellow"
} else {
return "Red"
}
};

function whosNotPlaying() {
if (playerOneTurn) {
return "Red"
} else {
return "Yellow"
}
};

// starts from the bottom row and claims spot when there it is a number (unoccupied)
function claimSpot(){
availableIndexes = findAvailableIndexes(gameboard)
if (availableIndexes.includes(indexPick)) {

let i;
for (i = 5; i > -1; i--) 
{if (Number.isInteger(gameboard[i][indexPick])) {
gameboard[i].splice((indexPick), 1, whosPlaying())
parallelBoard[i].splice((indexPick), 1, whosPlaying())
mainTable.innerHTML = ""
drawBoard()
checkForWinners() 
setTimeout(
   function() {
       swapTurns() 
       if ((itsAOnePlayerGame == true && isThereAWinner == false) || (itsAHardGame == true && isThereAWinner == false))
        {computerPlays()}
       else {return}
   }, 240)  
break
}
}
}
else {
console.log(availableIndexes)
alert("Forbidden")
}
};



// if there is a string in row[0], that column is no longer available.
// find available columns by creating a "newArray" and then "forEach" element in board[0], if it's an integer
// push the index of the integer into the newArray and return it.
function findAvailableIndexes(board) {
let newArray=[]
board[0].forEach(function(x){
if (Number.isInteger(x) == true) 
{newArray.push(board[0].indexOf(x))}
})
return newArray
};


function checkForWinners() {
horizontalCheck()
verticalCheck()
downrightCheck()
uprightCheck()
}

// WIN CHECKERS
// a forloop evaluates a section of the matrix, moving through it and seeing if the 3 ahead match.
// it stops before going out of bounds

function findFour(w,x,y,z) {
// Checks first cell against current player and all cells match that player
return ((w == whosPlaying()) && (w === x) && (w === y) && (w === z));
};

function winDeclared() {
isThereAWinner = true
document.getElementsByName("announcements")[0].innerHTML = whosPlaying() + " wins!&nbsp;"

setTimeout(
function() {
alert(whosPlaying() + " wins!")
}, 10)

itsAOnePlayerGame = false
itsAHardGame = false
itsATwoPlayerGame = false
return
};


function uprightCheck() {
for (r=5; r>2; r--) {
for (c=0; c<4; c++){
if (findFour(gameboard[r][c], gameboard[r-1][c+1], gameboard[r-2][c+2], gameboard[r-3][c+3])) {
   winDeclared()
   return
}
}
}
};

function downrightCheck() {
for (r=0; r<3; r++) {
for (c=0; c<4; c++){
if (findFour(gameboard[r][c], gameboard[r+1][c+1], gameboard[r+2][c+2], gameboard[r+3][c+3])) {
   winDeclared()
   return
}
}
}
};


function verticalCheck() {
for (r=5; r>2; r--) {
for (c=0; c<7; c++){
if (findFour(gameboard[r][c], gameboard[r-1][c], gameboard[r-2][c], gameboard[r-3][c])) {
   winDeclared()
   return
}
}
}
};

function horizontalCheck() {
for (r=0; r<6; r++) {
for (c=0; c<4; c++){
if (findFour(gameboard[r][c], gameboard[r][c+1], gameboard[r][c+2], gameboard[r][c+3])) {
   winDeclared()
   return
}
}
}
};


// Game-playing AI

function assessHorizWindows(board) {
let horizTotal = 0
for (r=0; r<6; r++) {
for (c=0; c<4; c++){
let window = [board[r][c], board[r][c+1], board[r][c+2], board[r][c+3]]
horizTotal += scoreTheArray(window)
}
}
return horizTotal
};

function assessVertWindows(board) {
let vertTotal = 0
for (r=5; r>2; r--) {
for (c=0; c<7; c++){
let window = [board[r][c], board[r-1][c], board[r-2][c], board[r-3][c]]
vertTotal += scoreTheArray(window)
}
}
return vertTotal
};

function assessUprightWindows (board) {
let uprightTotal = 0
for (r=5; r>2; r--) {
for (c=0; c<4; c++){
let window = [board[r][c], board[r-1][c+1], board[r-2][c+2], board[r-3][c+3]]
uprightTotal += scoreTheArray(window)
}
}
return uprightTotal
};

function assessDownrightWindows (board) {
let downrightTotal = 0
for (r=0; r<3; r++) {
for (c=0; c<4; c++){
let window = [board[r][c], board[r+1][c+1], board[r+2][c+2], board[r+3][c+3]]
downrightTotal += scoreTheArray(window)
}
}
return downrightTotal
};

function weightMiddles(board){
let middles = [board[0][3],board[1][3],board[2][3],board[3][3],board[4][3],board[5][3]]
let middleScore = [middles.reduce(countPlayerMarkers, 0)] * 3
return middleScore 
};

function countPlayerMarkers(counter, ele) { 
if (ele == whosPlaying()) counter +=1
return counter}

function countOpponentMarkers(counter, ele) { 
if (ele == whosNotPlaying()) counter +=1
return counter}

function countEmptySpaces(counter, ele) { 
if (Number.isInteger(ele)) counter +=1
return counter}


function scoreTheArray(array) {
if (array.reduce(countPlayerMarkers, 0) === 4){return 1000}
else if ((array.reduce(countPlayerMarkers, 0) === 3) && (array.reduce(countEmptySpaces, 0) === 1)) {return 10}
else if ((array.reduce(countPlayerMarkers, 0) === 2) && (array.reduce(countEmptySpaces, 0) === 2)) {return 5}
else if ((array.reduce(countOpponentMarkers, 0) === 3) && (array.reduce(countEmptySpaces, 0) === 1)) {return -500}
else if ((array.reduce(countOpponentMarkers, 0) === 2) && (array.reduce(countEmptySpaces, 0) === 2)) {return -250}
// added and changed scoring to be symmetrical, formerly -500, -250
// else if (array.reduce(countOpponentMarkers, 0) === 4){return -1000}
else {return 0}
};


function pickBestMove() {
let bestScore = -10000
// you want this to be very low as a default so that blocking is preferred to nothing (bc even -80 is higher than -1k)
let bestColumn = (availableIndexes[Math.floor(Math.random() * availableIndexes.length)])
let parallelAvailable = findAvailableIndexes(parallelBoard)

for (s=0; s<parallelAvailable.length; s++) {
score = 0 
let i;
let j = parallelAvailable[s]
for (i = 5; i > -1; i--) 
   if (Number.isInteger(parallelBoard[i][j])) {
   parallelBoard[i].splice((j), 1, whosPlaying())
   break
}

let positionScore = assessHorizWindows(parallelBoard) + assessVertWindows(parallelBoard)
               + assessUprightWindows(parallelBoard) + assessDownrightWindows(parallelBoard)
               + weightMiddles(parallelBoard)

console.log("index " + j + " in spot " + gameboard[i][j]+ " score " + positionScore )

parallelBoard[i].splice((j), 1, gameboard[i][j])
console.log("Top Score was " + bestScore)

if (positionScore > bestScore || positionScore == bestScore) {
bestScore = positionScore
bestColumn = j
console.log("Top Column/Score is now " + bestColumn, bestScore)
}
else {console.log("columm " + s + " is not better")}
}

console.log("Final Column/Score is " + bestColumn, bestScore)
return bestColumn
};

// minimax

function scoreGameboard(board){
score = 0
let SGB = (assessHorizWindows(board) + assessVertWindows(board)
+ assessUprightWindows(board) + assessDownrightWindows(board)
+ weightMiddles(board) 
)
return SGB
};

function isTerminalMode(board){
if (isThereAWinner == true || [findAvailableIndexes(board)].length == 0)
{return true}
};


function findOpenRow(board, column){
for (i = 5; i > -1; i--) {
if (Number.isInteger(board[i][column])) {
return i
}
}
};


function computerPlays() {
if (itsAOnePlayerGame == true) {
availableIndexes = findAvailableIndexes(gameboard)
console.log("AI chooses from: " + availableIndexes)
// indexPick = (availableIndexes[Math.floor(Math.random() * availableIndexes.length)])
indexPick = (minimax(parallelBoard, 6, !playerOneTurn)).special
}
else if (itsAHardGame == true)
{ indexPick = pickBestMove() }


let i;
for (i = 5; i > -1; i--) 
{if (Number.isInteger(gameboard[i][indexPick])) {
gameboard[i].splice((indexPick), 1, whosPlaying())
parallelBoard[i].splice((indexPick), 1, whosPlaying())
console.log("**** computerplays " + indexPick + " SG score is " + scoreGameboard(parallelBoard))
mainTable.innerHTML = ""
drawBoard()
checkForWinners() 
setTimeout(
   function() {
   swapTurns()
   }, 
240)
break
}
}    
};

// Minimax process works
// but at 2 depth but crashes, 3, t
// number of tokens doesn't matter, as low as 4, up to 7 placed
// can't get past row 2 but sometimes crashes before that

/*
Returns an object obj containing:

obj.moves: an array containing the possible moves (if the game is over, this array is empty)

obj.isPlayerTurn: a boolean indicating whether it's the player's turn to move

obj.hasPlayerWon: a boolean indicating whether or not the player has won

obj.hasComputerWon: a boolean indicating whether or not the computer has won
*/
function getBoardState(board) {

/*
It is possible to determine whose turn it is by counting how many
tokens are on the board. Since the player moves first, there are
either equal numbers of yellow and red tokens (in which case it's
the player's turn to move), or there is one more yellow token than red
(in which case it's the computer's turn to move)

TODO: It would be simpler if the board kept track of whose turn it was.
For instance, the board could be an object containing { tokens: the 2D array, isPlayerTurn: boolean }
From a code organization perspective, it makes sense for the board to maintain this state (as opposed
to having a separate boolean variable that tracks whose turn it is -- this way the 2D array and isPlayerTurn
are tied together into a single object that knows to keep them in sync)
*/

let numPlayerMoves = 0;
let numComputerMoves = 0;

for (let i = 0; i < board.length; i++) {
for (let j = 0; j < board[i].length; j++) {
if (board[i][j] === "Yellow")
   numPlayerMoves++;
if (board[i][j] === "Red")
   numComputerMoves++;
}
}

let isPlayerTurn = (numPlayerMoves === numComputerMoves);

/*
Not all (i, j) indexes are valid.
isInbound(boardLocation) returns true if (boardLocation.i, boardLocation.j) represents
a spot on the board that actually exists (and isn't out-of-range).

AC: This is to check four in a row doesn't go out of bounds. isInbound looks at board location and
if greater or equal to zero or less than board length
*/	
let isInbound /* as opposed to being out-of-bounds */ = function (boardLocation) {
return 0 <= boardLocation.i && boardLocation.i < board.length
&& 0 <= boardLocation.j && boardLocation.j < board[0].length;
};

/*
Given 4 adjacent locations on the board, checks to see if those 4 locations constitutes
a win (i.e. those 4 locations all contain yellow tokens, or those 4 locations all contain red tokens)
*/
let check4 = function (location1, location2, location3, location4) {
if (!isInbound(location1) || !isInbound(location2) || !isInbound(location3) || !isInbound(location4))
return null;

let location1Move = board[location1.i][location1.j];
let location2Move = board[location2.i][location2.j];
let location3Move = board[location3.i][location3.j];
let location4Move = board[location4.i][location4.j];

if (location1Move === "Yellow" && location2Move === "Yellow" && location3Move === "Yellow" && location4Move === "Yellow")
return "Yellow";
if (location1Move === "Red" && location2Move === "Red" && location3Move === "Red" && location4Move === "Red")
return "Red";

return null;
};

/*
Determines if either side has won by doing an exhaustive check across the entire board.

This is rather inefficient but is accurate.

A more efficient approach would be to do this check upon making a move. After placing a new token onto the board,
we actually only need to check for potential 4-in-a-row that involve that token (and can ignore the rest of the board 
since the rest of the board hasn't changed, so a 4-in-a-row isn't going to magically appear elsewhere).
For instance, this check could've been done as part of the applyMove() function, and the current status of the game
could be tracked by the board directly.
*/

let hasPlayerWon = false;
let hasComputerWon = false;

let directions = [
[1, 0], /* a horizontal win */
[0, 1], /* a vertical win */
[1, 1], /* a diagonal win */
[1, -1] /* a diagonal win (in the other direction) */
];

for (let i = 0; i < board.length; i++) {
for (let j = 0; j < board[0].length; j++) {
for (let direction of directions) {
   /*
       For instance, if direction is [1, 0] and i = 3, j = 2,
       we would get the following 4 locations:
           [3, 2]
           [4, 2]
           [5, 2]
           [6, 2]
       
       And we'd check to see if those 4 locations form a win.
   */

   let location1 = { i: i + direction[0] * 0, j: j + direction[1] * 0 };
   let location2 = { i: i + direction[0] * 1, j: j + direction[1] * 1 };
   let location3 = { i: i + direction[0] * 2, j: j + direction[1] * 2 };
   let location4 = { i: i + direction[0] * 3, j: j + direction[1] * 3 };
 
   // AC: this only advances rightward though, don't I need leftward too?
   // how does it know where to start from/ what 0,0 is with the `for` statements starting at 0?
   // A: it's because it's part of the minimax, it will check it all
   // this is all in the function getBoardState(board)

   let possibleWinner = check4(location1, location2, location3, location4);
   
   if (possibleWinner === "Yellow")
       hasPlayerWon = true;
   if (possibleWinner === "Red")
       hasComputerWon = true;
}
}
};

return {
moves: hasPlayerWon || hasComputerWon ? [] : findAvailableIndexes(board),
// if either has won then moves is nothing, else findAvailableIndexes
isPlayerTurn: isPlayerTurn,
hasPlayerWon: hasPlayerWon,
hasComputerWon: hasComputerWon
};
}
// AC: ends function getBoardState(board)
// is it better to avoid let
// is it better to have some of these functions outside? No bc all these need to be part of the object
// Is getBoardState(board) like a catch-all function to create an object


/*
Applies the move to the board by looking for the first available spot in the
desired column (starting from the bottom -- that is, board.length - 1 -- and
working our way up)

**** AC -- if the move has no yellow or red in it, i is board.length minus 1
where does board.length come from? it's the condition that matches the while.
the i -- works like the for. 
so from the bottom (board.length -1 since there is a row 0)
if that space does nor have red or yellow, put in a red or yellow (depending on turn)
else it subtracts i--? under what condition would it be false? while what is true?

*/
function applyMove(board, move, isPlayerTurn) {
let i = board.length - 1;
while (true) {
if (board[i][move] !== "Yellow" && board[i][move] !== "Red") {
board[i][move] = ( isPlayerTurn ? "Yellow" : "Red" );
return;
}
i--;
}
}


/*
Undo a move to the board by looking at the top-most token in the desired column
and removing it.

AC -- this uses the object aspect .... parameters are board and move, which is a J.

board[i][move] = i * 7 + move + 1 is multiply by 7 for the row and add 1 bc index starts at 0
no need for second board, just calculates it.

how is `while(true)` used? -- that is while the space is occupied, then replace? 
why not just do it instead of requiring the while?
while (true) repeats until what condition is false?
*/

function unapplyMove(board, move) {
let i = 0;
while (true) {
if (board[i][move] === "Yellow" || board[i][move] === "Red") {
/*
   the board is originally filled with numbers (and then gradually gets
   replaced with the strings "Yellow" and "Red") although it would likely
   be cleaner if the board started as a 2D array containing null instead
   
   Then we could just do board[i][move] = null

*/
board[i][move] = i * 7 + move + 1;
return;
}

i++;
}
}

/*
Evaluates a board position using some heuristics.
For instance, having a 3-in-a-row should probably give some points.

Here, we apply no heuristics and just assign every board position a value of 0.
(This means that the search will only be effective to the extent that it can look
ahead and directly see won and lost board positions.)
*/
function evaluateBoardPosition(board) {
// AC: I'm not sure how this works. Should I add in my own?
return 0;
}

/*
Minimax, a largely line-by-line implementation of the Wikipedia pseudo-code

Note that the third argument is not used; instead, we examine the board directly
to determine whose turn it is.

AC: Why do you add depth to the first parts here?

remember minimax and move comes from computerMove
.special is what minimax chooses

*/
function minimax(board, depth /*, player*/) {

let boardState = getBoardState(board);
let moves = boardState.moves;
let isPlayerTurn = boardState.isPlayerTurn;
let hasPlayerWon = boardState.hasPlayerWon;
let hasComputerWon = boardState.hasComputerWon;

if (depth === 0)
return { score: evaluateBoardPosition(board) };

if (hasPlayerWon) 
return { score: -10000000000 - depth };

if (hasComputerWon)
return { score: 10000000000 + depth };

if (moves.length === 0)
return { score: 0 };

if (!isPlayerTurn) {
let bestMoveFoundSoFar = null;
let bestScoreFoundSoFar = -Infinity;

for (let move of moves) {
// moves comes from findAvailableIndex, it keeps re-gathering until depth out or none left
// I'm not familiar with the for/let convention

applyMove(board, move, isPlayerTurn);
let scoreOfThisMove = minimax(board, depth - 1).score;
unapplyMove(board, move);

if (scoreOfThisMove > bestScoreFoundSoFar) {
   bestScoreFoundSoFar = scoreOfThisMove;
   bestMoveFoundSoFar = move;
}
}

// "special" should probably be named something like "move" instead
return { score: bestScoreFoundSoFar, special: bestMoveFoundSoFar };
} else {

// this plays the other side:

let bestMoveFoundSoFar = null;
let bestScoreFoundSoFar = Infinity;

for (let move of moves) {

applyMove(board, move, isPlayerTurn);
let scoreOfThisMove = minimax(board, depth - 1).score;
unapplyMove(board, move);

if (scoreOfThisMove < bestScoreFoundSoFar) {
   bestScoreFoundSoFar = scoreOfThisMove;
   bestMoveFoundSoFar = move;
}
}

return { score: bestScoreFoundSoFar, special: bestMoveFoundSoFar };
}
}
