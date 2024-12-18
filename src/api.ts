
import { Devvit } from '@devvit/public-api';

export async function handleRandomImage(context: Devvit.Context) {
  const images = await context.objects.list('images/');
  if (images.length === 0) {
    return { 
      status: 404, 
      body: JSON.stringify({ error: 'No images found' }) 
    };
  }

  const randomImage = images[Math.floor(Math.random() * images.length)];
  const imageUrl = await context.objects.getSignedUrl(randomImage.key, { action: 'read' });
  
  return {
    status: 200,
    body: JSON.stringify({
      url: imageUrl,
      answer: randomImage.key.split('/')[1].split('.')[0] // Uses filename as answer
    })
  };
}
