
import { Devvit } from '@devvit/public-api';

Devvit.configure({ redditAPI: true });

const createGeoGuessrForm = Devvit.createForm({
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
  onSubmit: async (event, context) => {
    const { title, image, answer } = event.values;
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

Devvit.addMenuItem({
  label: 'Create GeoGuessr Post',
  location: 'subreddit',
  onPress: async (event, context) => {
    await context.ui.showForm(createGeoGuessrForm);
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
