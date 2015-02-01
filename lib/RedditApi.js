import jsonp from 'jsonp';

class RedditApi {
  load(subreddit) {
    return new Promise((resolve, reject) => {
      jsonp(`http://www.reddit.com/r/${subreddit}/hot.json`, {param: 'jsonp'}, (err, data) => {
        err ? reject(err) : resolve(data.data.children);
      });
    })
  }
}

export default new RedditApi();