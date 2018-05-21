import blogInfo from '../blog-info.js';
import postTemplate from '../post.js';

export default (post) => {

  let photo;
  if(post.photos !== undefined){
    photo = post.photos[0].alt_sizes
      .filter(size => size.width <= 250)
      .reduce((acc, curr) => acc.width < curr.width ? curr : acc);
  }

  const content = `<a href="${post.url}" class="link"> 
    ${photo ?
      `<header class="link__header">
        <div class="link__publisher">${post.publisher}</div>
         <img src="${photo.url}" width="${photo.width}" height="${photo.height}" />
      </header>` 
    :''}
      <div class="link__body">
        <h2 class="link__title">${post.title}</h2>
        <p class="link__excerpt">${post.excerpt}</p>
        ${post.link_author ? 
          `<p class="link__author">- ${post.link_author}</p>`
        :''}
      </div>
    </a>`;

  const body = `${post.reblog && post.reblog.comment ? 
    `<div class="link__comment">
        ${post.reblog.comment}
    </div>`
  :''}`;

  /*
  return `<article class="link">
    <a href="${post.url}">
    ${photo ?
      `<header class="link__header">
        <div class="link__publisher">${post.publisher}</div>
         <img src="${photo.url}" width="${photo.width}" height="${photo.height}" />
      </header>` 
    :''}
      <div class="link__body">
        <h2 class="link__title">${post.title}</h2>
        <p class="link__excerpt">${post.excerpt}</p>
        ${post.link_author ? 
          `<p class="link__author">- ${post.link_author}</p>`
        :''}
      </div>
    </a>
    ${blogInfo(post)}
    ${post.reblog && post.reblog.comment ? 
      `<div class="link__comment">
          ${post.reblog.comment}
      </div>`
    :''}
  </article>`;
  */

  return (
    postTemplate({
      content: content,
      author: blogInfo(post),
      body: body
    })
  );
};