
import { Devvit } from '@devvit/public-api';

Devvit.configure({ redditAPI: true });

Devvit.addServerEndpoint({
  path: '/api/random-image',
  method: 'GET',
  handler: handleRandomImage,
});

Devvit.addCustomPostType({
  name: 'GeoGuessr Game',
  height: 'tall',
  render: (context) => {
    return (
      <vstack height="100%">
        <hstack>
          <button 
            onPress={async () => {
              const result = await context.ui.showFilePicker({
                acceptedFileTypes: ['image/jpeg', 'image/png'],
              });
              if (result) {
                await context.objects.put(`images/${result.name}`, result);
              }
            }}
          >
            Upload Image
          </button>
        </hstack>
        <webview
          id="geoGuessr"
          url="page.html"
          height="100%"
        />
      </vstack>
    );
  },
});

export default Devvit;
