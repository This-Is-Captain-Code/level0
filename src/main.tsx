
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
        <button onPress={() => {
          context.ui.showWebView({
            url: 'https://geoguessr-game.${context.appId}.repl.co',
            height: '600px'
          });
        }}>
          Play Game
        </button>
      </vstack>
    );
  }
});

export default Devvit;
