
let timer;
let correctAnswer = '';
let gameImage = '';

window.onload = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const mode = urlParams.get('mode');
  const imageUrl = urlParams.get('imageUrl');
  const location = urlParams.get('location');

  if (mode === 'play' && imageUrl && location) {
    gameImage = decodeURIComponent(imageUrl);
    correctAnswer = decodeURIComponent(location);
    startGame();
  }
};

function startGame() {
  const image = document.getElementById('countryImage');
  const timerDisplay = document.getElementById('timeLeft');
  const inputSection = document.getElementById('inputSection');
  let timeLeft = 5;

  image.src = gameImage;
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
  result.textContent = userAnswer.toLowerCase() === correctAnswer.toLowerCase() 
    ? 'Correct!' 
    : `Wrong! The answer was ${correctAnswer}`;
  playAgain.style.display = 'block';
});

document.getElementById('playAgain').addEventListener('click', () => {
  location.reload();
});
