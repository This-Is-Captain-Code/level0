
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
          url={`page.html?image=${context.postData.image}&answer=${context.postData.answer}`}
          height="100%"
        />
      </vstack>
    );
  },
  createScreen: () => {
    return (
      <vstack gap="medium">
        <text>Create your GeoGuessr challenge!</text>
        <imageinput name="image" label="Upload an image of the location" />
        <textinput name="answer" label="What's the correct answer?" />
      </vstack>
    );
  },
});

export default Devvit;
