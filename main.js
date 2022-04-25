// 1. Menace goes first
// 2. Loose remove the beads
// 3. Win add 3 more beads
// 4. Draw 1 beads

const cellElements = document.querySelectorAll('[data-cell]')
const board = document.getElementById('board')
const X_CLASS = 'x'
const CIRCLE_CLASS = 'circle'
let circleTurn

cellElements.forEach(cell => {
	cell.addEventListener('click', handleClick, { once: true })
})

function handleClick(e) {
	const cell = e.target
	const currentClass = circleTurn ? CIRCLE_CLASS : X_CLASS
	placeMark(cell, currentClass)
	//check For Win
	//Check for marks
}

function placeMark(cell, currentClass) {
	cell.classList.add(currentClass)
}
