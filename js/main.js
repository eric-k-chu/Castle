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
const $accountInfoLeague = document.querySelector('#account-info-league');

// Account Stats
const $accountStats = document.querySelector('#account-stats');

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
    xhr.open('GET', `https://api.chess.com/pub/player/${$headerSearch.value}`);
    xhr.responseType = 'json';
    xhr.addEventListener('load', function () {

      if (xhr.status === 200) {
        data.viewSwap($playerInfo);
        insertAccountInfo(xhr.response);
        insertStats($headerSearch.value);
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

  $accountInfoLeague.textContent = response.league;
}

/* <div class="stats-box">
    <div class="mode-icon">
      <i class="fa-solid fa-sun"></i>
    </div>
    <div class="mode-info">
      <p class="mode-name">Daily</p>
      <p class="mode-rating">1526</p>
    </div>
    <div class="mode-wpct">
      <p class="mode-pct">70.46%</p>
      <p class="mode-desc">Win %</p>
    </div>
  </div> */

function renderStat(type, stats) {
  const game = getGame(type);

  const $parentDiv = document.createElement('div');
  $parentDiv.className = 'stats-box';

  const $iconDiv = document.createElement('div');
  $iconDiv.className = 'mode-icon';
  const $icon = document.createElement('i');
  $icon.className = game.icon;

  const $infoDiv = document.createElement('div');
  $infoDiv.className = 'mode-info';
  const $pName = document.createElement('p');
  $pName.className = 'mode-name';
  $pName.textContent = game.name;
  const $pRating = document.createElement('p');
  $pRating.className = 'mode-rating';

  const $wpctDiv = document.createElement('div');
  $wpctDiv.className = 'mode-wpct';
  const $pPCT = document.createElement('p');
  $pPCT.className = 'mode-pct';
  const $pDesc = document.createElement('p');
  $pDesc.className = 'mode-desc';
  $pDesc.textContent = 'Win %';

  if (game.name === 'Puzzles') {
    $pRating.textContent = stats.lowest.rating;
    $pPCT.textContent = stats.highest.rating;
    $pDesc.textContent = 'Highest';
  } else if (game.name === 'Puzzle Rush') {
    $pPCT.textContent = stats.best.total_attempts;
    $pPCT.textContent = stats.best.score;
    $pDesc.textContent = 'Score';
  } else {
    $pRating.textContent = stats.last.rating;
    $pPCT.textContent = getWPCT(stats.record.win, stats.record.loss, stats.record.draw);
  }

  $parentDiv.appendChild($iconDiv);
  $parentDiv.appendChild($infoDiv);
  $parentDiv.appendChild($wpctDiv);

  $iconDiv.appendChild($icon);
  $infoDiv.appendChild($pName);
  $infoDiv.appendChild($pRating);
  $wpctDiv.appendChild($pPCT);
  $wpctDiv.appendChild($pDesc);

  return $parentDiv;
}

function insertStats(username) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', `https://api.chess.com/pub/player/${username}/stats`);
  xhr.responseType = 'json';
  xhr.addEventListener('load', function (event) {
    const gameModes = Object.keys(xhr.response);
    gameModes.forEach((key, index) => {
      if (key !== 'fide') {
        const $statBox = renderStat(key, xhr.response[key]);
        $accountStats.appendChild($statBox);
      }
    });
  });
  xhr.send();
}

function getGame(string) {
  const obj = {};
  switch (string) {
    case 'chess_daily':
      obj.name = 'Daily';
      obj.icon = 'fa-solid fa-sun';
      return obj;
    case 'chess960_daily':
      obj.name = 'Daily 960';
      obj.icon = 'fa-regular fa-sun';
      return obj;
    case 'chess_rapid':
      obj.name = 'Rapid';
      obj.icon = 'fa-solid fa-stopwatch';
      return obj;
    case 'chess_bullet':
      obj.name = 'Bullet';
      obj.icon = 'fa-solid fa-rocket';
      return obj;
    case 'chess_blitz':
      obj.name = 'Blitz';
      obj.icon = 'fa-solid fa-bolt';
      return obj;
    case 'tactics':
      obj.name = 'Puzzles';
      obj.icon = 'fa-solid fa-puzzle-piece';
      return obj;
    case 'puzzle_rush':
      obj.name = 'Puzzle Rush';
      obj.icon = 'fa-solid fa-bolt-lightning';
      return obj;
  }
}

function getWPCT(win, loss, draw) {
  const total = win + loss + draw;
  const dec = (2 * win + draw) / (2 * total);
  const pct = Math.trunc(dec * 100);
  return `${pct}%`;
}
