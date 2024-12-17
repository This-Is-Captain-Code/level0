
import { Devvit, useState, useEffect } from '@devvit/public-api';

Devvit.configure({
  redditAPI: true,
});

Devvit.addCustomPostType({
  name: 'GeoGuessr Game',
  height: 'regular',
  render: (context) => {
    const [gameStarted, setGameStarted] = useState(false);
    const [timeLeft, setTimeLeft] = useState(5);
    const [showImage, setShowImage] = useState(true);
    const [userAnswer, setUserAnswer] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const correctAnswer = 'France';
    
    useEffect(() => {
      let timer;
      if (gameStarted && timeLeft > 0 && showImage) {
        timer = setTimeout(() => {
          setTimeLeft(prev => prev - 1);
        }, 1000);
      } else if (timeLeft === 0) {
        setShowImage(false);
      }
      return () => clearTimeout(timer);
    }, [timeLeft, gameStarted, showImage]);

    const handleSubmit = () => {
      setSubmitted(true);
    };

    const resetGame = () => {
      setGameStarted(false);
      setTimeLeft(5);
      setShowImage(true);
      setUserAnswer('');
      setSubmitted(false);
    };
    
    return (
      <vstack backgroundColor="white" height="100%" width="100%" gap="medium" alignment="center middle">
        {!gameStarted ? (
          <button appearance="primary" onPress={() => setGameStarted(true)}>
            Start Game
          </button>
        ) : (
          <vstack gap="medium" alignment="center middle">
            {showImage ? (
              <>
                <image
                  url="france.jpg"
                  description="Guess the country"
                  imageHeight={400}
                  imageWidth={600}
                />
                <text size="large">Time left: {timeLeft}s</text>
              </>
            ) : (
              <vstack gap="medium" alignment="center middle">
                {!submitted ? (
                  <>
                    <textbox
                      placeholder="Enter country name"
                      value={userAnswer}
                      onValueChange={setUserAnswer}
                    />
                    <button appearance="primary" onPress={handleSubmit}>
                      Submit Answer
                    </button>
                  </>
                ) : (
                  <vstack gap="medium" alignment="center middle">
                    <text size="large">
                      {userAnswer.toLowerCase() === correctAnswer.toLowerCase() 
                        ? "Correct!" 
                        : `Wrong! The answer was ${correctAnswer}`}
                    </text>
                    <button appearance="primary" onPress={resetGame}>
                      Play Again
                    </button>
                  </vstack>
                )}
              </vstack>
            )}
          </vstack>
        )}
      </vstack>
    );
  },
});

Devvit.addMenuItem({
  label: 'Create GeoGuessr Game',
  location: 'subreddit',
  forUserType: 'moderator',
  onPress: async (_event, context) => {
    const { reddit, ui } = context;
    ui.showToast("Creating GeoGuessr game post...");

    const subreddit = await reddit.getCurrentSubreddit();
    const post = await reddit.submitPost({
      title: 'GeoGuessr Game',
      subredditName: subreddit.name,
      preview: (
        <vstack height="100%" width="100%" alignment="middle center">
          <text size="large">Loading game...</text>
        </vstack>
      ),
    });
    ui.navigateTo(post);
  },
});

export default Devvit;
