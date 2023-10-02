/* exported data */
const $home = document.querySelector('#home');

const data = {
  currentView: $home,

  viewSwap: function (newView) {
    this.currentView.classList.toggle('hidden');
    newView.classList.toggle('hidden');
    this.currentView = newView;
  }
};
