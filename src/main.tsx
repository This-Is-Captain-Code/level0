
import { Devvit, useState, useEffect } from '@devvit/public-api';
import { Loader } from '@googlemaps/js-api-loader';

Devvit.configure({
  redditAPI: true,
});

const LOCATIONS = [
  { lat: 35.6762, lng: 139.6503, country: 'Japan', image: 'tokyo.jpg' },
  { lat: 48.8566, lng: 2.3522, country: 'France', image: 'paris.jpg' },
  { lat: -33.8688, lng: 151.2093, country: 'Australia', image: 'sydney.jpg' },
  { lat: 40.7128, lng: -74.0060, country: 'USA', image: 'newyork.jpg' },
  { lat: 51.5074, lng: -0.1278, country: 'UK', image: 'london.jpg' },
];

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
      preview: (
        <vstack height="100%" width="100%" alignment="middle center">
          <text size="large">Loading GeoGuessr...</text>
        </vstack>
      ),
    });
    ui.navigateTo(post);
  },
});

Devvit.addCustomPostType({
  name: 'GeoGuessr Game',
  height: 'tall',
  render: (_context) => {
    const [currentLocation, setCurrentLocation] = useState(0);
    const [score, setScore] = useState(0);
    const [showImage, setShowImage] = useState(true);
    const [gameState, setGameState] = useState('viewing'); // viewing, guessing, result
    const [selectedCountry, setSelectedCountry] = useState('');

    useEffect(() => {
      if (gameState === 'guessing') {
        // Initialize Google Maps
        const loader = new Loader({
          apiKey: 'YOUR_GOOGLE_MAPS_API_KEY',
          version: 'weekly',
        });

        loader.load().then(() => {
          const map = new google.maps.Map(document.getElementById('map'), {
            center: { lat: 0, lng: 0 },
            zoom: 2,
          });

          // Add click listener for country selection
          map.addListener('click', (e) => {
            const geocoder = new google.maps.Geocoder();
            geocoder.geocode({ location: e.latLng }, (results, status) => {
              if (status === 'OK') {
                const country = results[0].address_components.find(
                  (component) => component.types.includes('country')
                );
                if (country) {
                  setSelectedCountry(country.long_name);
                  checkGuess(country.long_name);
                }
              }
            });
          });
        });
      }
    }, [gameState]);

    const checkGuess = (guessedCountry) => {
      if (guessedCountry === LOCATIONS[currentLocation].country) {
        setScore(score + 100);
      }
      
      if (currentLocation < LOCATIONS.length - 1) {
        setCurrentLocation(currentLocation + 1);
        setGameState('viewing');
        setShowImage(true);
        setTimeout(() => {
          setShowImage(false);
          setGameState('guessing');
        }, 5000);
      } else {
        setGameState('result');
      }
    };

    const startGame = () => {
      setShowImage(true);
      setGameState('viewing');
      setTimeout(() => {
        setShowImage(false);
        setGameState('guessing');
      }, 5000);
    };

    return (
      <vstack backgroundColor="white" height="100%" width="100%" gap="medium" alignment="center middle">
        {gameState === 'viewing' && (
          <vstack gap="medium">
            <text size="large">Memorize this location!</text>
            <image
              url={LOCATIONS[currentLocation].image}
              description="Location"
              height="300px"
              width="400px"
            />
            <text>Time remaining: 5 seconds</text>
          </vstack>
        )}

        {gameState === 'guessing' && (
          <vstack gap="medium">
            <text size="large">Click on the correct country</text>
            <div id="map" style={{ height: '400px', width: '600px' }}></div>
            <text>Current Score: {score}</text>
          </vstack>
        )}

        {gameState === 'result' && (
          <vstack gap="medium">
            <text size="xxlarge">Game Over!</text>
            <text size="xlarge">Final Score: {score}</text>
            <button appearance="primary" onPress={() => {
              setScore(0);
              setCurrentLocation(0);
              startGame();
            }}>
              Play Again
            </button>
          </vstack>
        )}

        {gameState === 'start' && (
          <button appearance="primary" onPress={startGame}>
            Start Game
          </button>
        )}
      </vstack>
    );
  },
});

export default Devvit;
