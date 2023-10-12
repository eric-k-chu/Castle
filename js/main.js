// Search bars
const $forms = document.querySelectorAll('form');

// Header
const $logo = document.querySelector('#logo');
const $navbar = document.querySelector('#nav-bar');
const $navItems = document.querySelectorAll('.nav-item');

// Views
const $homePage = document.querySelector('#home');
const $failedSearch = document.querySelector('#failed-search');
const $playerInfo = document.querySelector('#player-info');
const $leaderboard = document.querySelector('#leaderboard');
const $bookmarks = document.querySelector('#bookmarks');
const $dailyPuzzle = document.querySelector('#daily-puzzle');

// Account Info
const $accountInfoImg = document.querySelector('#account-info-img');
const $accountInfoUser = document.querySelector('#account-info-username');
const $accountInfoCountry = document.querySelector('#account-info-country');
const $accountInfoName = document.querySelector('#account-info-name');
const $accountInfoFollowers = document.querySelector('#account-info-followers');
const $accountInfoLocation = document.querySelector('#account-info-location');
const $accountInfoJoined = document.querySelector('#account-info-joined');
const $accountInfoLeague = document.querySelector('#account-info-league');
const $leagueIcon = document.querySelector('#league-icon');

// Tables
const $statsTable = document.querySelector('#stats-table > tbody');
const $clubsTable = document.querySelector('#clubs-table');

// Match History
const $matchListDate = document.querySelector('#match-list-date');
const $matchErrorMsg = document.querySelector('#match-error-msg');
const $matchList = document.querySelector('#match-list');
const $winPCT = document.querySelector('#win-pct');
const $wld = document.querySelectorAll('#wld span');

// Refresh buttons
const $refreshBtns = document.querySelector('#player-summary');

// Leaderboard
const $leaderboardSelect = document.querySelector('#leaderboard-select');
const $leaderboardHeader = document.querySelector('#leaderboard-table thead');
const $leaderboardBody = document.querySelector('#leaderboard-table tbody');

// Bookmarks
const $bookmarksList = document.querySelector('#bookmarks-list');
const $bookmarkModal = document.querySelector('.bookmark-modal');
const $modalMsg = document.querySelector('.bookmark-modal p');
const $modalIcon = document.querySelector('.bookmark-modal i');

// Daily Puzzle
const $dailyPuzzleLink = document.querySelector('.board-wrapper');
const $dailyPuzzleImg = document.querySelector('.board-wrapper img');
const $dailyPuzzleTitle = document.querySelector('.daily-puzzle-title');
const $dailyPuzzleTime = document.querySelector('.daily-puzzle-time');

// Tabs
const $tabContainer = document.querySelector('.tab-container');
const $tabs = document.querySelectorAll('.tab');
const $views = document.querySelectorAll('.view');

// Tournaments
const $tournamentTable = document.querySelector('.tournament-table > tbody');
const $selectContainer = document.querySelector('.select-container');
const $selects = document.querySelectorAll('.select');

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

const monthsAbbr = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec'
];

const leagueIcons = {
  Wood: 'https://www.chess.com/bundles/web/images/leagues/badges/wood.b8940cb5.svg',
  Stone:
    'https://www.chess.com/bundles/web/images/leagues/badges/stone.3434a62c.svg',
  Bronze:
    'https://www.chess.com/bundles/web/images/leagues/badges/bronze.b529d5c1.svg',
  Silver:
    'https://www.chess.com/bundles/web/images/leagues/badges/silver.6e7fa8dc.svg',
  Crystal:
    'https://www.chess.com/bundles/web/images/leagues/badges/crystal.232d0aa5.svg',
  Elite:
    'https://www.chess.com/bundles/web/images/leagues/badges/elite.970af95e.svg',
  Champion:
    'https://www.chess.com/bundles/web/images/leagues/badges/champion.0c764ca5.svg',
  Legend:
    'https://www.chess.com/bundles/web/images/leagues/badges/legend.1ea014f3.svg'
};

$selectContainer.addEventListener('click', function (event) {
  if (event.target.matches('.select')) {
    const type = event.target.getAttribute('id').replace('-', '_');
    $selects.forEach(n => {
      n.className = n === event.target ? 'select active' : 'select';
    });
    renderTournamentTable(data.currentPlayer.tournaments[type]);
  }
});

$tabContainer.addEventListener('click', function (event) {
  if (event.target.matches('.tab')) {
    const dataView = event.target.getAttribute('data-view');
    $tabs.forEach(n => {
      n.className = n === event.target ? 'tab active' : 'tab';
    });
    $views.forEach(n => {
      n.className =
        n.getAttribute('data-view') === dataView ? 'view' : 'view hidden';
    });
    if (dataView === 'tournaments' && !data.currentPlayer.tournaments) {
      insertTournaments();
    }
  }
});

$refreshBtns.addEventListener('click', function (event) {
  if (event.target.closest('button')) {
    const target = event.target.closest('button').id;
    if (target === 'refresh-stats') {
      clearStats();
      getStats();
    } else if (target === 'refresh-clubs') {
      clearClubs();
      getClubs();
    } else if (target === 'refresh-matches') {
      clearMatchList();
      getArchives();
    }
  }
});

$navbar.addEventListener('click', function (event) {
  if (event.target === $navItems[0]) {
    viewSwap($homePage);
  } else if (event.target === $navItems[1]) {
    viewSwap($leaderboard);
    if (!data.leaderboard) {
      getLeaderboard();
    }
  } else if (event.target === $navItems[2]) {
    viewSwap($bookmarks);
  } else if (event.target === $navItems[3]) {
    viewSwap($dailyPuzzle);
    if (!data.dailyPuzzle) {
      getDailyPuzzle();
    }
  }
});

$leaderboardSelect.addEventListener('change', function (event) {
  clearLeaderboards();
  renderLeaderboard(Number($leaderboardSelect.value));
});

$logo.addEventListener('click', function (event) {
  viewSwap($homePage);
});

$matchList.addEventListener('click', function (event) {
  if (event.target.className.includes('fa-bookmark')) {
    if (event.target.closest('div.match-entry')) {
      const $selected = event.target.closest('div.match-entry');
      if (!data.bookmarks.has($selected.getAttribute('data-id'))) {
        const entryHTML = $selected.cloneNode(true).outerHTML;
        const key = $selected.getAttribute('data-id');
        data.bookmarks.set(key, entryHTML);
        $bookmarksList.innerHTML += entryHTML;
        setBookmarkModal('Game added.');
      } else {
        setBookmarkModal('Game already saved.');
      }
      displayBookmarkModal();
    }
  }
});

$bookmarksList.addEventListener('click', function (event) {
  if (event.target.closest('div.match-entry')) {
    const $entry = event.target.closest('div.match-entry');
    $entry.classList.toggle('zoom-delete');
    data.entryToDelete = $entry;
  }
});

$bookmarkModal.addEventListener('animationend', function (event) {
  $bookmarkModal.classList.toggle('hidden');
  $bookmarkModal.classList.toggle('fade-out');
});

$bookmarksList.addEventListener('animationend', function (event) {
  data.bookmarks.delete(data.entryToDelete.getAttribute('data-id'));
  $bookmarksList.removeChild(data.entryToDelete);
  setBookmarkModal('Game deleted.');
  displayBookmarkModal();
  data.entryToDelete = null;
});

$forms[0].addEventListener('submit', function (event) {
  event.preventDefault();
  getPlayerInfo($forms[0][0].value);
  getStats();
  getClubs();
  getArchives();
  viewSwap($playerInfo);
  $forms[0][0].value = '';
});

$forms[1].addEventListener('submit', function (event) {
  event.preventDefault();
  getPlayerInfo($forms[1][0].value);
  getStats();
  getClubs();
  getArchives();
  viewSwap($playerInfo);
  $forms[1][0].value = '';
});

$matchListDate.addEventListener('change', function (event) {
  clearMatchList();
  const month = $matchListDate.value;
  const year =
    $matchListDate.options[$matchListDate.selectedIndex].parentElement.label;
  getMonthlyArchive(getMonthlyGameEndpoint(month, year));
});

function clearTournamentTable() {
  while ($tournamentTable.firstChild) {
    $tournamentTable.removeChild($tournamentTable.firstChild);
  }
}

function renderTournamentTable(tournamentList) {
  clearTournamentTable();
  tournamentList.forEach((n, i) => {
    let { url, placement, points_awarded: points } = n;
    const id = n['@id'];
    placement = placement ?? '-';
    points = points || '-';

    const name = getTournamentName(id);

    const $tr = `<tr>
                  <td>${i + 1}</td>
                  <td>
                    <a href="${url}" target="_blank">${name}</a>
                  </td>
                  <td>${placement}</td>
                  <td>${points}</td>
                </tr>`;
    $tournamentTable.innerHTML += $tr;
  });
}

function getTournamentName(url) {
  const words = url.split('/', 6);
  const name = words[words.length - 1].split('-').filter(char => char !== '');
  const nameCapitalize = name.map(n => n[0].toUpperCase() + n.slice(1));
  return nameCapitalize.join(' ');
}

function insertTournaments() {
  const xhr = new XMLHttpRequest();
  xhr.open(
    'GET',
    `https://api.chess.com/pub/player/${data.currentPlayer.username}/tournaments`
  );
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    if (xhr.status === 200) {
      data.currentPlayer.tournaments = xhr.response;
      renderTournamentTable(xhr.response.finished);
    }
  });
  xhr.send();
}

function getLeaderboard() {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://api.chess.com/pub/leaderboards');
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    const gameList = new Map();
    let i = 0;
    for (const key in xhr.response) {
      gameList.set(i, xhr.response[key]);
      i++;
    }
    data.leaderboard = gameList;
    renderLeaderboard(Number($leaderboardSelect.value));
  });
  xhr.send();
}

function renderLeaderboard(index) {
  const rankingList = data.leaderboard.get(index);

  if (index > 9) {
    const $header = `<tr>
                <th class="rank">Rank</th>
                <th class="username">Name</th>
                <th class="country">Country</th>
                <th class="rating">Score</th>
              </tr>`;
    $leaderboardHeader.innerHTML += $header;
    rankingList.forEach((n, i) => {
      const countryCode = n.country.slice(-2).toLowerCase();
      const $entry = `<tr class="bg-white">
            <td class="rank">${n.rank}</td>
            <td class="username">${n.username}</td>
            <td class="country"><span class="fi fi-${countryCode}"></span></td>
            <td class="rating">${n.score}</td>
          </tr>`;
      $leaderboardBody.innerHTML += $entry;
    });
  } else {
    const $header = `<tr>
                <th class="rank">Rank</th>
                <th class="username">Name</th>
                <th class="country">Country</th>
                <th class="rating">Rating</th>
                <th class="win-pct">Win %</th>
              </tr>`;
    $leaderboardHeader.innerHTML += $header;
    rankingList.forEach((n, i) => {
      const countryCode = n.country.slice(-2).toLowerCase();
      const wpct = getWPCTStr(n.win_count, n.draw_count, n.loss_count);
      const $entry = `<tr class="bg-white">
                  <td class="rank">${n.rank}</td>
                  <td class="username">${n.username}</td>
                  <td class="country"><span class="fi fi-${countryCode}"></span></td>
                  <td class="rating">${n.score}</td>
                  <td class="win-pct">${wpct}</td>
                </tr>`;
      $leaderboardBody.innerHTML += $entry;
    });
  }
}

function getPlayerInfo(username) {
  clearWPCTElement();
  clearTableElements();
  clearMatchErrorMsg();
  data.currentPlayer = {};
  data.currentPlayer.username = username.toLowerCase();
  const xhr = new XMLHttpRequest();
  xhr.open('GET', `https://api.chess.com/pub/player/${username.toLowerCase()}`);
  xhr.responseType = 'json';
  xhr.addEventListener('load', function () {
    if (xhr.status === 200) {
      insertAccountInfo(xhr.response);
      viewSwap($playerInfo);
    } else {
      viewSwap($failedSearch);
    }
  });
  xhr.send();
}

function insertAccountInfo({
  avatar,
  name,
  username,
  followers,
  country,
  location,
  joined,
  league
}) {
  $accountInfoUser.textContent = username;
  $accountInfoImg.alt = `${username} avatar`;
  const countryCode = country.slice(-2).toLowerCase();
  $accountInfoCountry.className = `fi fi-${countryCode}`;
  $accountInfoFollowers.textContent = ` ${followers}`;
  const { monthFull, day, year } = getDateObj(joined);
  $accountInfoJoined.textContent = `Joined ${monthFull} ${day}, ${year}`;

  if (name === undefined) {
    $accountInfoName.textContent = 'N/A';
  } else {
    $accountInfoName.textContent = name;
  }

  if (location === undefined) {
    $accountInfoLocation.textContent = ' N/A';
  } else {
    $accountInfoLocation.textContent = ` ${location}`;
  }

  if (avatar === undefined) {
    $accountInfoImg.src = '/images/placeholder-image-square.jpg';
  } else {
    $accountInfoImg.src = avatar;
  }

  if (league === undefined) {
    $accountInfoLeague.textContent = 'Unrated';
    $leagueIcon.src = '';
    $leagueIcon.alt = '';
  } else {
    $accountInfoLeague.textContent = league;
    $leagueIcon.src = leagueIcons[league];
    $leagueIcon.alt = league;
  }
}

function getGame(string) {
  switch (string) {
    case 'chess_daily':
      return 'Daily';
    case 'chess960_daily':
      return 'Daily 960';
    case 'chess_rapid':
      return 'Rapid';
    case 'chess_bullet':
      return 'Bullet';
    case 'chess_blitz':
      return 'Blitz';
    case 'tactics':
      return 'Puzzles';
    case 'puzzle_rush':
      return 'Puzzle Rush';
  }
}

function renderStat(type, stats) {
  const name = getGame(type);

  const $tr = document.createElement('tr');
  const $tdMode = document.createElement('td');
  const $tdStat = document.createElement('td');

  const $p1 = document.createElement('p');
  const $p2 = document.createElement('p');
  const $p3 = document.createElement('p');
  const $p4 = document.createElement('p');

  if (name === 'Puzzles') {
    $p1.textContent = name;
    $p2.textContent = `${stats.lowest.rating}`;
    $p3.textContent = stats.highest.rating;
    $p4.textContent = 'Highest';
  } else if (name === 'Puzzle Rush') {
    if (Object.keys(stats).length > 0) {
      $p1.textContent = name;
      $p2.textContent = `${stats.best.total_attempts}`;
      $p3.textContent = stats.best.score;
      $p4.textContent = 'Score';
    }
  } else {
    $p1.textContent = name;
    $p2.textContent = stats.last.rating;
    $p3.textContent = getWPCTStr(
      stats.record.win,
      stats.record.loss,
      stats.record.draw
    );
    $p4.textContent = 'Win %';
  }

  $tr.appendChild($tdMode);
  $tr.appendChild($tdStat);
  $tdMode.append($p1, $p2);
  $tdStat.append($p3, $p4);

  return $tr;
}

function getStats() {
  if (!data.currentPlayer.username) {
    return;
  }

  const xhr = new XMLHttpRequest();
  xhr.open(
    'GET',
    `https://api.chess.com/pub/player/${data.currentPlayer.username}/stats`
  );
  xhr.responseType = 'json';
  xhr.addEventListener('load', function (event) {
    if (xhr.status === 200) {
      data.currentPlayer.stats = xhr.response;
      const gameModes = Object.keys(xhr.response);
      gameModes.forEach((key, index) => {
        if (key !== 'fide') {
          const $statBox = renderStat(key, xhr.response[key]);
          $statsTable.appendChild($statBox);
        }
      });
    } else {
      handleError(xhr.status, 'stats');
    }
  });
  xhr.send();
}

function renderClub(club) {
  const $row = document.createElement('div');
  $row.className = 'row align-center';

  const $iconWrapper = document.createElement('div');
  $iconWrapper.className = 'club-icon-wrapper';
  const $icon = document.createElement('img');
  $icon.src = club.icon;
  $icon.alt = 'club icon';

  const $clubDesc = document.createElement('div');
  $clubDesc.className = 'col';
  const $p1 = document.createElement('p');
  const $p2 = document.createElement('p');
  $p1.textContent = club.name;

  const { monthAbbr, day, year } = getDateObj(club.joined);
  $p2.textContent = `Joined ${monthAbbr} ${day}, ${year}`;

  $row.append($iconWrapper, $clubDesc);
  $iconWrapper.appendChild($icon);
  $clubDesc.append($p1, $p2);

  return $row;
}

function getClubs() {
  if (!data.currentPlayer.username) {
    return;
  }
  const xhr = new XMLHttpRequest();
  xhr.open(
    'GET',
    `https://api.chess.com/pub/player/${data.currentPlayer.username}/clubs`
  );
  xhr.responseType = 'json';
  xhr.addEventListener('load', function (event) {
    if (xhr.status === 200) {
      data.currentPlayer.clubs = xhr.response;
      const clubs = xhr.response.clubs;

      if (clubs.length < 1) {
        const $msg = document.createElement('div');
        $msg.className = 'row justify-center';
        const $p = document.createElement('p');
        $p.textContent = 'Not in any clubs';
        $msg.appendChild($p);
        $clubsTable.append($msg);
      } else {
        clubs.forEach((n, i) => {
          $clubsTable.appendChild(renderClub(n));
        });
      }
    } else {
      handleError(xhr.status, 'clubs');
    }
  });
  xhr.send();
}

function renderMatch({
  url,
  pgn,
  end_time: endTime,
  uuid,
  time_class: timeClass,
  rules,
  white,
  black
}) {
  const mode = getMode(timeClass, rules);
  const { monthAbbr, day, year } = getDateObj(endTime);
  const date = `${monthAbbr} ${day}, ${year}`;
  const whiteUser = white.username.toLowerCase();
  const blackUser = black.username.toLowerCase();

  const result = parsePGN(pgn, whiteUser, blackUser);

  const $entry = `<div class="match-entry ${result.bgColor}" data-id="${uuid}">
                    <table class="match-info">
                      <tbody>
                        <tr class="row justify-around">
                          <td class="info-cell">
                            <div class="cell-wrapper">
                              <div>
                                <div>
                                  <span>${mode}</span>
                                </div>
                                <div>
                                  <span class="text-gray">${date}</span>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td class="user-cell">
                            <div class="cell-wrapper">
                              <div>
                                <div class="cell-names">
                                  <i class="fa-solid fa-chess-pawn text-white"></i>
                                  <span>${whiteUser}</span>
                                  <span class="text-gray">${white.rating}</span>
                                </div>
                                <div class="cell-names">
                                  <i class="fa-solid fa-chess-pawn text-gray-2"></i>
                                  <span>${blackUser}</span>
                                  <span class="text-gray">${black.rating}</span>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td class="result-cell">
                            <div class="cell-wrapper">
                              <div>
                                <div>
                                  <span class="${result.color}">${result.resultStr}</span>
                                </div>
                                <div>
                                  <span class="text-gray">${result.moves} moves</span>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td class="link-cell">
                            <div class="row justify-center">
                              <a href="${url}" target="_blank" class="text-white">
                                <i class="fa-solid fa-link"></i>
                              </a>
                            </div>
                            <div class="row justify-center">
                              <button type="button" class="bookmark-btn">
                                <i class="fa-regular fa-bookmark"></i>
                              </button>
                            </div>
                            <div class="row justify-center">
                              <button type="button" class="delete-btn">
                                <i class="fa-solid fa-trash-can"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>`;
  return $entry;
}

function getMonthlyArchive(game) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', game);
  xhr.responseType = 'json';
  xhr.addEventListener('load', function (event) {

    const games = xhr.response.games;
    let count = 0;
    for (let i = games.length - 1; i >= 0; i--) {
      if (count >= 50) {
        break;
      }
      $matchList.innerHTML += renderMatch(games[i]);
      count++;
    }
    updateWPCTElements();
  });
  xhr.send();
}

function getArchives() {
  if (!data.currentPlayer.username) {
    return;
  }
  const xhr = new XMLHttpRequest();
  xhr.open(
    'GET',
    `https://api.chess.com/pub/player/${data.currentPlayer.username}/games/archives`
  );
  xhr.responseType = 'json';
  xhr.addEventListener('load', function (event) {
    if (xhr.status === 200) {
      data.currentPlayer.archives = xhr.response;
      if (xhr.response.archives.length === 0) {
        toggleMatchErrorMsg();
      } else {
        const lastIndex = xhr.response.archives.length - 1;

        xhr.response.archives.forEach((n, i, arr) => {
          const [month, year] = getMonthAndYear(arr[lastIndex - i]);
          const $optGroup = document.querySelector(
            `#match-list-date optgroup[label="${year}"`
          );
          if (!$optGroup) {
            const $newOptGroup = $matchListDate.appendChild(
              renderOptGroup(year)
            );
            $newOptGroup.appendChild(renderOption(month));
          } else {
            $optGroup.appendChild(renderOption(month));
          }
        });

        const lastEndpoint = xhr.response.archives[lastIndex];
        getMonthlyArchive(lastEndpoint);
      }
    } else {
      handleError(xhr.status, 'matches');
    }
  });
  xhr.send();
}

function getWPCTStr(win, loss, draw) {
  const total = win + loss + draw;
  const dec = (2 * win + draw) / (2 * total);
  const pct = Math.trunc(dec * 100);
  return `${pct}%`;
}

function getDateObj(timestamp) {
  const date = new Date(timestamp * 1000);
  const monthFull = months[date.getMonth()];
  const monthAbbr = monthsAbbr[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();
  return { monthFull, monthAbbr, day, year };
}

function getMode(timeClass, rules) {
  if (rules === 'chess') {
    return timeClass[0].toUpperCase() + timeClass.slice(1);
  } else if (rules === 'chess960') {
    return 'Daily 960';
  } else if (rules === 'bughouse') {
    return 'Bughouse';
  } else if (rules === 'kingofthechill') {
    return 'King of the Hill';
  } else if (rules === 'threecheck') {
    return '3-Check';
  } else if (rules === 'crazyhouse') {
    return 'Crazyhouse';
  }
}

function parsePGN(pgn, white, black) {
  let isTimeCodeEnd = false;
  let isMoveNotation = false;
  const hasTimeCode = pgn.includes('{');
  const moveCount = [];
  let result = '';
  let colorStr = '';
  let bgColorStr = '';

  let i = pgn.length - 1;

  while (moveCount.length < 2 || /[0-9]/.test(pgn[i + 1])) {
    if (isMoveNotation && /[0-9]/.test(pgn[i])) {
      moveCount.unshift(pgn[i]);
    }

    if (hasTimeCode) {
      if (pgn[i] === '{') {
        isTimeCodeEnd = true;
      }

      if (isTimeCodeEnd && pgn[i] === '.') {
        isMoveNotation = true;
      }
    } else {
      if (pgn[i] === '.') {
        isMoveNotation = true;
      }
    }

    // penultimate character is always a number 0, 1, or 2
    if (i === pgn.length - 2) {
      if (
        (pgn[i] === '0' && data.currentPlayer.username === white) ||
        (pgn[i] === '1' && data.currentPlayer.username === black)
      ) {
        result = 'Win';
        colorStr = 'text-green';
        bgColorStr = 'bg-win';
        data.win++;
      } else if (pgn[i] === '2') {
        result = 'Draw';
        colorStr = 'text-gray';
        bgColorStr = 'bg-draw';
        data.draw++;
      } else {
        result = 'Loss';
        colorStr = 'text-red';
        bgColorStr = 'bg-loss';
        data.loss++;
      }
    }
    i--;
  }
  return {
    resultStr: result,
    moves: moveCount.join(''),
    color: colorStr,
    bgColor: bgColorStr
  };
}

// archive endpoint last part example: ..games/2021/07"
function getMonthAndYear(endpointStr) {
  const month = endpointStr.slice(-2);
  const year = endpointStr.slice(-7).slice(0, -3);
  const index = month[0] === '0' ? Number(month[1]) - 1 : Number(month) - 1;
  return [months[index], year];
}

function getMonthlyGameEndpoint(month, year) {
  const date = [month, '1, ', year];
  const monthNum = `0${new Date(Date.parse(date)).getMonth() + 1}`;
  return `https://api.chess.com/pub/player/${data.currentPlayer.username}/games/${year}/${monthNum}`;
}

function updateWPCTElements() {
  $winPCT.textContent = `${getWPCT()}%`;

  $wld.forEach((n, i) => {
    switch (i) {
      case 0:
        n.textContent = data.win;
        break;
      case 1:
        n.textContent = '|';
        break;
      case 2:
        n.textContent = data.loss;
        break;
      case 3:
        n.textContent = '|';
        break;
      case 4:
        n.textContent = data.draw;
        break;
    }
  });
  resetwld();
}

function clearWPCTElement() {
  $winPCT.textContent = '';
  $wld.forEach((n, i) => {
    n.textContent = '';
  });
}

function clearTableElements() {
  clearStats();
  clearClubs();
  clearMatchList();
}

function clearStats() {
  while ($statsTable.firstChild) {
    $statsTable.removeChild($statsTable.firstChild);
  }
}

function clearClubs() {
  while ($clubsTable.firstChild) {
    $clubsTable.removeChild($clubsTable.firstChild);
  }
}

function clearMatchList() {
  while ($matchList.firstChild) {
    $matchList.removeChild($matchList.firstChild);
  }
}

function handleError(status, str) {
  if (str === 'stats') {
    const $error = document.createElement('tr');
    const $td = document.createElement('td');
    const $h3 = document.createElement('h3');
    $h3.textContent = `Error: ${status}`;
    $td.className = 'text-center';
    $error.appendChild($td);
    $td.appendChild($h3);
    $statsTable.appendChild($error);
  } else if (str === 'clubs') {
    const $error = document.createElement('h3');
    $error.className = 'text-center';
    $error.textContent = `Error: ${status}`;
    $clubsTable.appendChild($error);
  } else if (str === 'matches') {
    toggleMatchErrorMsg();
  }
}

function clearLeaderboards() {
  while ($leaderboardHeader.firstChild) {
    $leaderboardHeader.removeChild($leaderboardHeader.firstChild);
  }
  while ($leaderboardBody.firstChild) {
    $leaderboardBody.removeChild($leaderboardBody.firstChild);
  }
}

function setBookmarkModal(str) {
  if (str === 'Game added.' || str === 'Game deleted.') {
    $modalIcon.className = 'fa-regular fa-circle-check text-green';
  } else if (str === 'Game already saved.') {
    $modalIcon.className = 'fa-regular fa-circle-xmark text-red';
  }
  $modalMsg.textContent = str;
}

function displayBookmarkModal() {
  $bookmarkModal.classList.toggle('hidden');
  $bookmarkModal.classList.toggle('fade-out');
}

function getWPCT() {
  const upper = 2 * data.win + data.draw;
  const lower = 2 * (data.win + data.loss + data.draw);
  return ((upper / lower) * 100).toFixed(2);
}

function resetwld() {
  data.win = 0;
  data.loss = 0;
  data.draw = 0;
}

function viewSwap(newView) {
  if (newView !== data.currentView) {
    data.currentView.classList.toggle('hidden');
    newView.classList.toggle('hidden');
    data.currentView = newView;
  }
}

function renderOption(str) {
  const $option = document.createElement('option');
  $option.textContent = str;
  return $option;
}

function renderOptGroup(year) {
  const $optGroup = document.createElement('optgroup');
  $optGroup.label = `${year}`;
  return $optGroup;
}

function clearMatchErrorMsg() {
  if ($matchListDate.className.includes('hidden')) {
    toggleMatchErrorMsg();
  }
}

function toggleMatchErrorMsg() {
  $matchListDate.classList.toggle('hidden');
  $matchErrorMsg.classList.toggle('hidden');
}

function getDailyPuzzle() {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', 'https://api.chess.com/pub/puzzle');
  xhr.responseType = 'json';
  xhr.addEventListener('load', function (event) {
    data.dailyPuzzle = xhr.response;
    $dailyPuzzleLink.href = data.dailyPuzzle.url;
    $dailyPuzzleImg.src = data.dailyPuzzle.image;
    $dailyPuzzleTitle.textContent = data.dailyPuzzle.title;
    const { monthFull, day, year } = getDateObj(data.dailyPuzzle.publish_time);
    $dailyPuzzleTime.textContent = `${monthFull} ${day}, ${year}`;
  });
  xhr.send();
}
