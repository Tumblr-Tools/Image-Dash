import blogInfo from '../blog-info.js';
import postTemplate from '../post.js';

export default (post) => (
  postTemplate({
    content: `<div class="answer">
      <div class="answer__question-text">
        <div class="answer__asking-name">${post.asking_name}</div>
         ${post.question}
      </div>
      <img src="http://api.tumblr.com/v2/blog/${post.asking_name}.tumblr.com/avatar/24" width="24" height="24">
    </div>`,
    author: blogInfo(post),
    body: post.answer
  })
);