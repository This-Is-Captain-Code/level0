
import { Devvit } from '@devvit/public-api';
import { useState } from '@devvit/public-api';

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

const LOCATIONS = [
  { country: 'Japan', image: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989'},
  { country: 'France', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34'},
  { country: 'Australia', image: 'https://images.unsplash.com/photo-1523482580672-f109ba88220b'},
  { country: 'USA', image: 'https://images.unsplash.com/photo-1485871981521-5b1fd3805eee'},
  { country: 'UK', image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad'}
];

Devvit.addCustomPostType({
  name: 'GeoGuessr Game',
  render: (context) => {
    const [gameState, setGameState] = useState({
      score: 0,
      currentLocationIndex: -1,
      showImage: false,
      gameStarted: false
    });

    const startGame = () => {
      const randomIndex = Math.floor(Math.random() * LOCATIONS.length);
      setGameState({
        score: 0,
        currentLocationIndex: randomIndex,
        showImage: true,
        gameStarted: true
      });

      setTimeout(() => {
        setGameState(prev => ({ ...prev, showImage: false }));
      }, 5000);
    };

    const handleGuess = (guessedCountry: string) => {
      const correct = LOCATIONS[gameState.currentLocationIndex].country === guessedCountry;
      const newScore = correct ? gameState.score + 100 : gameState.score;
      
      context.ui.showToast(correct ? 
        `Correct! +100 points` : 
        `Wrong! It was ${LOCATIONS[gameState.currentLocationIndex].country}`
      );

      const nextIndex = Math.floor(Math.random() * LOCATIONS.length);
      setGameState({
        score: newScore,
        currentLocationIndex: nextIndex,
        showImage: true,
        gameStarted: true
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
                {LOCATIONS.map((location) => (
                  <button
                    key={location.country}
                    onPress={() => handleGuess(location.country)}
                  >
                    {location.country}
                  </button>
                ))}
              </vstack>
            )}
          </vstack>
        )}
      </vstack>
    );
  }
});

export default Devvit;
