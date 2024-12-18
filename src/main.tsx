
import { Devvit } from '@devvit/public-api';

Devvit.configure({ redditAPI: true });

Devvit.addCustomPostType({
  name: 'GeoGuessr Game',
  height: 'tall',
  render: (context) => {
    // Handle case when post isn't created yet
    if (!context.postData) {
      return (
        <vstack gap="medium" alignment="center middle">
          <text>Create a new GeoGuessr game using the subreddit menu!</text>
        </vstack>
      );
    }

    const metadata = context.postData.metadata || {};
    const isCreator = context.userId === context.postData.authorId;

    if (!metadata.imageUrl) {
      return (
        <vstack gap="medium">
          <text>No image provided for this game.</text>
        </vstack>
      );
    }

    return (
      <vstack height="100%">
        <webview
          id="geoGuessr"
          url={`page.html?imageUrl=${metadata.imageUrl}&answer=${isCreator ? metadata.answer : ''}`}
          height="100%"
        />
      </vstack>
    );
  },
});

Devvit.addMenuItem({
  label: 'Create GeoGuessr Post',
  location: 'subreddit',
  onPress: async (event, context) => {
    const form = context.ui.showForm({
      title: 'Create GeoGuessr Post',
      fields: [
        {
          name: 'title',
          label: 'Post Title',
          type: 'string',
          required: true,
        },
        {
          name: 'image',
          label: 'Location Image',
          type: 'image',
          required: true,
        },
        {
          name: 'answer',
          label: 'Correct Answer',
          type: 'string',
          required: true,
        },
      ],
    });

    const response = await form;
    if (!response) return;

    const { title, image, answer } = response;
    
    await context.reddit.submitPost({
      title,
      subredditName: context.subredditName,
      kind: 'custom',
      metadata: {
        imageUrl: image,
        answer: answer.toLowerCase(),
      },
    });
  },
});

export default Devvit;
