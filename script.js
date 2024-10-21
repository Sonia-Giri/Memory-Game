const gameBoard = document.querySelector(".game-board");
const timeDisplay = document.getElementById("time");
const restartBtn = document.getElementById("restart-btn");
const playBtn = document.getElementById("play-btn");
const pauseBtn = document.getElementById("pause-btn");
const leaderboardList = document.getElementById("leaderboard-list");

let cards = [];
let flippedCards = [];
let matchedCards = [];
let timer;
let time = 0;
let gameStarted = false;
let gamePaused = false; // To track if the game is paused

const cardIcons = ["🍎", "🍇", "🍉", "🍌", "🍓", "🍍", "🍑", "🍒"];
let cardArray = [...cardIcons, ...cardIcons]; // Duplicate to create pairs

function shuffle(array) {
  return array.sort(() => 0.5 - Math.random());
}

function initGame() {
  gameBoard.innerHTML = "";
  flippedCards = [];
  matchedCards = [];
  cardArray = shuffle(cardArray);
  cardArray.forEach((icon) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.icon = icon;
    card.innerHTML = "?";
    gameBoard.appendChild(card);
    card.addEventListener("click", flipCard);
  });
  resetTimer();
  gameStarted = false;
  gamePaused = false;
  playBtn.disabled = false;
  pauseBtn.disabled = true;
  restartBtn.disabled = true;
}

function flipCard() {
  if (
    !gameStarted ||
    gamePaused ||
    flippedCards.length >= 2 ||
    this.classList.contains("flipped")
  )
    return;

  this.classList.add("flipped");
  this.innerHTML = this.dataset.icon;
  flippedCards.push(this);

  if (flippedCards.length === 2) {
    checkMatch();
  }
}

function checkMatch() {
  const [card1, card2] = flippedCards;
  if (card1.dataset.icon === card2.dataset.icon) {
    card1.classList.add("match");
    card2.classList.add("match");
    matchedCards.push(card1, card2);
    flippedCards = [];

    if (matchedCards.length === cardArray.length) {
      clearInterval(timer);
      alert(`You won! Time: ${time}s`);
      updateLeaderboard(time);
    }
  } else {
    setTimeout(() => {
      card1.classList.remove("flipped");
      card2.classList.remove("flipped");
      card1.innerHTML = "?";
      card2.innerHTML = "?";
      flippedCards = [];
    }, 1000);
  }
}

function startTimer() {
  timer = setInterval(() => {
    time++;
    timeDisplay.innerText = time;
  }, 1000);
}

function resetTimer() {
  clearInterval(timer);
  time = 0;
  timeDisplay.innerText = time;
}

function updateLeaderboard(time) {
  const listItem = document.createElement("li");
  listItem.textContent = `Time: ${time}s`;
  leaderboardList.appendChild(listItem);
}

// Play button functionality: Starts the game and the timer
playBtn.addEventListener("click", () => {
  if (!gameStarted) {
    gameStarted = true;
    gamePaused = false;
    playBtn.disabled = true;
    pauseBtn.disabled = false;
    restartBtn.disabled = false;
    startTimer();
  }
});

// Pause/Resume button functionality
pauseBtn.addEventListener("click", () => {
  if (gameStarted) {
    if (!gamePaused) {
      clearInterval(timer); // Stop the timer
      gamePaused = true;
      pauseBtn.textContent = "Resume";
    } else {
      startTimer(); // Resume the timer
      gamePaused = false;
      pauseBtn.textContent = "Pause";
    }
  }
});

// Restart button functionality: Resets the game
restartBtn.addEventListener("click", initGame);

// Initialize on load
window.onload = initGame;
