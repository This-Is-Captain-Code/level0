
import { Devvit } from '@devvit/public-api';

Devvit.configure({ redditAPI: true });

Devvit.addMenuItem({
  label: 'Create GeoGuessr Challenge',
  location: 'subreddit',
  onPress: async (event, context) => {
    await context.ui.showForm({
      fields: [
        {
          name: 'image',
          label: 'Upload Image',
          type: 'image',
        },
        {
          name: 'answer',
          label: 'Correct Location',
          type: 'string',
        },
      ],
      onSubmit: async (values) => {
        const imageUrl = values.image;
        const answer = values.answer;
        
        await context.reddit.submitPost({
          title: 'GeoGuessr Challenge',
          subredditName: event.subredditName,
          postType: 'GAME',
          metadata: {
            imageUrl,
            answer,
          },
        });
      },
    });
  },
});

Devvit.addCustomPostType({
  name: 'GAME',
  height: 'tall',
  render: (context) => {
    const metadata = context.postMetadata;
    return (
      <vstack height="100%">
        <webview
          id="geoGuessr"
          url={`page.html?imageUrl=${metadata.imageUrl}&answer=${metadata.answer}`}
          height="100%"
        />
      </vstack>
    );
  },
});

export default Devvit;
