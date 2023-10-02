const $headerSearch = document.querySelector('#header-search');
const $mainSearch = document.querySelector('#main-search');
const $errorMsg = document.querySelector('#error-msg');
const $failedSearch = document.querySelector('#failed-search');
const $playerInfo = document.querySelector('#player-info');

$headerSearch.addEventListener('keydown', getPlayerInfo);
$mainSearch.addEventListener('keydown', getPlayerInfo);

function getPlayerInfo(event) {
  if (event.key === 'Enter') {
    const xhr = new XMLHttpRequest();
    const endpoint = `https://api.chess.com/pub/player/${$headerSearch.value}`;
    xhr.open('GET', endpoint);
    xhr.responseType = 'json';
    xhr.addEventListener('load', function () {

      if (xhr.status === 200) {
        data.viewSwap($playerInfo);
      } else {
        $errorMsg.textContent = 'Unable to find ' + $headerSearch.value + '.';
        data.viewSwap($failedSearch);
      }
    });
    xhr.send();
  }
}
