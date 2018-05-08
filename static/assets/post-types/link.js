import blogInfo from './blog-info.js';

export default (post) => {

  const photo = post.photos[0].alt_sizes
    .filter(size => size.width <= 250)
    .reduce((acc, curr) => acc.width < curr.width ? curr : acc);

  return `<article class="link">
    <a href="${post.url}">
      <header class="link__header">
        <div class="link__publisher">${post.publisher}</div>
        <img src="${photo.url}" width="${photo.width}" height="${photo.height}" />
      </header>
      <div class="link__body">
        <h2 class="link__title">${post.title}</h2>
        <p class="link__excerpt">${post.excerpt}</p>
        <p class="link__author">- ${post.link_author}</p>
      </div>
    </a>
    ${blogInfo(post)}
  </article>`;
};