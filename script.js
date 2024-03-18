document.addEventListener('DOMContentLoaded', function() {
    const energyElement = document.getElementById('energy');
    const attemptsElement = document.getElementById('attempts');
    const hintText = document.getElementById('hintText');
    const gameGrid = document.getElementById('gameGrid');
    let energy = 100;
    let attempts = 0;
    let rewardCellIndex = selectRewardCell();
    const gridSize = 7; // Size of the grid (7x7)

    // Initialize the game grid
    for (let i = 0; i < gridSize * gridSize; i++) {
        let cell = document.createElement('div');
        cell.className = 'gameCell';
        cell.id = `cell-${i}`;
        cell.addEventListener('click', () => guess(cell, i));
        gameGrid.appendChild(cell);
    }

    function selectRewardCell() {
        const probabilities = [
            16, 8, 8, 4, 8, 8, 16,
            8, 4, 8, 2, 8, 4, 8,
            8, 8, 8, 4, 8, 8, 8,
            4, 2, 4, 1, 4, 2, 4,
            8, 8, 8, 4, 8, 8, 8,
            8, 4, 8, 2, 8, 4, 8,
            16, 8, 8, 4, 8, 8, 16
        ];
        let total = probabilities.reduce((a, b) => a + b, 0);
        let random = Math.random() * total;
        for (let i = 0; i < probabilities.length; i++) {
            if (random < probabilities[i]) {
                return i;
            }
            random -= probabilities[i];
        }
        return 0; // Fallback
    }

function guess(cell, index) {
    if (cell.classList.contains('disabled')) {
        // Cell is already guessed or disabled
        return;
    }

    attempts++;
    energy--; // Deduct 1 energy point for each guess

    if (index === rewardCellIndex) {
        // Correct guess
        handleCorrectGuess();
    } else {
        // Provide specific directional hint
        provideHint(index, rewardCellIndex);
    }

    updateStats();
}

function handleCorrectGuess() {
    // Add energy points based on the guess count
    switch (attempts) {
        case 1:
            energy += 32;
            break;
        case 2:
            energy += 16;
            break;
        case 3:
            energy += 8;
            break;
        case 4:
            energy += 4;
            break;
        case 5:
            energy += 2;
            break;
        default:
            energy += 1;
            break;
    }

    // Ensure energy does not exceed 100 points
    energy = Math.min(energy, 100);

    // Update hint text
    hintText.textContent = "Congratulations! You've found the reward!";

    const correctCell = document.getElementById(`cell-${rewardCellIndex}`);
    correctCell.classList.add('found'); // Change color of the correct cell to gold

    // Reset game state after a short delay for visual effect (if desired)
    resetGame();
}

function resetGame() {
    setTimeout(function() {
        // Reset golden cell
        const goldenCells = document.querySelectorAll('.found');
        goldenCells.forEach(cell => {
            cell.classList.remove('found');
        });

        // Reset game state
        hintText.textContent = ""; // Clear hint text
        updateStats(); // Update game statistics display

        rewardCellIndex = selectRewardCell(); // Reset reward cell for new round

        if (attempts >= 150) {
            // Congratulations message and make all cells golden
            hintText.textContent = "Congratulations! You've reached 150 attempts!";
            const allCells = document.querySelectorAll('.gameCell');
            allCells.forEach(cell => {
                cell.classList.add('found');
            });
        } else {
            enableAllCells(); // Enable all cells for the new round
        }
    }, 1800);
}

function enableAllCells() {
    const cells = document.querySelectorAll('.gameCell');
    cells.forEach(cell => {
        cell.classList.remove('disabled');
    });
}


    function provideHint(guessIndex, rewardIndex) {
        const guessRow = Math.floor(guessIndex / gridSize);
        const guessCol = guessIndex % gridSize;
        const rewardRow = Math.floor(rewardIndex / gridSize);
        const rewardCol = rewardIndex % gridSize;

        if (guessRow > rewardRow) {
            hintText.textContent = "Up";
            disableCellsBelow(guessRow);
        } else if (guessRow < rewardRow) {
            hintText.textContent = "Down";
            disableCellsAbove(guessRow);
        } else if (guessCol > rewardCol) {
            hintText.textContent = "To the left";
            disableCellsRightOf(guessCol);
        } else {
            hintText.textContent = "To the right";
            disableCellsLeftOf(guessCol);
        }
    }

    function updateStats() {
        energyElement.textContent = energy;
        attemptsElement.textContent = `${attempts} / 150`;
        if (energy <= 0 || attempts >= 150) {
            disableAllCells();
            hintText.textContent = "Game Over. Refresh to play again!";
        }
    }

    function disableAllCells() {
        for (let i = 0; i < gridSize * gridSize; i++) {
            document.getElementById(`cell-${i}`).classList.add('disabled');
        }
    }

    function disableCellsBelow(row) {
        for (let i = 0; i < gridSize; i++) {
            for (let j = row; j < gridSize; j++) {
                document.getElementById(`cell-${j * gridSize + i}`).classList.add('disabled');
            }
        }
    }

    function disableCellsAbove(row) {
        for (let i = 0; i < gridSize; i++) {
            for (let j = 0; j <= row; j++) {
                document.getElementById(`cell-${j * gridSize + i}`).classList.add('disabled');
            }
        }
    }

function disableCellsRightOf(col) {
    for (let i = 0; i < gridSize * gridSize; i++) {
        let cellCol = i % gridSize;
        if (cellCol >= col) {
            document.getElementById(`cell-${i}`).classList.add('disabled');
        }
    }
}

function disableCellsLeftOf(col) {
    for (let i = 0; i < gridSize * gridSize; i++) {
        let cellCol = i % gridSize;
        if (cellCol <= col) {
            document.getElementById(`cell-${i}`).classList.add('disabled');
        }
    }
}
});
