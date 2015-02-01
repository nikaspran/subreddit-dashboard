import urlHasImageExtension from './urlHasImageExtension';

export default (post) => {
  let url = post.data.url;
  return url.match(/imgur/g) && !urlHasImageExtension(url) ? url + '.png' : url;
}