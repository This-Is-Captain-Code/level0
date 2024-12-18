
import { Devvit } from '@devvit/public-api';

Devvit.configure({ redditAPI: true });

Devvit.addCustomPostType({
  name: 'GeoGuessr Game',
  height: 'tall',
  render: (context) => {
    return (
      <vstack padding="medium" gap="medium">
        {context.postData?.imageUrl ? (
          <gamestate>
            <image url={context.postData.imageUrl} />
            <text>Can you guess where this is?</text>
            <textbox 
              placeholder="Enter your guess"
              onSubmit={async (value) => {
                const isCorrect = value.toLowerCase() === context.postData.answer.toLowerCase();
                context.showToast(isCorrect ? "Correct! 🎉" : `Wrong! The answer was ${context.postData.answer}`);
              }}
            />
          </gamestate>
        ) : (
          <createpost>
            <imageupload
              label="Upload location image"
              onChange={async (file) => {
                const imageUrl = await context.uploadMedia(file);
                context.postData.imageUrl = imageUrl;
              }}
            />
            <textbox
              label="Correct Answer"
              onChange={(value) => {
                context.postData.answer = value;
              }}
            />
            <button
              onPress={async () => {
                if (context.postData.imageUrl && context.postData.answer) {
                  await context.create();
                } else {
                  context.showToast("Please provide both image and answer");
                }
              }}
            >
              Create Game Post
            </button>
          </createpost>
        )}
      </vstack>
    );
  },
});

export default Devvit;
