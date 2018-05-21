import blogInfo from '../blog-info.js';
import postTemplate from '../post.js';

export default (post) => (
  postTemplate({
    content: post.player[0].embed_code,
    author: blogInfo(post),
    body: post.caption
  })
);
