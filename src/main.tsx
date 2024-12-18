
import { Devvit } from '@devvit/public-api';


import { File } from '@devvit/public-api';

Devvit.addPostEndpoint({
  path: '/api/upload',
  method: 'POST',
  handler: async (request, context) => {
    const formData = await request.formData();
    const image = formData.get('image') as File;
    const countryName = formData.get('countryName') as string;

    if (!image || !countryName) {
      return new Response('Missing image or country name', { status: 400 });
    }

    const imageData = await image.arrayBuffer();
    const fileName = `${countryName.toLowerCase()}-${Date.now()}.jpg`;
    
    await context.objectStore.put(fileName, imageData);
    const imageUrl = await context.objectStore.getUrl(fileName);

    return new Response(JSON.stringify({ imageUrl }), {
      headers: { 'Content-Type': 'application/json' }
    });
  }
});

Devvit.configure({ redditAPI: true, objectStore: true });

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
