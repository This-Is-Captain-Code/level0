
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
    document.getElementById('uploadScreen').style.display = 'block';
    document.getElementById('viewLeaderboardBtn').style.display = 'block';
    addToLeaderboard(score);
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
  document.getElementById('uploadScreen').style.display = 'none';
  document.getElementById('result').style.display = 'none';
  document.getElementById('playAgain').style.display = 'none';
  startGame();
});

document.getElementById('uploadBtn').addEventListener('click', () => {
  const countryName = document.getElementById('countryName').value;
  const fileInput = document.getElementById('countryImageUpload');
  const file = fileInput.files[0];

  if (!countryName || !file) {
    alert('Please provide both country name and image');
    return;
  }

  const reader = new FileReader();
  reader.onload = function(e) {
    const newCountry = {
      name: countryName,
      image: e.target.result
    };
    countries.push(newCountry);
    unusedCountries.push(newCountry);
    alert('Country added successfully!');
    document.getElementById('countryName').value = '';
    fileInput.value = '';
  };
  reader.readAsDataURL(file);
});

function updateLeaderboard() {
  const leaderboard = JSON.parse(localStorage.getItem('leaderboard') || '[]');
  const leaderboardList = document.getElementById('leaderboardList');
  leaderboardList.innerHTML = '';
  
  leaderboard
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .forEach((entry, index) => {
      const div = document.createElement('div');
      div.className = 'leaderboard-entry';
      div.textContent = `${index + 1}. u/${entry.username} - Score: ${entry.score}`;
      leaderboardList.appendChild(div);
    });
}

function addToLeaderboard(score) {
  // Get username from Reddit context
  window.parent.postMessage({ type: 'getRedditUsername' }, '*');
  window.addEventListener('message', function handleMessage(e) {
    if (e.data.type === 'redditUsername') {
      const username = e.data.username;
      const leaderboard = JSON.parse(localStorage.getItem('leaderboard') || '[]');
      leaderboard.push({ 
        username, 
        score, 
        date: new Date().toISOString() 
      });
      localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
      updateLeaderboard();
      window.removeEventListener('message', handleMessage);
    }
  });
}

document.getElementById('startBtn').addEventListener('click', () => {
  document.getElementById('startScreen').style.display = 'none';
  document.getElementById('gameScreen').style.display = 'block';
  startGame();
});

document.getElementById('viewLeaderboardBtn').addEventListener('click', () => {
  document.getElementById('startScreen').style.display = 'none';
  document.getElementById('leaderboard').style.display = 'block';
  updateLeaderboard();
});

document.getElementById('backFromLeaderboard').addEventListener('click', () => {
  document.getElementById('leaderboard').style.display = 'none';
  document.getElementById('startScreen').style.display = 'block';
});

document.getElementById('addCountryBtn').addEventListener('click', () => {
  document.getElementById('gameScreen').style.display = 'none';
  document.getElementById('uploadScreen').style.display = 'block';
});

document.getElementById('backFromUpload').addEventListener('click', () => {
  document.getElementById('uploadScreen').style.display = 'none';
  document.getElementById('gameScreen').style.display = 'block';
});

window.onload = () => {
  document.getElementById('startScreen').style.display = 'block';
};
