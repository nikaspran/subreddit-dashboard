import RedditApi from './RedditApi';
import ImageRenderer from './ImageRenderer';
import extractImageUrl from './extractImageUrl';
import urlHasImageExtension from './urlHasImageExtension';
import screenfull from 'screenfull';

function queryParam(name) {
  let match = window.location.search.match(`${name}=([^&]+)`);
  return match ? match[1] : undefined;
}

let refreshMin = queryParam('refreshMin') || 10;
let animationSec = queryParam('animationSec') || 30;
let subreddit = queryParam('r') || 'ImaginaryLandscapes';
let fKey = 102;

console.log();

(function fetchAndRender() {
  RedditApi.load(subreddit)
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