
import { Devvit } from '@devvit/public-api';

Devvit.configure({
  redditAPI: true,
});

Devvit.addMenuItem({
  label: 'GeoGuessr Game',
  location: 'subreddit',
  forUserType: 'moderator',
  onPress: async (_event, context) => {
    const { reddit, ui } = context;
    ui.showToast("Creating GeoGuessr game post...");
    
    const subreddit = await reddit.getCurrentSubreddit();
    await reddit.submitPost({
      title: 'GeoGuessr Challenge',
      subredditName: subreddit.name,
    });
  },
});

Devvit.addCustomPostType({
  name: 'GeoGuessr Game',
  render: (context) => {
    return (
      <vstack gap="medium" alignment="center">
        <text size="xlarge">GeoGuessr Challenge</text>
        <button onPress={async () => {
          const html = `
            <!DOCTYPE html>
            <html>
              <head>
                <style>
                  body { font-family: Arial; margin: 20px; }
                  #gameContainer { max-width: 800px; margin: auto; }
                  .button { padding: 10px 20px; margin: 5px; cursor: pointer; }
                  #locationImage { max-width: 100%; height: auto; }
                </style>
              </head>
              <body>
                <div id="gameContainer">
                  <h1>GeoGuessr Challenge</h1>
                  <div id="gameArea">
                    <img id="locationImage" style="display: none;">
                    <div id="options"></div>
                  </div>
                  <p id="score">Score: 0</p>
                  <button class="button" onclick="startGame()">Start Game</button>
                </div>
                <script>
                  const locations = [
                    { country: 'Japan', image: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989'},
                    { country: 'France', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34'},
                    { country: 'Australia', image: 'https://images.unsplash.com/photo-1523482580672-f109ba88220b'},
                    { country: 'USA', image: 'https://images.unsplash.com/photo-1485871981521-5b1fd3805eee'},
                    { country: 'UK', image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad'}
                  ];
                  let currentLocation;
                  let score = 0;
                  
                  function startGame() {
                    score = 0;
                    document.getElementById('score').textContent = 'Score: 0';
                    showNextLocation();
                  }
                  
                  function showNextLocation() {
                    currentLocation = locations[Math.floor(Math.random() * locations.length)];
                    const img = document.getElementById('locationImage');
                    img.src = currentLocation.image;
                    img.style.display = 'block';
                    
                    const options = locations.map(l => l.country);
                    const optionsHtml = options.map(country => 
                      \`<button class="button" onclick="guess('\${country}')">\${country}</button>\`
                    ).join('');
                    
                    document.getElementById('options').innerHTML = optionsHtml;
                    
                    setTimeout(() => {
                      img.style.display = 'none';
                    }, 5000);
                  }
                  
                  function guess(country) {
                    if (country === currentLocation.country) {
                      score += 100;
                      alert('Correct! +100 points');
                    } else {
                      alert('Wrong! The correct answer was ' + currentLocation.country);
                    }
                    document.getElementById('score').textContent = 'Score: ' + score;
                    showNextLocation();
                  }
                </script>
              </body>
            </html>
          `;
          
          context.ui.showWebView({ html, height: '600px' });
        }}>
          Play Game
        </button>
      </vstack>
    );
  }
});

export default Devvit;
