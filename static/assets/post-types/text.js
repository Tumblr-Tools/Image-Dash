import templateTag from '../util/template-tag.js';
import blogInfo from './blog-info.js';

const title = templateTag`<h2 class="text__heading">${'title'}</h2>`;
const body = templateTag`<section class="text__body">${'body'}</section>`;
  
export default (post) => (`<article class="text">
  ${post.title ? title(post) : ''}
  ${body(post)}
  ${blogInfo(post)}
</article>`)
