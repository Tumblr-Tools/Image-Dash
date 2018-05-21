import postActions from '../post-actions/post-actions.js';
import templateTag from '../util/template-tag.js';
import text from '../post-types/text/text.js';
import photo from '../post-types/photo/photo.js';
import quote from '../post-types/quote/quote.js';
import link from '../post-types/link/link.js';
import chat from '../post-types/chat/chat.js';
import audio from '../post-types/audio/audio.js';
import video from '../post-types/video/video.js';
import answer from '../post-types/answer/answer.js';

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
  return `<div class="card js-card" id="${post.id}" data-reblog-key="${post.reblog_key}">
    <div class="card__body">
      ${postTemplates[post.type](post)}
    </div>
    <footer class="card__footer">
      <p class="card__note-count">${post.note_count}</p>
      ${postActions}
    </footer>
  </div>`;
}
