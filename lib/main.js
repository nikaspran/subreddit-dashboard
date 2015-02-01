import RedditApi from './RedditApi';
import ImageRenderer from './ImageRenderer';
import extractImageUrl from './extractImageUrl';
import urlHasImageExtension from './urlHasImageExtension';

RedditApi.load('ImaginaryLandscapes')
  .then(posts => posts.filter(post => !post.data['is_self']))
  .then(posts => posts.filter(post => !post.data['over_18']))
  .then(posts => posts.map(extractImageUrl))
  .then(urls => urls.filter(urlHasImageExtension))
  .then(urls => ImageRenderer.render(urls, 30000));

export default {};