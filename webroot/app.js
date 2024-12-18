
let timer;
let correctAnswer = '';
let gameImage = '';

document.getElementById('createBtn').addEventListener('click', () => {
  const fileInput = document.getElementById('imageUpload');
  const locationInput = document.getElementById('correctLocation');
  
  if (fileInput.files.length > 0 && locationInput.value) {
    const file = fileInput.files[0];
    const reader = new FileReader();
    
    reader.onload = function(e) {
      gameImage = e.target.result;
      correctAnswer = locationInput.value;
      document.getElementById('createScreen').style.display = 'none';
      document.getElementById('gameScreen').style.display = 'block';
      startGame();
    };
    
    reader.readAsDataURL(file);
  } else {
    alert('Please upload an image and enter the correct location');
  }
});

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
