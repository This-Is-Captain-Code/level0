
let timer;
let currentGame;

async function getCurrentGame() {
  const response = await fetch('/api/current_game');
  return response.json();
}

async function startGame() {
  const image = document.getElementById('countryImage');
  const timerDisplay = document.getElementById('timeLeft');
  const inputSection = document.getElementById('inputSection');
  let timeLeft = 5;

  try {
    currentGame = await getCurrentGame();
    image.src = currentGame.url;
  } catch (err) {
    console.error('Failed to fetch game data:', err);
    return;
  }

  image.style.display = 'block';
  timerDisplay.textContent = timeLeft;

  timer = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = timeLeft;
    
    if (timeLeft === 0) {
      clearInterval(timer);
      image.style.display = 'none';
      inputSection.style.display = 'block';
    }
  }, 1000);
}

document.getElementById('submitBtn').addEventListener('click', () => {
  const userAnswer = document.getElementById('answer').value;
  const result = document.getElementById('result');
  const playAgain = document.getElementById('playAgain');
  const inputSection = document.getElementById('inputSection');
  
  inputSection.style.display = 'none';
  result.style.display = 'block';
  result.textContent = userAnswer.toLowerCase() === currentGame.answer.toLowerCase() 
    ? 'Correct!' 
    : `Wrong! The answer was ${currentGame.answer}`;
  playAgain.style.display = 'block';
});

document.getElementById('playAgain').addEventListener('click', () => {
  location.reload();
});

window.onload = startGame;
