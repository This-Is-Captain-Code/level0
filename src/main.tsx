
import { Devvit } from '@devvit/public-api';

Devvit.configure({ redditAPI: true });

Devvit.addMenuItem({
  label: 'Create GeoGuessr Game',
  location: 'subreddit',
  onPress: async (event, context) => {
    const modal = await context.ui.showModal({
      title: 'Create a GeoGuessr Game',
      acceptLabel: 'Create Post',
      dismissLabel: 'Cancel',
      children: (
        <vstack gap="medium">
          <textfield id="title" placeholder="Enter post title" />
          <imageinput id="image" label="Upload Location Image" />
          <textfield id="answer" placeholder="Enter correct location" />
        </vstack>
      )
    });

    if (!modal) return;

    const title = await context.ui.getElementValue('title');
    const image = await context.ui.getElementValue('image');
    const answer = await context.ui.getElementValue('answer');

    if (!title || !image || !answer) {
      return context.ui.showToast('Please fill in all fields');
    }

    await context.reddit.submitPost({
      title,
      subredditName: context.subredditName,
      kind: 'custom',
      metadata: {
        imageUrl: image,
        answer: answer.toLowerCase()
      }
    });
  }
});

Devvit.addCustomPostType({
  name: 'GeoGuessr Game',
  height: 'tall',
  render: (context) => {
    if (!context.postData?.metadata?.imageUrl) {
      return <text>Loading game...</text>;
    }

    return (
      <webview 
        url={`page.html?imageUrl=${context.postData.metadata.imageUrl}&answer=${context.postData.metadata.answer}`}
        height="500px"
      />
    );
  }
});

export default Devvit;
