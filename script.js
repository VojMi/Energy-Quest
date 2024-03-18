document.addEventListener('DOMContentLoaded', function() {
    let isPaused = false; // Flag to check if the game is paused
    const energyElement = document.getElementById('energy');
    const attemptsElement = document.getElementById('attempts');
    const hintText = document.getElementById('hintText');
    const gameGrid = document.getElementById('gameGrid');
    let energy = 100;
    let attempts = 0;
    let rewardCellIndex = selectRewardCell();
    const gridSize = 7; // Size of the grid (7x7)
    const clickSound = new Audio('sounds/click.wav');
    const rewardSound = new Audio('sounds/reward.wav');
    const loseSound = new Audio('sounds/loose.wav');
    const victorySound = new Audio('sounds/victory.wav');
    const backgroundMusic = new Audio('sounds/background.mp3');
    // Play background music in a loop
    backgroundMusic.loop = true;
    backgroundMusic.volume = 0.8; // Adjust volume as needed
    backgroundMusic.play(); // Start the background music
	energyBar.textContent = energy + "% Energy"; // Optional: Display text inside the bar

 function startBackgroundMusic() {
        // Play only if not already playing
        if (backgroundMusic.paused) {
            backgroundMusic.play();
            gameGrid.removeEventListener('click', startBackgroundMusic);
        }
    }
    gameGrid.addEventListener('click', startBackgroundMusic);

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
        if (isPaused || cell.classList.contains('disabled')) {
        return;
    }
    cell.classList.add('click-effect');
    setTimeout(() => cell.classList.remove('click-effect'), 100); // Remove the effect after 100ms
        clickSound.play();
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
        isPaused = true; // Pause the game immediately on correct guess
        rewardSound.play();
		
        // Add energy points based on the guess count
        let pointsAdded = getEnergyPointsAdded(attempts);
        energy = Math.min(energy + pointsAdded, 100); // Ensure energy does not exceed 100 points
		
        // Change color of the correct cell to gold
        const correctCell = document.getElementById(`cell-${rewardCellIndex}`);
        correctCell.classList.add('found');
// Construct the message based on the points added
let message = `Congratulations! You've found the reward!<br>${pointsAdded} energy point`;
if (pointsAdded > 1) {
    message += 's'; // Add 's' for plural
}
message += ' added.';

// Update the hint text with the correct grammatical form
hintText.innerHTML = message;
        setTimeout(function() {
            resetGame(); // Start a new round after the pause
        }, 2000);

    }


function resetGame() {
    // Reset golden cells
    const goldenCells = document.querySelectorAll('.found');
    goldenCells.forEach(cell => cell.classList.remove('found'));
    hintText.textContent = ""; // Clear hint text

    // Await before proceeding to reset, ensuring pause-related activities conclude
    setTimeout(function() {
        updateStats(); // Update game statistics display post-pause
        rewardCellIndex = selectRewardCell(); // Choose a new reward cell for the new round

        if (attempts >= 135) {
            victorySound.play();
            // Display congratulations message and visually mark all cells as 'found'
            hintText.textContent = "Congratulations! You've reached 135 attempts!";
            const allCells = document.querySelectorAll('.gameCell');
            allCells.forEach(cell => cell.classList.add('found'));
        } else {
            enableAllCells(); // Re-enable cell interaction for a new round
        }
        isPaused = false; // Important: Re-enable game interactions *after* the pause
    }); // Duration of pause before game reset continues
}

function enableAllCells() {
    const cells = document.querySelectorAll('.gameCell');
    cells.forEach(cell => {
        cell.classList.remove('disabled');
    });
}


  function getEnergyPointsAdded(attempts) {
        switch (attempts) {
            case 1: return 32;
            case 2: return 16;
            case 3: return 8;
            case 4: return 4;
            case 5: return 2;
            default: return 1;
        }
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
    attemptsElement.textContent = `${attempts} / 135`;
    // Update the width of the energy bar
    var energyBar = document.getElementById("energyBar");
    energyBar.style.width = `${energy}%`;
    energyBar.textContent = energy + "% Energy"; // Optional: Display text inside the bar
	    // Change the color based on the energy level
    if (energy > 66) { // High energy: green
        energyBar.style.backgroundColor = "#4CAF50";
    } else if (energy > 33) { // Medium energy: yellow
        energyBar.style.backgroundColor = "#ffeb3b";
    } else { // Low energy: red
        energyBar.style.backgroundColor = "#f44336";
    }
        if (energy <= 0 || attempts >= 135) {
			 loseSound.play();
            disableAllCells();
            hintText.textContent = "Game Over. Refresh to play again!";
        }
    }

    function disableAllCells() {
		backgroundMusic.pause();
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
