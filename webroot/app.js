
let timer;
let correctAnswer;

function getUrlParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    image: params.get('image'),
    answer: params.get('answer')
  };
}

function startGame() {
  const { image, answer } = getUrlParams();
  correctAnswer = answer || 'France';
  
  const imageElement = document.getElementById('countryImage');
  if (image) {
    imageElement.src = image;
  }
  
  const timerDisplay = document.getElementById('timeLeft');
  const inputSection = document.getElementById('inputSection');
  let timeLeft = 5;

  imageElement.style.display = 'block';
  timerDisplay.textContent = timeLeft;

  timer = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = timeLeft;
    
    if (timeLeft === 0) {
      clearInterval(timer);
      imageElement.style.display = 'none';
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

window.onload = startGame;
