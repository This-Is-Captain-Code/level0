
import { Devvit } from '@devvit/public-api';

const LOCATIONS = [
  { region: 'Asia', country: 'Japan', image: 'https://i.imgur.com/japan.jpg' },
  { region: 'Europe', country: 'France', image: 'https://i.imgur.com/france.jpg' },
  { region: 'Oceania', country: 'Australia', image: 'https://i.imgur.com/australia.jpg' },
  { region: 'North America', country: 'USA', image: 'https://i.imgur.com/usa.jpg' },
  { region: 'Europe', country: 'UK', image: 'https://i.imgur.com/uk.jpg' }
];

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
      <vstack gap="medium">
        <text size="xlarge">GeoGuessr Challenge</text>
        <button onPress={() => {
          context.ui.showWebView({
            url: 'https://replit.com/@username/your-webview-repl',
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
