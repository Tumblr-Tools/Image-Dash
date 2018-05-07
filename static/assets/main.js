import cards from './cards/cards.js';

let currentOffset = 0;
let loading = false;
const loader = document.querySelector('.js-loader');

const render = (posts) => {
  document.querySelector('.js-app').appendChild(cards(posts));
}

const showLoading = () => {
  if(currentOffset !== 0){
    loader.classList.remove('is-hidden');
  }
}

const hideLoading = () => {
  const placeholder = document.querySelector('.js-placeholder');
  placeholder &&  document.body.removeChild(placeholder);
  loader.classList.add('is-hidden');
}

const requestData = async (path) => {
  try {
    let response = await fetch(path);
    let json = await response.json();
    return json;
  } catch(err) {
    throw err;
  }
}

const loadNextPage = () => {
  showLoading();
  loading = true;
  requestData(`/api/dashboard?limit=18&offset=${currentOffset}`)
    .then(json => {
      hideLoading();
      render(json.posts);
      currentOffset += 18;
      loading = false;
    })
}

loadNextPage();

/*
(function(){

  let latestKnownScrollY = 0;
  let ticking = false;

  function onScroll() {
    latestKnownScrollY = window.scrollY;
    requestTick();
  }

  function requestTick() {
    if(!ticking) {
      requestAnimationFrame(update);
    }
    ticking = true;
  }

  function update() {
    ticking = false;
    
    const distance = 500;
    const currentScrollY = latestKnownScrollY;
    const pageHeight = document.documentElement.scrollHeight;
    const clientHeight = document.documentElement.clientHeight;
    
    if (pageHeight - (currentScrollY + clientHeight) < distance) {
      if(!loading){
        loadNextPage();
      }
    }
  }

  window.addEventListener('scroll', onScroll, false);

  

    function onSliderClick(event){
      const el = event.target;
      const slider = event.target.closest('.js-slider');
      const active = slider.querySelector('.is-active');
      const images = slider.querySelector('.js-slider-images');
      const nav = slider.querySelector('.js-slider-nav');
      const siblings = el.parentElement.children;
      let index = Array.prototype.indexOf.call(siblings, el);
      if(el.tagName === 'IMG'){
        index += 1;
        if(index === siblings.length){
          index = 0;
        }
      }
      active.classList.remove('is-active');
      nav.children[index].classList.add('is-active');
      images.style.transform = `translateX(-${250 * index}px)`;
    }

    const sliderButtons = document.querySelectorAll('.js-slider-button');
    if(sliderButtons.length){
      sliderButtons.forEach((slider) => {
        if(slider.parentElement.firstElementChild === slider){
          slider.classList.add('is-active');
        }
        slider.addEventListener('click', onSliderClick);
      });
    }

    const sliderImages = document.querySelectorAll('.js-slider-images');
    if(sliderImages.length){
      sliderImages.forEach((images) => {
        images.addEventListener('click', onSliderClick);
      });
    }

    function onLikeClick(event){
      const el = event.target;
      const btn = el.closest('.js-like');   
      const card = el.closest('.js-card');
      const xhr = new XMLHttpRequest();
      xhr.open(
        'POST', 
        `api/like?id=${card.id}&reblog_key=${card.dataset.reblogKey}`, 
        true
      );

      xhr.onreadystatechange = function() {//Call a function when the state changes.
        console.log(xhr.readyState, xhr.status);
        if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
          console.log('liked');
          // Request finished. Do processing here.
        }
      };
      xhr.send();

      btn.classList.add('is-animating');
    }

    const likeButtons = document.querySelectorAll('.js-like');
    if(likeButtons.length){
      likeButtons.forEach((btn) => {
        btn.addEventListener('click', onLikeClick);
      });
    }

    const hearts = document.querySelectorAll('.js-heart');
    hearts.forEach((heart) => {
      heart.addEventListener('animationend', function onEnd(event){
        const btn = event.target.closest('.js-like');
        btn.classList.remove('is-animating');
        btn.classList.add('is-success');
      });
    });

    function onReblogClick(event){
      const el = event.target;
      const btn = el.closest('.js-reblog');
      const card = el.closest('.js-card');
      const xhr = new XMLHttpRequest();
      xhr.open(
        'POST', 
        `api/reblog?id=${card.id}&reblog_key=${card.dataset.reblogKey}`, 
        true
      );

      xhr.onreadystatechange = function() {//Call a function when the state changes.
        console.log(xhr.readyState, xhr.status);
        if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
          console.log('reblogged');
          // Request finished. Do processing here.
        }
      };
      xhr.send();
      
      btn.classList.add('is-animating');

    }

    const reblogButtons = document.querySelectorAll('.js-reblog');
    if(reblogButtons.length){
      reblogButtons.forEach((btn) => {
        btn.addEventListener('click', onReblogClick);
      });
    }

    const arrows = document.querySelectorAll('.js-arrow');
    arrows.forEach((arrow) => {
      arrow.addEventListener('animationend', function onEnd(event){
        const btn = event.target.closest('.js-reblog');
        btn.classList.remove('is-animating');
        btn.classList.add('is-success');
      });
    });

    function hidePhoto(id){
      const photo = document.getElementById(id).querySelector('.js-photo');
      const img = photo.querySelector('img');
      if(img.complete && img.naturalHeight !== 0){
        pixelatePhoto(img, photo, id);
      } else {
        img.addEventListener('load', () => {
          pixelatePhoto(img, photo, id);
        });
      }
    }

    function pixelatePhoto(img, photo, id){
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.imageSmoothingEnabled = false;
      const size = 0.024;
      const w = canvas.width * size;
      const h = canvas.height * size;

      ctx.drawImage(img, 0, 0, w, h);
      ctx.drawImage(canvas, 0, 0, w, h, 0, 0, canvas.width, canvas.height);
      canvas.classList.add('photo-container__blurred-image');
      photo.appendChild(canvas);
      photo.classList.add('is-blurred');
      if(!sessionStorage.getItem(id)){
        sessionStorage.setItem(id, 'blurred');
      }
    }

    function showPhoto(id){
      const photo = document.getElementById(id).querySelector('.js-photo');
      const canvas = photo.querySelector('canvas');
      photo.removeChild(canvas);
      photo.classList.remove('is-blurred');
      sessionStorage.removeItem(id);
    }

    const hideButtons = document.querySelectorAll('.js-hide-button');
    hideButtons.forEach((button) => {
      if(!button.onclick){
        button.onclick = (event) => {
          const photo = event.target.closest('.js-photo');
          const card = event.target.closest('.js-card');
          if(photo.classList.contains('is-blurred')){
            showPhoto(card.id);
          } else {
            hidePhoto(card.id);
          }
        };
      }
    });

  }

}());
*/