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
var winner
const BETA = 3
const GAMMA = -1
const DELTA = 1
var record_moves = new Array()
var record_pos = new Array()

var record_movesM2 = new Array()
var record_posM2 = new Array()


var mv
var mvM2

var matchBoxes = [];
var matchBoxesMenace2 = [];
// 1 = menace vs human, 2 = menace Vs menace, 3 = menace vs perfect 
gameType = 2;

let stats = { "menaceWin": 0, "menaceDraw": 0, "menaceLost": 0, "totalMatch": 0, "gameHistory": [], "matchLength": 0 }
// D - Draw, W - Menace Win, L - Menace Lost  
gameInfo = { "startTime": Date.now(), "endTime": Date.now(), "numberOfMenaceMoves": 0, "gameStatus": "" }

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
		if (gameType = 2) {
			matchBoxesMenace2[element] = temp
		}
	}
	logGame("Making the matchboxes and beads ready for you...")
}

function random_item(items) {
	console.log("items ", items)
	currentMove = items[Math.floor(Math.random() * items.length)];
	console.log("current move of items ", currentMove)
	if (currentMove >= 0 || currentMove <= 8)
		return currentMove
	else
		return 0
}

function getBead(currentBoardState) {
	var beads = matchBoxes[currentBoardState]
	console.log("beads", beads)
	var currentMove = random_item(beads)
	record_pos[mv] = currentBoardState
	record_moves[mv] = currentMove
	mv++
	return currentMove
}

function getBeadMenace2(currentBoardState) {
	var beads = matchBoxesMenace2[currentBoardState]
	var currentMove = random_item(beads)
	record_pos[mvM2] = currentBoardState
	record_moves[mvM2] = currentMove
	mvM2++
	return currentMove
}




cellElements.forEach(cell => {
	cell.addEventListener('click', handleClick, { once: true })
})

function startGame() {
	mv = 0
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
	console
	var currentMove = getBead(currentBoardState)
	console.log("Menace 1 cuurent ", currentMove)

	placeMarkMenace(currentMove, currentClass)
	if (checkWin(currentClass)) endGame(false);
	else if (isDraw()) endGame(true)
	else {
		swapTurns()
		setBoardHoverClass()
	}
	if (gameType == 2 || gameType == 3) {
		window.setTimeout(playMenace2, 1000)
	}
}

function playMenace2() {
	const currentClass = circleTurn ? CIRCLE_CLASS : X_CLASS
	var currentBoardState = getBoardState()
	var currentMove = getBeadMenace2(currentBoardState)
	console.log("Menace 2 cuurent ", currentMove)
	placeMarkMenace(currentMove, currentClass)
	if (checkWin(currentClass)) endGame(false);
	else if (isDraw()) endGame(true)
	else {
		swapTurns()
		setBoardHoverClass()
	}
	playMenace()
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
	stats.totalMatch++
	if (draw) {
		document.getElementById("header").innerHTML = `Match Draw`;
		winner = "Draw"
		console.log(winner)
		logGame(winner)
		gameInfo.gameStatus = "D"
		stats.menaceDraw++
	} else {
		document.getElementById("header").innerHTML = `${circleTurn ? "O Win's" : "X wins"}`;
		winner = circleTurn ? "O" : "X"
		console.log(`${winner} Win's`);
		logGame(`${winner} Win's`)
		postmortem()
		gameInfo.gameStatus = `${circleTurn ? "L" : "W"}`
		if (winner == "X")
			stats.menaceWin++
		else if (winner == "O")
			stats.menaceLost++
	}
	lockBoard();
	updateGameInfo();
	if (gameType == 2 || gameType == 3)
		restart()
}

function updateGameInfo() {
	gameInfo.endTime = Date.now()
	gameInfo.matchLength = gameInfo.endTime - gameInfo.startTime;
	stats.gameHistory.push(gameInfo)
	logGame(JSON.stringify(stats))
}

function restart() {
	clearBoard();
	publishgraphs();
	circleTurn = false
	cellElements.forEach(cell => {
		cell.addEventListener('click', handleClick, { once: true })
	})
	setBoardHoverClass
	logGame("Starting the new game !")
	playMenace()
}

function clearBoard() {
	cellElements.forEach(cell => {
		cell.classList.remove(X_CLASS)
		cell.classList.remove(CIRCLE_CLASS)
	})
	cellElements.forEach(cell => {
		cell.addEventListener('click', handleClick, { once: true })
	})
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
	console.log("index ", idx)
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

function postmortem() {
	var adjacements
	if (winner == "X") adjacements = BETA
	else if (winner == "O") adjacements = GAMMA
	else if (winner == "Draw") adjacements = DELTA
	for (let i = 0; i < mv; i++)
		matchBoxes[record_pos[i]].push(record_moves[i])
	// matchBoxes[record_pos[i]][record_moves[i]] += adjacements
	if (gameType == 2) {
		if (winner == "O") adjacements = BETA
		else if (winner == "X") adjacements = GAMMA
		else if (winner == "Draw") adjacements = DELTA
		for (let i = 0; i < mvM2; i++)
			matchBoxes[record_posM2[i]].push(record_movesM2[i])
		// for (let j = 0; j < mvM2; j++) matchBoxesMenace2[record_posM2[i]][record_movesM2[i]] += adjacements
	}


}

function publishgraphs() {

	document.getElementById("total").innerText = stats.totalMatch
	document.getElementById("win").innerText = stats.menaceWin
	document.getElementById("lost").innerText = stats.menaceLost


	Highcharts.chart('container', {

		title: {
			text: 'Graph of Menance wins'
		},

		subtitle: {
			text: ''
		},

		yAxis: {
			title: {
				text: 'Number of Wins'
			}
		},

		xAxis: {
			accessibility: {
				rangeDescription: 'Range: 0 to 10'
			}
		},

		legend: {
			layout: 'vertical',
			align: 'right',
			verticalAlign: 'middle'
		},

		plotOptions: {
			series: {
				label: {
					connectorAllowed: false
				},
				pointStart: 0
			}
		},

		series: [{
			name: 'Menance',
			data: [0, 1, 2, 3, 4, 5, 6, 7]
		}],

		responsive: {
			rules: [{
				condition: {
					maxWidth: 500
				},
				chartOptions: {
					legend: {
						layout: 'horizontal',
						align: 'center',
						verticalAlign: 'bottom'
					}
				}
			}]
		}

	});

	Highcharts.chart('container1', {
		chart: {
			type: 'column'
		},
		title: {
			text: 'Graph of Human wins'
		},
		subtitle: {
			text: ''
		},
		xAxis: {
			categories: [
				'0',
				'1',
				'2',
				'3',
				'4',
				'5',
				'6',
				'7',
				'8',
				'9',
				'10',
				'11'
			],
			crosshair: true
		},
		yAxis: {
			min: 0,
			title: {
				text: 'Number of Wins'
			}
		},
		tooltip: {
			headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
			pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
				'<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
			footerFormat: '</table>',
			shared: true,
			useHTML: true
		},
		plotOptions: {
			column: {
				pointPadding: 0.2,
				borderWidth: 0
			}
		},
		series: [{
			name: 'Human',
			data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]

		}, {
			name: 'Menance',
			data: [83.6, 78.8, 98.5, 93.4, 106.0, 84.5, 105.0, 104.3, 91.2, 83.5, 106.6, 92.3]

		}]
	});
}

publishgraphs()
startGame()