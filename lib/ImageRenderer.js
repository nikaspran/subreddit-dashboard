import $ from 'jquery';

let container = document.body;
let windowWidth = () => Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
let windowHeight = () => Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
let renderLoopId;

function isPortrait(img) {
  return img.width / windowWidth() < img.height / windowHeight();
}

let style = (img) => {
  img.style.position = 'absolute';
  img.style.display = 'none';
  if (isPortrait(img)) {
    img.style.width = '100vw';
    img.style.transform = `translate(0, ${-(scaledHeight(img) - windowHeight())}px)`;
  } else {
    img.style.height = '100vh';
  }
};

let scaledHeight = (img) => {
  return img.height * windowWidth() / img.width;
};

let scaledWidth = (img) => {
  return img.width * windowHeight() / img.height;
};

let preload = (url) => {
  return new Promise((resolve, reject) => {
    let img = document.createElement('img');
    img.onload = resolve.bind(undefined, img);
    img.onerror = reject;
    img.src = url;
  });
};

function slide(img, time) {
  return new Promise((resolve)=> {
    setTimeout(() => {
      let endPosition = isPortrait(img) ? `0, 0` : `${-(scaledWidth(img) - windowWidth())}px, 0`;
      img.style.transition = `transform ${time}ms`;
      img.style.transform = `translate(${endPosition})`;
      $(img).one("transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", resolve);
    }, 0);
  });
}

let renderImage = (fetchImage, cycleMs) => {
  let translateMs = cycleMs * 0.9;
  let fadeMs = (cycleMs - translateMs) / 2;
  fetchImage.then((img) => {
    style(img);
    document.body.appendChild(img);

    return new Promise((resolve) => {
      $(img).fadeIn(fadeMs, () => {
        slide(img, translateMs).then(() => {
          $(img).fadeOut(cycleMs - translateMs, () => {
            img.remove(img);
            resolve();
          });
        })
      });
    });
  });
};

let clearChildren = (elem) => {
  while (elem.firstChild) {
    elem.removeChild(elem.firstChild);
  }
};

let immediate = () => new Promise((resolve) => resolve());

let currentlyRendering;
class ImageRenderer {
  render(urls, cycleMs) {
    (currentlyRendering || immediate()).then(() => {
      clearChildren(container);
      clearInterval(renderLoopId);
      let urlIndex = 0, nextImg, render = () => {
        currentlyRendering = renderImage(nextImg || preload(urls[urlIndex]), cycleMs);
        urlIndex = urlIndex < urls.length - 1 ? urlIndex + 1 : 0;
        nextImg = preload(urls[urlIndex]);
      };

      render();
      renderLoopId = setInterval(render, cycleMs);
    });
  }
}

export default new ImageRenderer();