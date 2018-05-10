import cards from './cards/cards.js';

const onLikeClick = (event) => {
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
    //console.log(xhr.readyState, xhr.status);
    if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
      //console.log('liked');
      // Request finished. Do processing here.
    }
  };
  xhr.send();

  btn.classList.add('is-animating');
}

const onReblogClick = (event) => {
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
    //console.log(xhr.readyState, xhr.status);
    if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
      //console.log('reblogged');
    }
  };
  xhr.send();
  
  btn.classList.add('is-animating');
}

const selectPhoto = (slider, index) => {
  const previousActive = slider.querySelector('.is-active');
  const images = slider.querySelector('.js-slider-images');
  const buttons = slider.querySelector('.js-slider-nav');
  previousActive && previousActive.classList.remove('is-active');
  images.style.transform = `translateX(-${250 * index}px)`;
  buttons.children[index].classList.add('is-active');
}

const onPhotoClick = (event) => {
  const el = event.target; 
  const siblings = el.parentElement.parentElement.children;
  let index = parseInt(el.dataset.index, 10) + 1;
  if(index === siblings.length){
    index = 0;
  }
  const slider = el.closest('.js-slider');
  selectPhoto(slider, index);
}

const onPhotoNavClick = (event) => {
  const el = event.target;
  const index = parseInt(el.dataset.index, 10);
  const slider = el.closest('.js-slider');
  selectPhoto(slider, index);
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
}

function hidePhoto(cardId, photoIndex){
  const photo = document.getElementById(cardId).querySelector('.js-slider-images').children[photoIndex];
  const img = photo.querySelector('img');
  if(img.complete && img.naturalHeight !== 0){
    pixelatePhoto(img, photo, cardId);
  } else {
    img.addEventListener('load', () => {
      pixelatePhoto(img, photo, cardId);
    });
  }
  if(!sessionStorage.getItem(cardId)){
    sessionStorage.setItem(cardId, photoIndex);
  }
}

function showPhoto(cardId, photoIndex){
  const photo = document.getElementById(cardId).querySelector('.js-slider-images').children[photoIndex];
  const canvas = photo.querySelector('canvas');
  photo.removeChild(canvas);
  photo.classList.remove('is-blurred');
  sessionStorage.removeItem(cardId);
}

const onHideImageClick = (event) => {
  const photoContainer = event.target.closest('.js-photo-container');
  const photo = photoContainer.querySelector('.js-photo');
  const card = event.target.closest('.js-card');
  if(photoContainer.classList.contains('is-blurred')){
    showPhoto(card.id, photo.dataset.index);
  } else {
    hidePhoto(card.id, photo.dataset.index);
  }
}

const setHidden = (posts) => {
  posts.forEach((post) => {
    var hidden = sessionStorage.getItem(post.id);
    if(hidden !== null){
      hidePhoto(post.id, parseInt(hidden, 10));
    }
  })
}

let currentOffset = 0;
let sinceId;
let checkNewInterval;
let loading = false;
const app = document.querySelector('.js-app');
const loader = document.querySelector('.js-loader');

const render = (posts) => {
  app.appendChild(cards(posts));
}

const addListeners = () => {
  const hearts = app.lastElementChild.querySelectorAll('.js-heart');
  hearts.forEach((heart) => {
    heart.addEventListener('animationend', function onEnd(event){
      const btn = event.target.closest('.js-like');
      btn.classList.remove('is-animating');
      btn.classList.add('is-success');
    });
  });

  const arrows = app.lastElementChild.querySelectorAll('.js-arrow');
  arrows.forEach((arrow) => {
    arrow.addEventListener('animationend', function onEnd(event){
      const btn = event.target.closest('.js-reblog');
      btn.classList.remove('is-animating');
      btn.classList.add('is-success');
    });
  });
}

const showLoading = () => {
  if(currentOffset !== 0){
    loader.classList.remove('is-hidden');
  }
}

const hideLoading = () => {
  const placeholder = document.querySelector('.js-placeholder');
  placeholder &&  placeholder.parentElement.removeChild(placeholder);
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

const showNewPostsBanner = (num) => {
  const banner = document.querySelector('.js-banner');
  const postCount = document.querySelector('.js-post-count');
  postCount.textContent = num;
  banner.classList.remove('is-closed');
}

const poll = () => {
  requestData(`/api/dashboard?since_id=${sinceId}`)
    .then(json => {
      if(json.posts.length > 0){
        showNewPostsBanner(json.posts.length);
      }
    });
}

const loadNextPage = () => {
  showLoading();
  loading = true;
  requestData(`/api/dashboard?limit=18&offset=${currentOffset}`)
    .then(json => {
      hideLoading();
      render(json.posts);
      setHidden(json.posts);
      addListeners();
      if(currentOffset === 0){
        sinceId = json.posts[0].id;
        checkNewInterval = setInterval(poll, 5000);
      }
      currentOffset += 18;
      loading = false;
    })
}

loadNextPage();

/* --- CLICK EVENT DELEGATION --- */

app.addEventListener('click', function (event) {
  if (event.target.classList.contains('js-like')) {
    onLikeClick(event);
  }
  else if (event.target.classList.contains('js-reblog')) {
    onReblogClick(event);
  }
  else if (event.target.classList.contains('js-photo')) {
    onPhotoClick(event);
  }
  else if (event.target.classList.contains('js-photo-nav')) {
    onPhotoNavClick(event);
  }
  else if (event.target.classList.contains('js-hide-button')) {
    onHideImageClick(event);
  }
})

/* --- BACK TO TOP --- */

var toTop = document.querySelector('.js-top');
toTop.onclick = () => {
  app.scrollIntoView({behavior: 'smooth', block: 'start'});
} 

/* --- SCROLL SPY --- */

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

  if (currentScrollY > clientHeight) {
    if(toTop.classList.contains('is-offscreen')){
      toTop.classList.remove('is-offscreen');
    }
  }
  else if (currentScrollY < clientHeight) {
    if(!toTop.classList.contains('is-offscreen')){
      toTop.classList.add('is-offscreen');
    }
  }
}

window.addEventListener('scroll', onScroll, false);
