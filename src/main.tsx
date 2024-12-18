
import { Devvit } from '@devvit/public-api';

Devvit.configure({ redditAPI: true });

const createGameForm = Devvit.createForm({
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

Devvit.addMenuItem({
  label: 'Create GeoGuessr Game',
  location: 'subreddit',
  onPress: async (event, context) => {
    const formData = await context.ui.showForm(createGameForm);
    if (!formData.image || !formData.location) return;

    await context.reddit.submitPost({
      title: 'New GeoGuessr Challenge!',
      subredditName: context.subreddit.name,
      metadata: {
        imageUrl: formData.image,
        location: formData.location,
      },
      kind: 'GeoGuessr Game',
    });
  },
});

export default Devvit;
