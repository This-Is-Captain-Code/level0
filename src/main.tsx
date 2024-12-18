
import { Devvit } from '@devvit/public-api';

Devvit.configure({ redditAPI: true });

Devvit.addCustomPostType({
  name: 'GeoGuessr Game',
  height: 'tall',
  render: (context) => {
    const metadata = context.postMetadata;
    const imageUrl = metadata?.imageUrl || '';
    const location = metadata?.location || '';
    
    return (
      <vstack height="100%">
        <webview
          id="geoGuessr"
          url={`page.html?mode=play&imageUrl=${encodeURIComponent(imageUrl)}&location=${encodeURIComponent(location)}`}
          height="100%"
        />
      </vstack>
    );
  },
});

// Add form to create new games
Devvit.addMenuItem({
  label: 'Create GeoGuessr Game',
  location: 'subreddit',
  onPress: async (event, context) => {
    const form = context.ui.showForm({
      title: 'Create New GeoGuessr Game',
      fields: [
        {
          name: 'image',
          label: 'Location Image',
          type: 'image',
        },
        {
          name: 'location',
          label: 'Correct Location',
          type: 'string',
        }
      ],
      acceptLabel: 'Create Game',
    });

    const { image, location } = await form;
    if (!image || !location) return;

    // Create post with the game
    await context.reddit.submitPost({
      title: 'New GeoGuessr Challenge!',
      subredditName: context.subreddit.name,
      metadata: {
        imageUrl: image,
        location: location,
      },
      kind: 'GeoGuessr Game',
    });
  },
});

export default Devvit;
