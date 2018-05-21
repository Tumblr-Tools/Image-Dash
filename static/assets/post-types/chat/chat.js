import blogInfo from '../blog-info.js';
import postTemplate from '../post.js';

export default (post) => {

  const chat = post.dialogue.map((response) => (
    `<div class="chat__response">
      <div class="chat__label">${response.label}</div>
      <div class="chat__phrase">${response.phrase}</div>
    </div>`
  )).join('');

  return (
    postTemplate({
      content: `<div class="chat__body">${chat}</div>`,
      author: blogInfo(post),
      body: ''
    })
  );

};
