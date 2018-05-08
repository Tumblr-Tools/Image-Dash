import blogInfo from './blog-info.js';

export default (post) => (`<article class="audio">
  ${post.player}
  ${blogInfo(post)}
  <div class="audio__body">
    ${post.caption}
  </div>
</article>`)
