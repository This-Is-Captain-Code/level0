
import { Devvit } from '@devvit/public-api';

Devvit.configure({ redditAPI: true });

Devvit.addCustomPostType({
  name: 'GeoGuessr Game',
  height: 'tall',
  render: (context) => {
    return (
      <vstack height="100%">
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
