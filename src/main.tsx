
import { Devvit } from '@devvit/public-api';

Devvit.configure({ redditAPI: true });

Devvit.addMenuItem({
  label: 'Create GeoGuessr Post',
  location: 'subreddit',
  onPress: async (event, context) => {
    const imageUrl = await context.ui.showForm({
      title: 'Create a GeoGuessr Post',
      fields: [
        {
          type: 'string',
          name: 'imageUrl',
          label: 'Image URL'
        },
        {
          type: 'string',
          name: 'answer',
          label: 'Correct Answer'
        }
      ]
    });

    if (imageUrl) {
      await context.reddit.submitPost({
        subredditName: context.subreddit.name,
        title: 'GeoGuessr Challenge',
        customPostType: 'GeoGuessr Game',
        metadata: {
          imageUrl: imageUrl.imageUrl,
          answer: imageUrl.answer
        }
      });
    }
  }
});

Devvit.addCustomPostType({
  name: 'GeoGuessr Game',
  height: 'tall',
  render: (context) => {
    return (
      <vstack height="100%">
        <webview
          id="geoGuessr"
          url={`page.html?imageUrl=${context.metadata.imageUrl}&answer=${context.metadata.answer}`}
          height="100%"
        />
      </vstack>
    );
  },
});

export default Devvit;
