import card from '../card/card.js';

export default (posts) => {
  const frag = document.createDocumentFragment();
  const el = document.createElement('div');
  el.classList.add('cards');
  el.innerHTML = posts.map(card).join('');
  frag.appendChild(el);
  return frag;
};
