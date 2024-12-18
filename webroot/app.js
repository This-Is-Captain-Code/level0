
let timer;
const countries = [
  { image: 'assets/france.jpg', name: 'France' },
  { image: 'assets/japan.jpg', name: 'Japan' },
  { image: 'assets/usa.jpg', name: 'USA' },
  { image: 'assets/uk.jpg', name: 'UK' },
  { image: 'assets/australia.jpg', name: 'Australia' }
];

let currentCountry;
let score = 0;
let currentRound = 0;
let unusedCountries = [...countries];

function getRandomCountry() {
  const randomIndex = Math.floor(Math.random() * unusedCountries.length);
  const country = unusedCountries[randomIndex];
  unusedCountries.splice(randomIndex, 1);
  return country;
}

function startGame() {
  if (unusedCountries.length === 0) {
    unusedCountries = [...countries];
  }
  currentCountry = getRandomCountry();
  const image = document.getElementById('countryImage');
  const timerDisplay = document.getElementById('timeLeft');
  const inputSection = document.getElementById('inputSection');
  const scoreDisplay = document.getElementById('score');
  let timeLeft = 5;

  image.src = currentCountry.image;
  image.style.display = 'block';
  timerDisplay.textContent = timeLeft;
  scoreDisplay.textContent = score;
  
  const charBoxes = document.getElementById('charBoxes');
  charBoxes.innerHTML = '';
  for (let i = 0; i < currentCountry.name.length; i++) {
    const input = document.createElement('input');
    input.type = 'text';
    input.maxLength = 1;
    input.className = 'char-box';
    input.dataset.index = i;
    input.addEventListener('input', handleCharInput);
    input.addEventListener('keydown', handleKeyDown);
    charBoxes.appendChild(input);
  }

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

function nextRound() {
  currentRound++;
  const result = document.getElementById('result');
  const playAgain = document.getElementById('playAgain');
  const inputSection = document.getElementById('inputSection');
  const charBoxes = document.getElementById('charBoxes');

  result.style.display = 'none';
  inputSection.style.display = 'none';
  charBoxes.innerHTML = '';

  if (currentRound < 5) {
    startGame();
  } else {
    result.style.display = 'block';
    result.textContent = `Game Over! Final Score: ${score}/5`;
    playAgain.style.display = 'block';
  }
}

function handleCharInput(e) {
  const currentBox = e.target;
  if (currentBox.value) {
    const nextBox = currentBox.nextElementSibling;
    if (nextBox) nextBox.focus();
  }
}

function handleKeyDown(e) {
  if (e.key === 'Backspace' && !e.target.value) {
    const prevBox = e.target.previousElementSibling;
    if (prevBox) prevBox.focus();
  }
}

document.getElementById('submitBtn').addEventListener('click', () => {
  const boxes = document.querySelectorAll('.char-box');
  const userAnswer = Array.from(boxes).map(box => box.value).join('');
  const result = document.getElementById('result');
  const inputSection = document.getElementById('inputSection');
  
  clearInterval(timer);
  inputSection.style.display = 'none';
  result.style.display = 'block';

  if (userAnswer.toLowerCase() === currentCountry.name.toLowerCase()) {
    score++;
    result.textContent = 'Correct! +1 point';
  } else {
    result.textContent = `Wrong! The answer was ${currentCountry.name}`;
  }

  document.getElementById('score').textContent = score;
  setTimeout(nextRound, 2000);
});

document.getElementById('playAgain').addEventListener('click', () => {
  score = 0;
  currentRound = 0;
  unusedCountries = [...countries];
  location.reload();
});

window.onload = startGame;
