let userScore = 0;
let compScore = 0;
const WINNING_SCORE = 5;

const choices = document.querySelectorAll(".choice");
const msg = document.querySelector("#msg");
const userScorePara = document.querySelector("#user-score");
const compScorePara = document.querySelector("#comp-score");
const resetButton = document.querySelector("#reset-button");
const themeBtn = document.querySelector("#theme-btn");
const userBattle = document.querySelector("#user-battle");
const compBattle = document.querySelector("#comp-battle");
const popup = document.querySelector("#winner-popup");
const popupText = document.querySelector("#popup-text");
const playAgain = document.querySelector("#play-again");

// 🌙 Dark Mode
themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  themeBtn.innerText = document.body.classList.contains("dark-mode")
    ? "☀️ Light Mode"
    : "🌙 Dark Mode";
});

// 🎵 Sound Effects
const playSound = (type) => {
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();
  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.6);
  oscillator.type = "sine";
  if (type === "win") {
    oscillator.frequency.setValueAtTime(523, audioCtx.currentTime);
    oscillator.frequency.setValueAtTime(659, audioCtx.currentTime + 0.15);
    oscillator.frequency.setValueAtTime(784, audioCtx.currentTime + 0.3);
  } else if (type === "lose") {
    oscillator.frequency.setValueAtTime(300, audioCtx.currentTime);
    oscillator.frequency.setValueAtTime(200, audioCtx.currentTime + 0.3);
  } else if (type === "draw") {
    oscillator.frequency.setValueAtTime(400, audioCtx.currentTime);
  } else if (type === "champion") {
    oscillator.frequency.setValueAtTime(523, audioCtx.currentTime);
    oscillator.frequency.setValueAtTime(659, audioCtx.currentTime + 0.1);
    oscillator.frequency.setValueAtTime(784, audioCtx.currentTime + 0.2);
    oscillator.frequency.setValueAtTime(1047, audioCtx.currentTime + 0.3);
  }
  oscillator.start(audioCtx.currentTime);
  oscillator.stop(audioCtx.currentTime + 0.6);
};

// 💫 Animation
const addAnimation = (element, animClass) => {
  element.classList.remove(animClass);
  void element.offsetWidth; // reflow trigger
  element.classList.add(animClass);
};

// 🤖 Battle Display Update
const updateBattle = (userChoice, compChoice) => {
  userBattle.innerHTML = `<img src="${userChoice}.png" />`;
  compBattle.innerHTML = `<img src="${compChoice}.png" />`;
};

// Disable/Enable choices
const disableChoices = () => {
  choices.forEach((c) => (c.style.pointerEvents = "none"));
};
const enableChoices = () => {
  choices.forEach((c) => (c.style.pointerEvents = "all"));
};

// 🏆 Check Winner
const checkWinner = () => {
  if (userScore === WINNING_SCORE) {
    msg.innerText = "💪 You won The Match!";
    msg.style.backgroundColor = "green";
    playSound("champion");
    disableChoices();

    popup.style.display = "flex";
    popupText.innerText = "🎉 Congratulations! You Won The Match!";
  } else if (compScore === WINNING_SCORE) {
    msg.innerText = "🤖 Computer Wins! Try Again!";
    msg.style.backgroundColor = "red";
    disableChoices();

    popup.style.display = "flex";
    popupText.innerText = "💻 Congratulations, Winner is Computer!";
  }
};

const genComChoice = () => {
  const options = ["rock", "paper", "scissors"];
  return options[Math.floor(Math.random() * 3)];
};

const drawGame = (userChoice, compChoice) => {
  msg.innerText = "Game was Draw. Play again.";
  msg.style.backgroundColor = "#081b31";
  playSound("draw");
};

const showWinner = (userWin, userChoice, compChoice) => {
  if (userWin) {
    userScore++;
    userScorePara.innerText = userScore;
    msg.innerText = `You win! Your ${userChoice} beats ${compChoice}`;
    msg.style.backgroundColor = "green";
    playSound("win");
    addAnimation(msg, "bounce");
  } else {
    compScore++;
    compScorePara.innerText = compScore;
    msg.innerText = `You lose. ${compChoice} beats your ${userChoice}`;
    msg.style.backgroundColor = "red";
    playSound("lose");
    addAnimation(msg, "shake");
  }
  checkWinner();
};

// Reset
const resetGame = () => {
  userScore = 0;
  compScore = 0;
  userScorePara.innerText = 0;
  compScorePara.innerText = 0;
  msg.innerText = "Play Your Move";
  msg.style.backgroundColor = "#081b31";
  userBattle.innerHTML = "❓";
  compBattle.innerHTML = "❓";
  enableChoices();
};

resetButton.addEventListener("click", resetGame);

playAgain.addEventListener("click", () => {
  popup.style.display = "none";
  resetGame();
});

const playGame = (userChoice) => {
  const compChoice = genComChoice();
  updateBattle(userChoice, compChoice);
  if (userChoice === compChoice) {
    drawGame(userChoice, compChoice);
  } else {
    let userWin;
    if (userChoice === "rock") userWin = compChoice !== "paper";
    else if (userChoice === "paper") userWin = compChoice !== "scissors";
    else if (userChoice === "scissors") userWin = compChoice !== "rock";
    showWinner(userWin, userChoice, compChoice);
  }
};

choices.forEach((choice) => {
  choice.addEventListener("click", () => {
    addAnimation(choice, "bounce");
    playGame(choice.getAttribute("id"));
  });
});
