// Search bars
const $headerSearch = document.querySelector('#header-search');
const $mainSearch = document.querySelector('#main-search');

// Pages
const $failedSearch = document.querySelector('#failed-search');
const $playerInfo = document.querySelector('#player-info');

const $errorMsg = document.querySelector('#error-msg');

// Account Info
const $accountInfoImg = document.querySelector('#account-info-img');
const $accountInfoUser = document.querySelector('#account-info-username');
const $accountInfoCountry = document.querySelector('#account-info-country');
const $accountInfoName = document.querySelector('#account-info-name');
const $accountInfoFollowers = document.querySelector('#account-info-followers');
const $accountInfoLocation = document.querySelector('#account-info-location');
const $accountInfoJoined = document.querySelector('#account-info-joined');

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];

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
        insertAccountInfo(xhr.response);
      } else {
        $errorMsg.textContent = 'Unable to find ' + $headerSearch.value + '.';
        data.viewSwap($failedSearch);
      }
    });
    xhr.send();
  }
}

function insertAccountInfo(response) {
  $accountInfoImg.src = response.avatar;
  $accountInfoUser.textContent = response.username;
  $accountInfoCountry.textContent = response.country.slice(-2);
  $accountInfoFollowers.textContent = response.followers;

  if (response.name === undefined) {
    $accountInfoName.textContent = 'N/A';
  } else {
    $accountInfoName.textContent = response.name;
  }

  if (response.location === undefined) {
    $accountInfoLocation.textContent = ' N/A';
  } else {
    $accountInfoLocation.textContent = ' ' + response.location;
  }

  const date = new Date(response.joined * 1000);
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  const joinedDate = ` Joined ${month} ${year}`;
  $accountInfoJoined.textContent = joinedDate;
}
