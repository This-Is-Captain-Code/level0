
import { Devvit, useState } from '@devvit/public-api';

Devvit.configure({
  redditAPI: true,
  assets: {
    'japan.jpg': './assets/japan.jpg',
    'france.jpg': './assets/france.jpg',
    'australia.jpg': './assets/australia.jpg',
    'usa.jpg': './assets/usa.jpg',
    'uk.jpg': './assets/uk.jpg',
  },
});

const LOCATIONS = [
  { region: 'Asia', country: 'Japan', image: 'japan.jpg' },
  { region: 'Europe', country: 'France', image: 'france.jpg' },
  { region: 'Oceania', country: 'Australia', image: 'australia.jpg' },
  { region: 'North America', country: 'USA', image: 'usa.jpg' },
  { region: 'Europe', country: 'UK', image: 'uk.jpg' },
];

const REGIONS = ['Asia', 'Europe', 'North America', 'South America', 'Africa', 'Oceania'];

Devvit.addMenuItem({
  label: 'GeoGuessr Game',
  location: 'subreddit',
  forUserType: 'moderator',
  onPress: async (_event, context) => {
    const { reddit, ui } = context;
    ui.showToast("Creating GeoGuessr game post...");
    
    const subreddit = await reddit.getCurrentSubreddit();
    const post = await reddit.submitPost({
      title: 'GeoGuessr Challenge',
      subredditName: subreddit.name,
    });
    ui.navigateTo(post);
  },
});

Devvit.addCustomPostType({
  name: 'GeoGuessr Game',
  render: (_context) => {
    const [currentLocation, setCurrentLocation] = useState(0);
    const [score, setScore] = useState(0);
    const [gameState, setGameState] = useState('start');
    const [showImage, setShowImage] = useState(false);

    const checkGuess = (guessedRegion: string) => {
      if (guessedRegion === LOCATIONS[currentLocation].region) {
        setScore(score + 100);
      }
      
      if (currentLocation < LOCATIONS.length - 1) {
        setCurrentLocation(currentLocation + 1);
        setShowImage(true);
        setTimeout(() => setShowImage(false), 5000);
      } else {
        setGameState('result');
      }
    };

    const startGame = () => {
      setScore(0);
      setCurrentLocation(0);
      setGameState('playing');
      setShowImage(true);
      setTimeout(() => setShowImage(false), 5000);
    };

    return (
      <vstack gap="medium" alignment="center middle">
        {gameState === 'start' && (
          <vstack gap="medium" alignment="center middle">
            <text size="xxlarge">Welcome to GeoGuessr!</text>
            <button appearance="primary" onPress={startGame}>Start Game</button>
          </vstack>
        )}

        {gameState === 'playing' && (
          <vstack gap="medium" alignment="center middle">
            {showImage ? (
              <vstack gap="small">
                <text size="large">Memorize this location!</text>
                <image source={LOCATIONS[currentLocation].image} />
                <text>Time remaining: 5 seconds</text>
              </vstack>
            ) : (
              <vstack gap="small">
                <text size="large">Select the correct region:</text>
                <hstack gap="small" wrap>
                  {REGIONS.map((region) => (
                    <button
                      key={region}
                      onPress={() => checkGuess(region)}
                    >
                      {region}
                    </button>
                  ))}
                </hstack>
                <text>Score: {score}</text>
              </vstack>
            )}
          </vstack>
        )}

        {gameState === 'result' && (
          <vstack gap="medium" alignment="center middle">
            <text size="xxlarge">Game Over!</text>
            <text size="xlarge">Final Score: {score}</text>
            <button appearance="primary" onPress={startGame}>
              Play Again
            </button>
          </vstack>
        )}
      </vstack>
    );
  },
});

export default Devvit;
