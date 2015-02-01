import velocity from 'velocity';

let container = document.body;
let windowWidth = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
let windowHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
let renderLoopId;

let style = (img) => {
  img.style.position = 'absolute';
  img.style.width = '100vw';
};

let scaledHeight = (img) => {
  return img.height * windowWidth / img.width;
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

let renderImage = (promise, cycleMs) => {
  promise.then((img) => {
    img.style['z-index'] = 10;
    let translateMs = cycleMs * 0.9;
    velocity(img, {translateY: -(scaledHeight(img) - windowHeight)}, {duration: translateMs});
    velocity(img, {opacity: 0}, {duration: cycleMs - translateMs, complete: img.remove.bind(img)});
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