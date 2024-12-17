
import { Devvit, useState } from '@devvit/public-api';

Devvit.configure({
  redditAPI: true,
});

Devvit.addCustomPostType({
  name: 'GeoGuessr Game',
  height: 'regular',
  render: (context) => {
    const [gameStarted, setGameStarted] = useState(false);
    
    return (
      <vstack backgroundColor="white" height="100%" width="100%" gap="medium" alignment="center middle">
        {!gameStarted ? (
          <button appearance="primary" onPress={() => setGameStarted(true)}>
            Start Game
          </button>
        ) : (
          <vstack gap="medium" alignment="center middle">
            <image
              url="france.jpg"
              description="Guess the country"
              imageHeight={400}
              imageWidth={600}
            />
            <text size="large">Guess the country!</text>
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
