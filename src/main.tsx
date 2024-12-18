
import { Devvit } from '@devvit/public-api';

Devvit.configure({ redditAPI: true });

Devvit.addCustomPostType({
  name: 'GeoGuessr Game',
  height: 'tall',
  render: (context) => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && typeof event.data === 'object' && 'type' in event.data) {
        if (event.data.type === 'getRedditUsername') {
          const username = context.userId ? context.userId : 'anonymous';
          if (event.source && 'postMessage' in event.source) {
            event.source.postMessage({ 
              type: 'redditUsername', 
              username 
            }, '*');
          }
        }
      }
    };

    return (
      <vstack height="100%">
        <webview
          id="geoGuessr"
          url="page.html"
          height="100%"
          onMessage={handleMessage}
        />
      </vstack>
    );
  },
});

export default Devvit;
