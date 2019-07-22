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

const formatTime = post => {
  const d = new Date(post.date);
  let day = d.getDate();
  if (day < 10){
    day = '0' + day;
  }
  let month = d.getMonth() + 1;
  if (month < 10){
    month = '0' + month;
  }
  const year = String(d.getFullYear()).substring(2);
  const formattedTime = `${month}.${day}.${year}`;
  return formattedTime;
};

export default (post) => {
  return `<div class="card js-card" id="${post.id}" data-reblog-key="${post.reblog_key}">
    <div class="card__body">
      ${postTemplates[post.type](post)}
    </div>
    <footer class="card__footer">
      <p class="card__note-count">
        ${post.note_count}
        &nbsp;
        /
        &nbsp;
        <a class="card__post-url" href="${post.post_url}">${formatTime(post)}</a>
      </p>
      ${postActions}
    </footer>
  </div>`;
}
