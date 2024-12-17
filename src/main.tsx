
import { Devvit } from '@devvit/public-api';
import { useState } from '@devvit/public-api';

Devvit.configure({
  redditAPI: true,
});

const LOCATIONS = [
  { name: 'Mount Fuji, Japan', image: 'https://images.unsplash.com/photo-1490806843957-31f4c9a91c65'},
  { name: 'Paris, France', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34'},
  { name: 'Sydney, Australia', image: 'https://images.unsplash.com/photo-1523482580672-f109ba88220b'},
  { name: 'New York, USA', image: 'https://images.unsplash.com/photo-1485871981521-5b1fd3805eee'},
  { name: 'London, UK', image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad'}
];

Devvit.addCustomPostType({
  name: 'GeoGuessr Game',
  render: (context) => {
    const [gameState, setGameState] = useState({
      score: 0,
      currentLocationIndex: -1,
      showImage: false,
      gameStarted: false,
      guess: '',
      feedback: ''
    });

    const startGame = () => {
      const randomIndex = Math.floor(Math.random() * LOCATIONS.length);
      setGameState({
        score: 0,
        currentLocationIndex: randomIndex,
        showImage: true,
        gameStarted: true,
        guess: '',
        feedback: ''
      });

      // Hide image after 5 seconds
      setTimeout(() => {
        setGameState(prev => ({ ...prev, showImage: false }));
      }, 5000);
    };

    const handleGuess = () => {
      const location = LOCATIONS[gameState.currentLocationIndex];
      const isCorrect = gameState.guess.toLowerCase() === location.name.toLowerCase();
      const newScore = isCorrect ? gameState.score + 100 : gameState.score;
      const feedback = isCorrect ? 
        'Correct! +100 points' : 
        `Wrong! It was ${location.name}`;

      context.ui.showToast(feedback);

      // Move to next location
      const nextIndex = Math.floor(Math.random() * LOCATIONS.length);
      setGameState({
        score: newScore,
        currentLocationIndex: nextIndex,
        showImage: true,
        gameStarted: true,
        guess: '',
        feedback
      });

      setTimeout(() => {
        setGameState(prev => ({ ...prev, showImage: false }));
      }, 5000);
    };

    return (
      <vstack gap="medium" alignment="center">
        <text size="xlarge">GeoGuessr Challenge</text>
        {!gameState.gameStarted ? (
          <button appearance="primary" onPress={startGame}>
            Start Game
          </button>
        ) : (
          <vstack gap="medium" alignment="center">
            <text size="large">Score: {gameState.score}</text>
            {gameState.showImage && (
              <image
                url={LOCATIONS[gameState.currentLocationIndex].image}
                height={300}
              />
            )}
            {!gameState.showImage && (
              <vstack gap="small">
                <textinput
                  placeholder="Enter location name..."
                  value={gameState.guess}
                  onChange={value => setGameState(prev => ({ ...prev, guess: value }))}
                />
                <button onPress={handleGuess}>
                  Submit Guess
                </button>
              </vstack>
            )}
            {gameState.feedback && (
              <text>{gameState.feedback}</text>
            )}
          </vstack>
        )}
      </vstack>
    );
  }
});

export default Devvit;
