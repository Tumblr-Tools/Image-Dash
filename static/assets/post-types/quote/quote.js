import templateTag from '../../util/template-tag.js';
import blogInfo from '../blog-info.js';
import postTemplate from '../post.js';

const quote = templateTag`<blockquote class="quote">
  ${'text'}
  <footer class="quote__footer">
    <cite>- ${'source'}</cite>
  </footer>
</blockquote>`;

export default (post) => (
  postTemplate({
    content: quote(post),
    author: blogInfo(post),
    body: ''
  })
);