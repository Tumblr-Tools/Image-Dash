import templateTag from '../util/template-tag.js';
import blogInfo from './blog-info.js';

const quote = templateTag`<blockquote class="quote-post__block">
  ${'text'}
  <footer class="quote-post__footer">
    <cite>- ${'source'}</cite>
  </footer>
</blockquote>`;

export default (post) => (`<div class="quote-post">
  ${quote(post)}
  ${blogInfo(post)}
</div>`);