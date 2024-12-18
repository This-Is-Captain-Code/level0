
import { Devvit } from '@devvit/public-api';

Devvit.configure({ redditAPI: true });

Devvit.addCustomPostType({
  name: 'GeoGuessr Challenge',
  height: 'tall',
  render: (context) => {
    const [gameState, setGameState] = useState('create');
    const [imageUrl, setImageUrl] = useState('');
    const [answer, setAnswer] = useState('');
    const [userGuess, setUserGuess] = useState('');
    const [result, setResult] = useState('');

    if (gameState === 'create') {
      return (
        <vstack gap="medium">
          <text size="large">Create a GeoGuessr Challenge</text>
          <textfield 
            label="Image URL" 
            onChange={(e) => setImageUrl(e.target.value)} 
          />
          <textfield 
            label="Correct Location" 
            onChange={(e) => setAnswer(e.target.value)} 
          />
          <button 
            onPress={() => {
              if (imageUrl && answer) {
                setGameState('play');
                context.redis.set('image', imageUrl);
                context.redis.set('answer', answer.toLowerCase());
              }
            }}
          >
            Create Challenge
          </button>
        </vstack>
      );
    }

    if (gameState === 'play') {
      return (
        <vstack gap="medium">
          <image src={imageUrl} />
          <textfield 
            label="Your Guess"
            onChange={(e) => setUserGuess(e.target.value)}
          />
          <button
            onPress={() => {
              if (userGuess.toLowerCase() === answer.toLowerCase()) {
                setResult('Correct!');
              } else {
                setResult(`Wrong! The answer was ${answer}`);
              }
              setGameState('result');
            }}
          >
            Submit Guess
          </button>
          {result && <text>{result}</text>}
        </vstack>
      );
    }

    if (gameState === 'result') {
      return (
        <vstack gap="medium">
          <text size="large">{result}</text>
          <button onPress={() => setGameState('create')}>
            Create New Challenge
          </button>
        </vstack>
      );
    }
  },
});

export default Devvit;
