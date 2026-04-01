import { generate } from 'https://esm.sh/random-words';

let secretWord = "";
let currentRow = 0;
let currentTile = 0;
let currentGuess = "";
let isGameOver = false;

const rows = document.querySelectorAll('.grid');
const messageElement = document.getElementById('message-container');
const resetBtn = document.getElementById('reset-btn');

async function initGame() {
    secretWord = generate({ minLength: 5, maxLength: 5 }).toUpperCase();
    currentRow = 0;
    currentTile = 0;
    currentGuess = "";
    isGameOver = false;
    
    console.log("Solution:", secretWord);
    messageElement.textContent = "";
    
    document.querySelectorAll('.cell').forEach(cell => {
        cell.textContent = "";
        cell.classList.remove('correct', 'present', 'absent');
        cell.style.color = "black";
    });

    displayStreak();
    if (resetBtn) resetBtn.blur();
}

window.addEventListener('keydown', (e) => {
    if (isGameOver) return;
    const key = e.key;

    if (key.length === 1 && key.match(/[a-z]/i) && currentTile < 5) {
        const tiles = rows[currentRow].querySelectorAll('.cell');
        tiles[currentTile].textContent = key.toUpperCase();
        currentGuess += key.toUpperCase();
        currentTile++;
    }

    if (key === 'Backspace' && currentTile > 0) {
        currentTile--;
        const tiles = rows[currentRow].querySelectorAll('.cell');
        tiles[currentTile].textContent = "";
        currentGuess = currentGuess.slice(0, -1);
    }

    if (key === 'Enter' && currentTile === 5) {
        commitGuess();
    }
});

function commitGuess() {
    const tiles = rows[currentRow].querySelectorAll('.cell');
    let used = Array(5).fill(false);
    let statuses = Array(5).fill("absent");

    // green
    for (let i = 0; i < 5; i++) {
        if (currentGuess[i] === secretWord[i]) {
            statuses[i] = "correct";
            used[i] = true;
        }
    }

    // yellow
    for (let i = 0; i < 5; i++) {
        if (statuses[i] === "correct") continue;
        for (let j = 0; j < 5; j++) {
            if (!used[j] && currentGuess[i] === secretWord[j]) {
                statuses[i] = "present";
                used[j] = true;
                break;
            }
        }
    }

 
    tiles.forEach((tile, index) => {
        tile.classList.add(statuses[index]);
    });

    // Check Win/Loss
    if (currentGuess === secretWord) {
        messageElement.textContent = "Splendid! 🎉";
        isGameOver = true;
        updateStreak(true);
        return;
    }

    if (currentRow >= 5) {
        messageElement.textContent = `Game Over! Word was ${secretWord}`;
        isGameOver = true;
        updateStreak(false);
        return;
    }

    currentRow++;
    currentTile = 0;
    currentGuess = "";
}

function updateStreak(isWin) {
    let streak = parseInt(localStorage.getItem('wordle-streak')) || 0;
    streak = isWin ? streak + 1 : 0;
    localStorage.setItem('wordle-streak', streak);
    displayStreak();
}

function displayStreak() {
    const streak = localStorage.getItem('wordle-streak') || 0;
    const streakDisplay = document.getElementById('streak-count');
    if (streakDisplay) streakDisplay.textContent = `Win Streak: ${streak}`;
}

resetBtn.addEventListener('click', initGame);
initGame();