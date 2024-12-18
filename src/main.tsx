
import { Devvit, FormData } from '@devvit/public-api';

Devvit.configure({ redditAPI: true });

Devvit.addCustomPostType({
  name: 'GeoGuessr Game',
  height: 'tall',
  render: (context) => {
    const postMetadata = context.postMetadata;
    const isCreator = context.userId === postMetadata?.authorId;

    if (!postMetadata?.metadata?.imageUrl) {
      return (
        <vstack height="100%">
          <form onSubmit={async (data: FormData) => {
            const imageUrl = data.get('imageUrl') as string;
            const answer = data.get('answer') as string;
            
            await context.reddit.setPostMetadata(context.postId, {
              imageUrl,
              answer: answer.toLowerCase(),
              solved: false,
              guesses: []
            });
          }}>
            <text>Create your GeoGuessr challenge:</text>
            <textinput name="imageUrl" placeholder="Image URL" />
            <textinput name="answer" placeholder="Correct Location" />
            <button type="submit">Create Challenge</button>
          </form>
        </vstack>
      );
    }

    if (postMetadata.metadata.solved && !isCreator) {
      return (
        <vstack>
          <image src={postMetadata.metadata.imageUrl} />
          <text>This location has been correctly guessed!</text>
          <text>Answer: {postMetadata.metadata.answer}</text>
        </vstack>
      );
    }

    return (
      <vstack>
        <image src={postMetadata.metadata.imageUrl} />
        {!isCreator && !postMetadata.metadata.solved && (
          <form onSubmit={async (data: FormData) => {
            const guess = (data.get('guess') as string).toLowerCase();
            const correct = guess === postMetadata.metadata.answer;
            
            if (correct) {
              await context.reddit.setPostMetadata(context.postId, {
                ...postMetadata.metadata,
                solved: true
              });
              await context.reddit.submitComment(context.postId, `Correct! The location was ${postMetadata.metadata.answer}`);
            } else {
              const newGuesses = [...(postMetadata.metadata.guesses || []), guess];
              await context.reddit.setPostMetadata(context.postId, {
                ...postMetadata.metadata,
                guesses: newGuesses
              });
              await context.reddit.submitComment(context.postId, `Wrong guess: ${guess}`);
            }
          }}>
            <textinput name="guess" placeholder="Enter your guess" />
            <button type="submit">Submit Guess</button>
          </form>
        )}
        {isCreator && (
          <text>This is your challenge post. Wait for others to guess!</text>
        )}
      </vstack>
    );
  },
});

export default Devvit;
