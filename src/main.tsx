
import { Devvit } from '@devvit/public-api';

Devvit.configure({ redditAPI: true });

Devvit.addCustomPostType({
  name: 'GeoGuessr Game',
  height: 'tall',
  render: (context) => {
    const postMetadata = context.postData?.metadata ?? {};
    const gameImage = postMetadata.gameImage ?? '';
    const answer = postMetadata.answer ?? '';

    return (
      <vstack height="100%">
        <webview
          id="geoGuessr"
          url={`page.html?image=${encodeURIComponent(gameImage)}&answer=${encodeURIComponent(answer)}`}
          height="100%"
        />
      </vstack>
    );
  },
  create: async (context) => {
    // Get form data
    const imageUrl = context.formData.get('gameImage') as string;
    const answer = context.formData.get('answer') as string;

    // Store in post metadata
    return {
      metadata: {
        gameImage: imageUrl,
        answer: answer
      }
    };
  }
});

export default Devvit;
