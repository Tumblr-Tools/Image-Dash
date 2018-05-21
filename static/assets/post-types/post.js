import templateTag from '../util/template-tag.js';

export default templateTag`<article class="post">
  <section class="post__content">
    ${'content'}
  </section>
  <section class="post__author">
    ${'author'}
  </section>
  <section class="post__body">
    ${'body'}
  </section>
</article>`;