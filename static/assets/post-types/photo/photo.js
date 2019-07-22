import templateTag from '../../util/template-tag.js';
import blogInfo from '../blog-info.js';
import postTemplate from '../post.js';

const image = templateTag`<div class="photo-container js-photo-container">
  <div class="photo-container__hide-hot-area">
    <button class="photo-container__hide-button js-hide-button"></button>
  </div>
  <img 
    class="js-photo" 
    src="${'url'}" 
    width="${'width'}" 
    height="${'height'}"
    data-index="${'index'}"
  />
</div>`;

export default (post) => {

  const imgTags = post.photos.map((photo, index) => {
     const selectedSize = photo.alt_sizes
      .filter(size => size.width <= 250)
      .reduce((acc, curr) => acc.width < curr.width ? curr : acc);
    selectedSize.index = index;
    return selectedSize;
  })
  .reduce((acc, curr) => acc + image(curr), '');

  const imgNav = `<ul class="img-slider__nav js-slider-nav">
    ${post.photos.map((p, i) => `<button 
        class="img-slider__button js-photo-nav ${ i == 0 ? 'is-active' : '' }"
        data-index="${i}"
      >
        &bull;
      </button>`).join('')
    }
  </ul>`;

  const content = `<figure class="img-slider js-slider">
    <div class="img-slider__images js-slider-images">
      ${imgTags}
    </div>
    ${post.photos.length > 1 ? imgNav : ''}
  </figure>`;

  return postTemplate({
    content: content,
    author: blogInfo(post),
    body: post.caption
  });

};