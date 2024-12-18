
import { Devvit } from '@devvit/public-api';

Devvit.configure({ redditAPI: true });

Devvit.addMenuItem({
  label: 'Create GeoGuessr Post',
  location: 'subreddit',
  onPress: async (event, context) => {
    const title = await context.ui.showForm({
      fields: [{ name: 'title', type: 'string', label: 'Post Title' }],
    });
    if (!title) return;

    const image = await context.ui.showForm({
      fields: [{ name: 'image', type: 'image', label: 'Location Image' }],
    });
    if (!image) return;

    const answer = await context.ui.showForm({
      fields: [{ name: 'answer', type: 'string', label: 'Correct Answer' }],
    });
    if (!answer) return;

    await context.reddit.submitPost({
      title: title.title,
      subredditName: context.subredditName,
      kind: 'custom',
      metadata: {
        imageUrl: image.image,
        answer: answer.answer.toLowerCase(),
      },
    });
  },
});

Devvit.addCustomPostType({
  name: 'GeoGuessr Game',
  height: 'tall',
  render: (context) => {
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

export default Devvit;
