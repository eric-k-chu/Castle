/* exported data */
const $home = document.querySelector('#home');
const $headSearch = document.querySelector('#header-search');
const $bodySearch = document.querySelector('#main-search');
const $dataBookmarksList = document.querySelector('#bookmarks-list');

const previousDataJSON = localStorage.getItem('data');
const previousBookmarksJSON = localStorage.getItem('bookmarks');

let data = {
  currentView: $home,
  win: 0,
  draw: 0,
  loss: 0,
  currentUsername: null,
  leaderboard: null,
  bookmarks: new Map(),
  entryToDelete: null
};

window.addEventListener('beforeunload', function (event) {
  $headSearch.value = '';
  $bodySearch.value = '';
  const dataJSON = JSON.stringify(data);
  const bookmarksJSON = JSON.stringify(Array.from(data.bookmarks));
  localStorage.setItem('data', dataJSON);
  localStorage.setItem('bookmarks', bookmarksJSON);
});

if (previousDataJSON) {
  data = JSON.parse(previousDataJSON);
  data.bookmarks = new Map(JSON.parse(previousBookmarksJSON));
  loadBookmarks();
  data.currentView = $home;
  data.win = 0;
  data.draw = 0;
  data.loss = 0;
  data.currentUsername = null;
}

function loadBookmarks() {
  for (const element of data.bookmarks.values()) {
    $dataBookmarksList.innerHTML += element;
  }
}
