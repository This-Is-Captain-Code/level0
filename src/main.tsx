
import { Devvit } from '@devvit/public-api';

Devvit.configure({ redditAPI: true });

interface ImageData {
  url: string;
  answer: string;
}

const IMAGES_KEY = 'game_images';

Devvit.addCustomPostType({
  name: 'GeoGuessr Game',
  height: 'tall',
  render: async (context) => {
    const storage = context.objectStore;
    
    const handleUpload = async (imageUrl: string, answer: string) => {
      const existingData = await storage.get<ImageData[]>(IMAGES_KEY) || [];
      await storage.put(IMAGES_KEY, [...existingData, { url: imageUrl, answer }]);
    };

    return (
      <vstack height="100%" gap="medium">
        <form onSubmit={async (data) => {
          await handleUpload(data.imageUrl, data.answer);
          context.ui.showToast('Image added successfully!');
        }}>
          <vstack gap="small">
            <text>Add New Image</text>
            <textbox name="imageUrl" placeholder="Image URL" />
            <textbox name="answer" placeholder="Correct Answer" />
            <button type="submit">Add Image</button>
          </vstack>
        </form>
        <webview
          id="geoGuessr"
          url="page.html"
          height="100%"
        />
      </vstack>
    );
  },
});

Devvit.addMenuItem({
  label: 'Get Random Image',
  location: 'post',
  onPress: async (context) => {
    const storage = context.objectStore;
    const images = await storage.get<ImageData[]>(IMAGES_KEY) || [];
    if (images.length === 0) {
      return context.ui.showToast('No images available!');
    }
    const randomImage = images[Math.floor(Math.random() * images.length)];
    await storage.put('current_game', randomImage);
    context.ui.showToast('New image loaded!');
  },
});

export default Devvit;
