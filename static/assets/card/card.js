import postActions from '../post-actions/post-actions.js';
import templateTag from '../util/template-tag.js';
import text from '../post-types/text.js';
import photo from '../post-types/photo.js';
import quote from '../post-types/quote.js';
import link from '../post-types/link.js';
import chat from '../post-types/chat.js';
import audio from '../post-types/audio.js';
import video from '../post-types/video.js';
import answer from '../post-types/answer.js';

const postTemplates = {
  text: text,
  photo: photo,
  quote: quote,
  link: link,
  chat: chat,
  audio: audio,
  video: video,
  answer: answer,
}

export default (post) => {
  return `<div class="card js-card">
    <div class="card__body">
      ${postTemplates[post.type](post)}
    </div>
    <footer class="card__footer">
      ${postActions}
    </footer>
  </div>`;
}
