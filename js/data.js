/* exported data */
const $home = document.querySelector('#home');
const $headSearch = document.querySelector('#header-search');
const $bodySearch = document.querySelector('#main-search');

const data = {
  currentView: $home,

  viewSwap: function (newView) {
    this.currentView.classList.toggle('hidden');
    newView.classList.toggle('hidden');
    this.currentView = newView;
  }
};

window.addEventListener('beforeunload', function (event) {
  $headSearch.value = '';
  $bodySearch.value = '';
});
