(function(){
  
  let loading = false;
  let currentOffset = 0;
  const loader = document.querySelector('.js-loader');

  function loadNextPage(){
    loading = true;
    if(currentOffset !== 0){
      loader.classList.remove('is-hidden');
    }
    fetch('/api/dashboard?limit=18&offset='+currentOffset)
      .then(function(response) {
        return response.json();
      })
      .then(function(dashboardJson) {
        renderPosts(dashboardJson.posts);
        loading = false;
        currentOffset += 18;

        loader.classList.add('is-hidden');

        const placeholder = document.querySelector('.js-placeholder');
        placeholder &&  document.body.removeChild(placeholder);

      });
  }
  
  loadNextPage();

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

  function createElement(markup) {
    const temp = document.createElement('div');
    temp.innerHTML = markup;
    const frag = document.createDocumentFragment();
    const children = Array.prototype.slice.apply(temp.childNodes);
    children.map(el => frag.appendChild(el));
    return frag;
  }

  function templateTag(strings, ...keys){
    return function(data) {
      return strings.reduce((accumulator, currentValue, currentIndex) => {
        return accumulator + data[keys[currentIndex - 1]] + currentValue;
      });
    };
  }

  const blogInfoTemplate = templateTag`<div class="blog-info">
        <img class="blog-info__avatar" src="http://api.tumblr.com/v2/blog/${'blog_name'}.tumblr.com/avatar/16">
        <a class="blog-info__name" href="http://${'blog_name'}.tumblr.com/">${'blog_name'}</a>
      </div>`;

  const summaryTemplate = templateTag`<p class="summary">${'summary'}</p>`;

  const footerTemplate = templateTag`<footer class="card__footer">
    <div class="button-toolbar">
      <button class="icon-button icon-button--like js-like">
        <svg width="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" >
          <g class="heart js-heart">
            <path d="M12,20l6.77-7A4.74,4.74,0,0,0,20,9.8,4.8,4.8,0,0,0,15.2,5,4.74,4.74,0,0,0,12,6.23l0,0,0,0A4.74,4.74,0,0,0,8.8,5,4.8,4.8,0,0,0,4,9.8,4.74,4.74,0,0,0,5.23,13Z" />
          </g>
          <g>
            <path class="pop pop--horizontal" d="M12 12 V0" />
            <path class="pop pop--horizontal" d="M12 12 V24" />
            <path class="pop pop--horizontal" d="M12 12 H0" />
            <path class="pop pop--horizontal" d="M12 12 H24" />
            <path class="pop pop--diagonal" d="M12 12 L0 0" />
            <path class="pop pop--diagonal" d="M12 12 L24 0" />
            <path class="pop pop--diagonal" d="M12 12 L24 24" />
            <path class="pop pop--diagonal" d="M12 12 L0 24" />
          </g>
        </svg>
      </button>
      <button class="icon-button icon-button--reblog js-reblog">
        <svg width="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <g>
              <path class="border" d="M19 6 Q21 6 21 8 L21 16 Q21 18 19 18 L5 18 Q3 18 3 16 L3 8 Q3 6 5 6 Z" />
              <polyline class="arrow arrow--top js-arrow" points="-3 -3 0 0 -3 3" />
              <path class="border" d="M6 18 Q4 18 4 16 L4 8 Q4 6 6 6 L18 6 Q20 6 20 8 L20 16 Q20 18 18 18 Z" />
              <polyline class="arrow arrow--bottom js-arrow" points="-3 -3 0 0 -3 3" />
          </g>
        </svg>
      </button>
    </div>
  </footer>`;

  const photoTemplate = templateTag`<div class="photo-container js-photo">
    <button class="photo-container__hide-button js-hide-button"></button>
    <img src="${'src'}" width="${'width'}" height="${'height'}">
  </div>`;

  const videoTemplate = templateTag`${'embed'}`;

  const textTemplate = templateTag`<div class="text">${'body'}</div>`;

  const sliderButtonTemplate = `<button class="img-slider__button js-slider-button">
      &#x25cf;
    </button>`;

  function populateTemplate(data){

    let body;
    let summary = ``;

    switch(data.type){
    case 'photo':
      body = photoTemplate(data);
      summary = summaryTemplate(data);
      break;
    case 'photoset':
      body = `<figure class="img-slider js-slider">
        <div class="img-slider__images js-slider-images">
          ${data.srcs.map(src => photoTemplate({src:src})).reduce((acc, cur) => acc + cur)}
        </div>
        <ul class="img-slider__nav js-slider-nav">
          ${data.srcs.map(() => sliderButtonTemplate).reduce((acc, cur) => acc + cur)}
        </ul>
      </figure>`;
      summary = summaryTemplate(data);
      break;
    case 'video':
      body = videoTemplate(data);
      summary = summaryTemplate(data);
      break;
    case 'text':
      body = textTemplate(data);
      break;
    default:
      body = data.type;
    }

    return `<div 
      class="card js-card"
      id="${data.id}"
      data-reblog-key="${data.reblog_key}"
    >
      <div class="card__body">
        ${body}
        ${blogInfoTemplate(data)}
        ${summary}
      </div>
      ${footerTemplate(data)}
    </div>`;
  }

  function renderPosts(posts){
    console.log(posts);
    const grid = document.querySelector('.js-grid');
    posts.forEach(function(post){
      let data = {
        id: post.id,
        blog_name: post.blog_name,
        reblog_key: post.reblog_key,
        type: post.type,
        summary: post.summary,
      };

      switch(data.type){
      case 'photo':
        if(post.photos.length === 1){
          const photo = post.photos[0].alt_sizes
            .filter(size => size.width <= 250)
            .reduce((acc, current) => acc.width < current.width ? current : acc);
          data.src = photo.url.replace('250', '500');
          data.width = photo.width;
          data.height = photo.height;
        } else {
          data.type = 'photoset';
          const srcs = post.photos.map((photo) => {
            return photo.alt_sizes
              .filter(size => size.width <= 250)
              .reduce((acc, current) => acc.width < current.width ? current : acc)
              .url;
          });
          data.srcs = srcs;
        }
        break;
      case 'video': {
        const video = post.player
          .filter(size => size.width <= 250)
          .reduce((acc, current) => acc.width < current.width ? current : acc);
        data.embed = video.embed_code;
        break;
      }
      case 'text':
        data.body = post.body;
        data.summary = '';
        break;
      default:
        break;
      }

      const markup = populateTemplate(data);
      const card = createElement(markup);
      grid.appendChild(card);

      if(sessionStorage.getItem(post.id)){
        hidePhoto(post.id);
      }

    });

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