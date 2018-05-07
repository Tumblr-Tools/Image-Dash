import templateTag from '../util/template-tag.js';

export default templateTag`<div class="blog-info">
  <img class="blog-info__avatar" src="http://api.tumblr.com/v2/blog/${'blog_name'}.tumblr.com/avatar/16">
  <a class="blog-info__name" href="http://${'blog_name'}.tumblr.com/">${'blog_name'}</a>
</div>`;