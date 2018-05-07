import blogInfo from './blog-info.js';

export default (post) => (`<article class="video">
    ${post.player[0].embed_code}
    ${blogInfo(post)}
    <div class="video__body">
      ${post.caption}
    </div>
  </article>`)
