
let timer;
let correctAnswer = '';
let gameImage = '';

// Function to communicate with Reddit
async function sendMessage(type, data) {
  return await window.webkit.messageHandlers.replit.postMessage({
    type,
    ...data
  });
}

document.getElementById('createBtn').addEventListener('click', async () => {
  const fileInput = document.getElementById('imageUpload');
  const locationInput = document.getElementById('correctLocation');
  
  if (fileInput.files.length > 0 && locationInput.value) {
    const file = fileInput.files[0];
    const reader = new FileReader();
    
    reader.onload = async function(e) {
      gameImage = e.target.result;
      correctAnswer = locationInput.value;
      
      await sendMessage('submitChallenge', {
        image: gameImage,
        answer: correctAnswer
      });
      
      document.getElementById('createScreen').style.display = 'none';
      document.getElementById('gameScreen').style.display = 'block';
      startGame();
    };
    
    reader.readAsDataURL(file);
  } else {
    alert('Please upload an image and enter the correct location');
  }
});

async function startGame() {
  const response = await sendMessage('loadChallenge', {});
  if (response && response.image) {
    gameImage = response.image;
  }
  
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

document.getElementById('submitBtn').addEventListener('click', async () => {
  const userAnswer = document.getElementById('answer').value;
  const result = document.getElementById('result');
  const playAgain = document.getElementById('playAgain');
  const inputSection = document.getElementById('inputSection');
  
  const response = await sendMessage('checkAnswer', { guess: userAnswer });
  
  inputSection.style.display = 'none';
  result.style.display = 'block';
  result.textContent = response.correct ? 'Correct!' : 'Wrong!';
  playAgain.style.display = 'block';
});

document.getElementById('playAgain').addEventListener('click', () => {
  location.reload();
});

// Load challenge on page load if we're viewing an existing post
window.addEventListener('load', async () => {
  const response = await sendMessage('loadChallenge', {});
  if (response && response.image) {
    gameImage = response.image;
    document.getElementById('createScreen').style.display = 'none';
    document.getElementById('gameScreen').style.display = 'block';
    startGame();
  }
});
