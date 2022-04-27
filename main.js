// 1. Menace goes first
// 2. Store states in a hash table
// 3. Use State as key
// 4. Loose remove the beads
// 5. Win add 3 more beads
// 6. Draw 1 beads

const cellElements = document.querySelectorAll('[data-cell]')
const board = document.getElementById('board')
const X_CLASS = 'x'
const CIRCLE_CLASS = 'circle'
const WINNING_COMBINATIONS = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[2, 4, 6],
]

var matchBoxes = [];

let stats = { "menaceWin": 0, "menaceDraw": 0, "menaceLost": 0, "totalMatch": 0, "gameHistory": [], "matchLength":0 }
// D - Draw, W - Menace Win, L - Menace Lost  
gameInfo = { "startTime": Date.now(), "endTime": Date.now(), "numberOfMenaceMoves": 0, "gameStatus":""}

let circleTurn

const GAME_CELLS = 9

let getAllGameStates = GAME_CELLS => {
	let possibleMoves = '012'.split('') // X --> 1, O --> 2, empty position --> 0
	let lengthen = word => possibleMoves.map(letter => word + letter)
	let addLetters = words => flatten(words.map(lengthen))
	let _getAllWords = (letters, words = possibleMoves, current = 1) => {
		return letters == current ? words :
			_getAllWords(letters, addLetters(words), current + 1)
	}

	return _getAllWords(GAME_CELLS)
}

function fillMatchBox() {
	gameStates = getAllGameStates(GAME_CELLS)
	for (const element of gameStates) {
		var temp = []
		for (let i = 0; i < element.length; i++) {
			if (element[i] == '0') temp.push(i)
		}
		matchBoxes[element] = temp
	}
	logGame("Making the matchboxes and beads ready for you...")
}

function random_item(items) {
	return items[Math.floor(Math.random() * items.length)];
}

function getBead(currentBoardState) {
	var beads = matchBoxes[currentBoardState]
	return random_item(beads)
}

cellElements.forEach(cell => {
	cell.addEventListener('click', handleClick, { once: true })
})

function startGame() {
	circleTurn = false
	cellElements.forEach(cell => {
		cell.addEventListener('click', handleClick, { once: true })
	})
	setBoardHoverClass
	logGame("Starting the game !")
	fillMatchBox();
	playMenace()
}

function playMenace() {
	const currentClass = circleTurn ? CIRCLE_CLASS : X_CLASS
	var currentBoardState = getBoardState()
	var currentMove = getBead(currentBoardState)
	console.log(currentMove)
	placeMarkMenace(currentMove, currentClass)
	if (checkWin(currentClass)) endGame(false);
	else if (isDraw()) endGame(true)
	else {
		swapTurns()
		setBoardHoverClass()
	}
}

function handleClick(e) {
	const cell = e.target
	const currentClass = circleTurn ? CIRCLE_CLASS : X_CLASS
	placeMarkHuman(cell, currentClass)
	var currentBoardState = getBoardState()
	if (checkWin(currentClass)) endGame(false);
	else if (isDraw()) endGame(true)
	else {
		swapTurns()
		setBoardHoverClass()
		playMenace()
	}
}

function endGame(draw) {
	if (draw) {
		console.log("Draw")
		logGame("Its a draw. Well tried!")
		document.getElementById("header").innerHTML = `Match Draw`;
		gameInfo.gameStatus = "D"
	} else {
		document.getElementById("header").innerHTML = `${circleTurn ? "O Win's" : "X wins"}`;
		console.log(`${circleTurn ? "O Win's" : "X wins"}`);
		logGame(`${circleTurn ? "O Win's" : "X wins"}`)
		gameInfo.gameStatus = `${circleTurn ? "L" : "W"}`
	}
	lockBoard();
	updateGameInfo();
}

function updateGameInfo(){
	gameInfo.endTime = Date.now()
	gameInfo.matchLength = gameInfo.endTime - gameInfo.startTime;
	stats.gameHistory.push(gameInfo)
	logGame(stats)
}

function isDraw() {
	return [...cellElements].every(cell => {
		return cell.classList.contains(X_CLASS) || cell.classList.contains(CIRCLE_CLASS)
	})
}

function placeMarkHuman(cell, currentClass) {
	cell.classList.add(currentClass)
}

function placeMarkMenace(idx, currentClass) {
	document.getElementById("pos" + idx).classList.add(currentClass)
}


function swapTurns() {
	circleTurn = !circleTurn
}

function lockBoard() {
	cellElements.forEach(cell => {
		cell.removeEventListener('click', handleClick, { once: false })
	})
}

function setBoardHoverClass() {
	board.classList.remove(X_CLASS)
	board.classList.remove(CIRCLE_CLASS)
	if (circleTurn) board.classList.add(CIRCLE_CLASS)
	else board.classList.add(X_CLASS)
}

function checkWin(currentClass) {
	return WINNING_COMBINATIONS.some(combination => {
		return combination.every(index => {
			return cellElements[index].classList.contains(currentClass)
		})
	})
}

function getBoardState() {
	var board = Array.from(cellElements);
	for (let i = 0; i < 9; i++) {
		if (board[i].className == "cell x") board[i] = 1
		else if (board[i].className == 'cell circle') board[i] = 2
		else board[i] = 0
	}
	return board.join("")
}
function logGame(message) {
	var logElement = document.createElement("div");
	logElement.classList.add("col-md-12")
	document.getElementById('logContainer').insertBefore(logElement, document.getElementById('logContainer').firstChild);
	logElement.appendChild(document.createTextNode(message));
}

let flatten = arr => arr.reduce((carry, item) => carry.concat(item), [])

startGame()