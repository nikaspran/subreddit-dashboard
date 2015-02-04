# Subreddit Dashboard

An app to display images from a subreddit on a loop

## Requirements

* [node.js](http://nodejs.org/)
* jspm - `npm install -g jspm`
* `jspm install`

## Usage

* `F` for fullscreen
* Query parameters _(and defaults)_:
  * `r=<subreddit>` - subreddit to fetch images from _(ImaginaryLandscapes)_
  * `animationSec=<s>` - seconds between each slide _(30)_
  * `refreshMin=<min>`- minutes between fetching new images from the subreddit _(10)_
