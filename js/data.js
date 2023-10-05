/* exported data */
const $home = document.querySelector('#home');
const $headSearch = document.querySelector('#header-search');
const $bodySearch = document.querySelector('#main-search');

const data = {
  currentView: $home,
  win: 0,
  draw: 0,
  loss: 0,
  currentUsername: null,
  leaderboard: null,
  bookmarks: null,
  bookmarkID: 0,

  viewSwap: function (newView) {
    this.currentView.classList.toggle('hidden');
    newView.classList.toggle('hidden');
    this.currentView = newView;
  },

  getWPCT: function () {
    const upper = 2 * this.win + this.draw;
    const lower = 2 * (this.win + this.loss + this.draw);
    return ((upper / lower) * 100).toFixed(2);
  },

  resetWDL: function () {
    this.win = 0;
    this.draw = 0;
    this.loss = 0;
  }
};

window.addEventListener('beforeunload', function (event) {
  $headSearch.value = '';
  $bodySearch.value = '';
});
