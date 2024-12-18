
import { Devvit } from '@devvit/public-api';

Devvit.configure({ redditAPI: true });

const createPostForm = Devvit.createForm({
  fields: [
    { name: 'title', type: 'string', label: 'Post Title' },
    { name: 'image', type: 'image', label: 'Upload Image' },
    { name: 'answer', type: 'string', label: 'Correct Answer' }
  ]
});

Devvit.addMenuItem({
  label: 'Create Image Guessing Game',
  location: 'subreddit',
  onPress: async (event, context) => {
    const formResponse = await context.ui.showForm(createPostForm);
    if (!formResponse) return;

    await context.reddit.submitPost({
      title: formResponse.title,
      subredditName: context.subredditName,
      kind: 'custom',
      metadata: {
        imageUrl: formResponse.image,
        answer: formResponse.answer.toLowerCase()
      }
    });
  }
});

Devvit.addCustomPostType({
  name: 'Image Guessing Game',
  render: (context) => {
    if (!context.postData?.metadata?.imageUrl) {
      return <text>Loading game...</text>;
    }

    const metadata = context.postData.metadata;
    const isCreator = context.userId === context.postData.authorId;

    return (
      <vstack gap="medium">
        <image src={metadata.imageUrl} />
        {!isCreator && (
          <hstack gap="medium">
            <textfield
              id="guess"
              placeholder="Enter your guess"
            />
            <button
              onPress={async (e, ctx) => {
                const guess = await ctx.ui.getElementValue('guess');
                if (guess.toLowerCase() === metadata.answer) {
                  ctx.ui.showToast('Correct! You got it!');
                } else {
                  ctx.ui.showToast('Wrong guess, try again!');
                }
              }}
            >
              Submit Guess
            </button>
          </hstack>
        )}
        {isCreator && (
          <text>Answer: {metadata.answer}</text>
        )}
      </vstack>
    );
  }
});

export default Devvit;
