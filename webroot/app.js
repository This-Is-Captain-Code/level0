
let timer;
let currentAnswer;

async function getRandomImage() {
  const response = await fetch('/api/random-image');
  const data = await response.json();
  return data;
}

async function startGame() {
  const image = document.getElementById('countryImage');
  const timerDisplay = document.getElementById('timeLeft');
  const inputSection = document.getElementById('inputSection');
  let timeLeft = 5;

  // Get random image and its answer
  const imageData = await getRandomImage();
  image.src = imageData.url;
  currentAnswer = imageData.answer;

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
  result.textContent = userAnswer.toLowerCase() === currentAnswer.toLowerCase() 
    ? 'Correct!' 
    : `Wrong! The answer was ${currentAnswer}`;
  playAgain.style.display = 'block';
});

document.getElementById('playAgain').addEventListener('click', () => {
  location.reload();
});

window.onload = startGame;
