import blogInfo from './blog-info.js';

export default (post) => {

  console.log(post);

  return `<article class="answer">
    <div class="answer__question">
      <div class="answer__question-text">
        <div class="answer__asking-name">${post.asking_name}</div>
         ${post.question}
      </div>
      <img src="http://api.tumblr.com/v2/blog/${post.asking_name}.tumblr.com/avatar/24" width="24" height="24">
    </div>
    <div class="answer__response">
      ${post.answer}
    </div>
  </article>`
}
