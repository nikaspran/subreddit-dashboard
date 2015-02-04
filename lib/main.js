import RedditApi from './RedditApi';
import ImageRenderer from './ImageRenderer';
import extractImageUrl from './extractImageUrl';
import urlHasImageExtension from './urlHasImageExtension';
import screenfull from 'screenfull';

let refreshMin = 10;
let animationSec = 30;
let fKey = 102;

(function fetchAndRender() {
  RedditApi.load('ImaginaryLandscapes')
    .then(posts => posts.filter(post => !post.data['is_self']))
    .then(posts => posts.filter(post => !post.data['over_18']))
    .then(posts => posts.map(extractImageUrl))
    .then(urls => urls.filter(urlHasImageExtension))
    .then(urls => ImageRenderer.render(urls, animationSec * 1000));
  setTimeout(fetchAndRender, refreshMin * 60 * 1000);
}());

window.addEventListener('keypress', (event) => {
  if (event.keyCode === fKey && screenfull.enabled) {
    screenfull.toggle();
  }
});

export default {};