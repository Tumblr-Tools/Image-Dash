import templateTag from '../../util/template-tag.js';
import blogInfo from '../blog-info.js';
import postTemplate from '../post.js';

const title = templateTag`<h2 class="text__heading">${'title'}</h2>`;
const body = templateTag`<section class="post__body">${'body'}</section>`;
  
export default (post) => (
  postTemplate({
    content: post.title ? title(post) : '' + body(post),
    author: blogInfo(post),
    body: ''
  })
);
