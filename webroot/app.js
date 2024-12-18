
let timer;
let correctAnswer = '';
let gameImage = '';

// Parse URL parameters
const urlParams = new URLSearchParams(window.location.search);
const paramImage = urlParams.get('image');
const paramAnswer = urlParams.get('answer');

if (paramImage && paramAnswer) {
  // We're in game mode
  gameImage = decodeURIComponent(paramImage);
  correctAnswer = decodeURIComponent(paramAnswer);
  document.getElementById('createScreen').style.display = 'none';
  document.getElementById('gameScreen').style.display = 'block';
  startGame();
} else {
  // We're in create mode
  document.getElementById('createBtn').addEventListener('click', () => {
    const fileInput = document.getElementById('imageUpload');
    const locationInput = document.getElementById('correctLocation');
    
    if (fileInput.files.length > 0 && locationInput.value) {
      const file = fileInput.files[0];
      const reader = new FileReader();
      
      reader.onload = function(e) {
        // Submit to create endpoint
        const formData = new FormData();
        formData.append('gameImage', e.target.result);
        formData.append('answer', locationInput.value);
        
        // The form will be submitted to Devvit's create endpoint
        const form = document.createElement('form');
        form.method = 'POST';
        form.appendChild(createHiddenInput('gameImage', e.target.result));
        form.appendChild(createHiddenInput('answer', locationInput.value));
        document.body.appendChild(form);
        form.submit();
      };
      
      reader.readAsDataURL(file);
    } else {
      alert('Please upload an image and enter the correct location');
    }
  });
}

function createHiddenInput(name, value) {
  const input = document.createElement('input');
  input.type = 'hidden';
  input.name = name;
  input.value = value;
  return input;
}

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

document.getElementById('submitBtn')?.addEventListener('click', () => {
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

document.getElementById('playAgain')?.addEventListener('click', () => {
  location.reload();
});
