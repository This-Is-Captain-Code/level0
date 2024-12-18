
import { Devvit, KeyValueStorage } from '@devvit/public-api';

Devvit.configure({ redditAPI: true });

const storage = new KeyValueStorage();

Devvit.addCustomPostType({
  name: 'GeoGuessr Game',
  height: 'tall',
  render: (context) => {
    return (
      <vstack height="100%">
        <webview
          id="geoGuessr"
          url="page.html"
          height="100%"
          onMessage={async (message) => {
            if (message.type === 'submitChallenge') {
              const postId = context.postId;
              await storage.put(`answer_${postId}`, message.answer);
              await storage.put(`image_${postId}`, message.image);
            }
            
            if (message.type === 'loadChallenge') {
              const postId = context.postId;
              const image = await storage.get(`image_${postId}`);
              return { image };
            }
            
            if (message.type === 'checkAnswer') {
              const postId = context.postId;
              const correctAnswer = await storage.get(`answer_${postId}`);
              return { correct: message.guess.toLowerCase() === correctAnswer.toLowerCase() };
            }
          }}
        />
      </vstack>
    );
  },
});

Devvit.addMenuItem({
  label: 'Create GeoGuessr Challenge',
  location: 'subreddit',
  onPress: async (event, context) => {
    await context.reddit.submitPost({
      title: 'GeoGuessr Challenge',
      subredditName: context.subreddit.name,
      kind: 'GeoGuessr Game'
    });
  }
});

export default Devvit;
