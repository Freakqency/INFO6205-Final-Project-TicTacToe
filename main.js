// 1. Menace goes first
// 2. Loose remove the beads
// 3. Win add 3 more beads
// 4. Draw 1 beads

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

let stats = {"menaceWin":0, "menaceDraw":0, "menaceLost":0, "totalMatch":0, "gameHistory":[]}
gameInfo = {"startTime": Date.UTC}

let circleTurn

startGame()

cellElements.forEach(cell => {
	cell.addEventListener('click', handleClick, { once: true })
})

function startGame() {
	circleTurn = false
	cellElements.forEach(cell => {
		cell.addEventListener('click', handleClick, { once: true })
	})
	setBoardHoverClass
}

function handleClick(e) {
	const cell = e.target
	const currentClass = circleTurn ? CIRCLE_CLASS : X_CLASS
	placeMark(cell, currentClass)
	if (checkWin(currentClass)) endGame(false);
	else if (isDraw()) endGame(true)
	else {
		swapTurns()
		setBoardHoverClass()
	}
}

function endGame(draw) {
	if (draw) {
		console.log("Draw")
	} else console.log(`${circleTurn ? "O Win's" : "X wins"}`)
	document.getElementById("header").innerHTML = `${circleTurn ? "O Win's" : "X wins"}`;
	lockBoard();

}

function isDraw() {
	return [...cellElements].every(cell => {
		return cell.classList.contains(X_CLASS) || cell.classList.contains(CIRCLE_CLASS)
	})
}

function placeMark(cell, currentClass) {
	cell.classList.add(currentClass)
}

function swapTurns() {
	circleTurn = !circleTurn
}

function lockBoard(){
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

let flatten = arr => arr.reduce((carry, item) => carry.concat(item), [])

let gameCells = 9

let getAllGameStates = gameCells => {
    let possibleMoves = '012'.split('') // X --> 1, O --> 2, empty position --> 0
    let lengthen = word => possibleMoves.map(letter => word + letter)
    let addLetters = words => flatten(words.map(lengthen))
    let _getAllWords = (letters, words = possibleMoves, current = 1) => {
        return letters == current ? words : 
            _getAllWords(letters, addLetters(words), current + 1)
    }

    return _getAllWords(gameCells)
}


