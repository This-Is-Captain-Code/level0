
let timer;
let correctAnswer = '';
let gameImage = '';

function getUrlParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    imageUrl: params.get('imageUrl'),
    answer: params.get('answer')
  };
}

window.onload = () => {
  const { imageUrl, answer } = getUrlParams();
  if (imageUrl && answer) {
    gameImage = imageUrl;
    correctAnswer = answer;
    document.getElementById('createScreen').style.display = 'none';
    document.getElementById('gameScreen').style.display = 'block';
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
