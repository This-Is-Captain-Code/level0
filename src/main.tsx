
import { Devvit } from '@devvit/public-api';
import { useState } from '@devvit/public-api';

Devvit.configure({
  redditAPI: true,
});

const LOCATIONS = [
  { name: 'Mount Fuji, Japan', image: new URL('./assets/japan.jpg', import.meta.url).href },
  { name: 'Paris, France', image: new URL('./assets/france.jpg', import.meta.url).href },
  { name: 'Sydney, Australia', image: new URL('./assets/australia.jpg', import.meta.url).href },
  { name: 'New York, USA', image: new URL('./assets/usa.jpg', import.meta.url).href },
  { name: 'London, UK', image: new URL('./assets/uk.jpg', import.meta.url).href }
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
      <blocks>
        <vstack gap="medium" alignment="center">
          <text size="xlarge">GeoGuessr Challenge</text>
          {!gameState.gameStarted ? (
            <button appearance="primary" onPress={startGame}>
              Start Game
            </button>
          ) : (
            <vstack gap="medium" alignment="center">
              <text size="large">Score: {gameState.score}</text>
              {gameState.showImage && gameState.currentLocationIndex !== -1 && (
                <image 
                  source={LOCATIONS[gameState.currentLocationIndex].image} 
                  width={300}
                  height={200}
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
      </blocks>
    );
  }
});

export default Devvit;
