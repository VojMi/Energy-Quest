document.addEventListener("DOMContentLoaded", function() {
    const gridContainer = document.getElementById("grid-container");
    const pointsDisplay = document.getElementById("points");
    const gamesPlayedDisplay = document.getElementById("gamesPlayed");
    const averageScoreDisplay = document.getElementById("averageScore");
    const messageField = document.getElementById("messageField");
    const gridSquares = [];
    let points = 0;
    let totalScore = 0; // Total score accumulated across all games
    let gameCount = -1; // Number of games played
    let treasureValue = 1024; // Initial treasure value
    let treasureRow, treasureCol;

    // Function to generate the grid squares
    function generateGrid() {
        for (let row = 0; row < 7; row++) {
            for (let col = 0; col < 7; col++) {
                const gridSquare = document.createElement("div");
                gridSquare.classList.add("grid-item");
                gridSquare.dataset.row = row;
                gridSquare.dataset.col = col;
                gridSquare.addEventListener("click", handleClick);
                gridContainer.appendChild(gridSquare);
                gridSquares.push(gridSquare);
            }
        }
    }

    // Function to handle click on a grid square
    function handleClick(event) {
        const clickedRow = parseInt(event.target.dataset.row);
        const clickedCol = parseInt(event.target.dataset.col);

        if (clickedRow === treasureRow && clickedCol === treasureCol) {
            // Treasure found
            points += treasureValue;
            pointsDisplay.textContent = points;
            totalScore += treasureValue;
            event.target.classList.add("treasure"); // Add "treasure" class to the cell
            showMessage(`You have found treasure and scored ${treasureValue} points!`, "success");
            setTimeout(startNewRound, 2000); // Pause for 2 seconds
        } else {
            // Incorrect guess
            let clue = "";

            if (clickedRow < treasureRow) {
                clue = "Treasure is down";
                disableSquaresAbove(clickedRow);
            } else if (clickedRow > treasureRow) {
                clue = "Treasure is up";
                disableSquaresBelow(clickedRow);
            } else if (clickedCol < treasureCol) {
                clue = "Treasure is to the right";
                disableSquaresLeft(clickedCol);
            } else if (clickedCol > treasureCol) {
                clue = "Treasure is to the left";
                disableSquaresRight(clickedCol);
            }

            showMessage(clue, "error");
            treasureValue /= 2; // Decrease treasure value by half
        }
    }

    // Function to disable squares above the clicked square
    function disableSquaresAbove(clickedRow) {
        for (let square of gridSquares) {
            const row = parseInt(square.dataset.row);
            if (row < clickedRow) {
                square.classList.add("disabled");
            }
        }
    }

    // Function to disable squares below the clicked square
    function disableSquaresBelow(clickedRow) {
        for (let square of gridSquares) {
            const row = parseInt(square.dataset.row);
            if (row > clickedRow) {
                square.classList.add("disabled");
            }
        }
    }

    // Function to disable squares to the left of the clicked square
    function disableSquaresLeft(clickedCol) {
        for (let square of gridSquares) {
            const col = parseInt(square.dataset.col);
            if (col < clickedCol) {
                square.classList.add("disabled");
            }
        }
    }

    // Function to disable squares to the right of the clicked square
    function disableSquaresRight(clickedCol) {
        for (let square of gridSquares) {
            const col = parseInt(square.dataset.col);
            if (col > clickedCol) {
                square.classList.add("disabled");
            }
        }
    }

    // Function to display message
    function showMessage(message, type) {
        messageField.value = messageField.value + message + "\n"; // Append message to existing content
        messageField.classList.remove("success", "error-message");
        messageField.classList.add(type);
    }

    // Function to start a new round
    function startNewRound() {
        // Increment game count
        gameCount++;
        gamesPlayedDisplay.textContent = gameCount;
        // Update average score
        averageScoreDisplay.textContent = (totalScore / gameCount).toFixed(2);
        // Reset treasure position and value
        treasureRow = Math.floor(Math.random() * 7);
        treasureCol = Math.floor(Math.random() * 7);
        treasureValue = 1024;
        // Remove treasure class from all squares
        for (let square of gridSquares) {
            square.classList.remove("treasure");
            square.classList.remove("disabled");
        }
        // Reset message field
        messageField.value = "";
    }

    // Generate the grid when the DOM content is loaded
    generateGrid();
    // Start the first round
    startNewRound();
});
