import $ from 'jquery';

let container = document.body;
let windowWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
let windowHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
let renderLoopId;

function isPortrait(img) {
  return img.width < img.height;
}

let style = (img) => {
  img.style.position = 'absolute';
  if (isPortrait(img)) {
    img.style.width = '100vw';
  } else {
    img.style.height = '100vh';
  }
};

let scaledHeight = (img) => {
  return img.height * windowWidth / img.width;
};

let scaledWidth = (img) => {
  return img.width * windowHeight / img.height;
};

let preload = (url) => {
  return new Promise((resolve, reject) => {
    let img = document.createElement('img');
    img.onload = resolve.bind(undefined, img);
    img.onerror = reject;
    img.src = url;
    style(img);
    document.body.appendChild(img);
  });
};

function slide(img, time, cb) {
  let endPosition = isPortrait(img) ? `0, ${-(scaledHeight(img) - windowHeight)}px` : `${-(scaledWidth(img) - windowWidth)}px, 0`;
  img.style.transform = `translate(${endPosition})`;
  img.style.transition = `transform ${time}ms`;
  $(img).one("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", cb);
}

let renderImage = (promise, cycleMs) => {
  promise.then((img) => {
    img.style['z-index'] = 10;
    let translateMs = cycleMs * 0.9;
    slide(img, translateMs, () => {
      $(img).fadeOut(cycleMs - translateMs, img.remove.bind(img))
    });
  });
};

let clearChildren = (elem) => {
  while (elem.firstChild) {
    elem.removeChild(elem.firstChild);
  }
};

class ImageRenderer {
  render(urls, cycleMs) {
    clearChildren(container);
    clearInterval(renderLoopId);
    let urlIndex = 0, nextImg, render = () => {
      renderImage(nextImg || preload(urls[urlIndex]), cycleMs);
      urlIndex = urlIndex < urls.length - 1 ? urlIndex + 1 : 0;
      nextImg = preload(urls[urlIndex]);
    };

    render();
    renderLoopId = setInterval(render, cycleMs);
  }
}

export default new ImageRenderer();