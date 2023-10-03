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
const $leagueIcon = document.querySelector('#league-icon');

// Tables
const $statsTable = document.querySelector('#stats-table > tbody');
const $clubsTable = document.querySelector('#clubs-table');

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

// const monthsAbbr = [
//   'Jan',
//   'Feb',
//   'Mar',
//   'Apr',
//   'May',
//   'Jun',
//   'Jul',
//   'Aug',
//   'Sep',
//   'Oct',
//   'Nov',
//   'Dec'
// ];

const leagueIcons = {
  Wood: 'https://www.chess.com/bundles/web/images/leagues/badges/wood.b8940cb5.svg',
  Stone: 'https://www.chess.com/bundles/web/images/leagues/badges/stone.3434a62c.svg',
  Bronze: 'https://www.chess.com/bundles/web/images/leagues/badges/bronze.b529d5c1.svg',
  Silver: 'https://www.chess.com/bundles/web/images/leagues/badges/silver.6e7fa8dc.svg',
  Crystal: 'https://www.chess.com/bundles/web/images/leagues/badges/crystal.232d0aa5.svg',
  Elite: 'https://www.chess.com/bundles/web/images/leagues/badges/elite.970af95e.svg',
  Champion: 'https://www.chess.com/bundles/web/images/leagues/badges/champion.0c764ca5.svg',
  Legend: 'https://www.chess.com/bundles/web/images/leagues/badges/legend.1ea014f3.svg'
};

$headerSearch.addEventListener('keydown', getPlayerInfo);
$mainSearch.addEventListener('keydown', getPlayerInfo);

function getPlayerInfo(event) {
  if (event.key === 'Enter') {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `https://api.chess.com/pub/player/${event.target.value}`);
    xhr.responseType = 'json';
    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        data.viewSwap($playerInfo);
        insertAccountInfo(xhr.response);
        insertStats(event.target.value);
        insertClubs(event.target.value);
        event.target.value = '';
      } else {
        $errorMsg.textContent = `Unable to find ${event.target.value}`;
        data.viewSwap($failedSearch);
        event.target.value = '';
      }
    });
    xhr.send();
  }
}

function insertAccountInfo(response) {
  $accountInfoUser.textContent = response.username;
  $accountInfoImg.alt = `${response.username} avatar`;
  const countryCode = response.country.slice(-2).toLowerCase();
  $accountInfoCountry.className = `fi fi-${countryCode}`;
  $accountInfoFollowers.textContent = ` ${response.followers}`;
  $accountInfoJoined.textContent = getJoinedDate(response.joined);

  if (response.name === undefined) {
    $accountInfoName.textContent = 'N/A';
  } else {
    $accountInfoName.textContent = response.name;
  }

  if (response.location === undefined) {
    $accountInfoLocation.textContent = ' N/A';
  } else {
    $accountInfoLocation.textContent = ` ${response.location}`;
  }

  if (response.avatar === undefined) {
    $accountInfoImg.src = '/images/placeholder-image-square.jpg';
  } else {
    $accountInfoImg.src = response.avatar;
  }

  if (response.league === undefined) {
    $accountInfoLeague.textContent = 'No league found.';
    $leagueIcon.src = '';
    $leagueIcon.alt = '';
  } else {
    $accountInfoLeague.textContent = response.league;
    $leagueIcon.src = leagueIcons[response.league];
    $leagueIcon.alt = response.league;
  }
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

function renderStat(type, stats) {
  const game = getGame(type);

  const $tr = document.createElement('tr');
  const $tdIcon = document.createElement('td');
  const $tdMode = document.createElement('td');
  const $tdStat = document.createElement('td');

  const $icon = document.createElement('i');
  const $p1 = document.createElement('p');
  const $p2 = document.createElement('p');
  const $p3 = document.createElement('p');
  const $p4 = document.createElement('p');

  if (game.name === 'Puzzles') {
    $icon.className = game.icon;
    $p1.textContent = game.name;
    $p2.textContent = `Lowest (${stats.lowest.rating})`;
    $p3.textContent = stats.highest.rating;
    $p4.textContent = 'Highest';
  } else if (game.name === 'Puzzle Rush') {
    if (Object.keys(stats).length > 0) {
      $icon.className = game.icon;
      $p1.textContent = game.name;
      $p2.textContent = `Attempts (${stats.best.total_attempts})`;
      $p3.textContent = stats.best.score;
      $p4.textContent = 'Score';
    }
  } else {
    $icon.className = game.icon;
    $p1.textContent = game.name;
    $p2.textContent = stats.last.rating;
    $p3.textContent = getWPCT(stats.record.win, stats.record.loss, stats.record.draw);
    $p4.textContent = 'Win %';
  }

  $tr.appendChild($tdIcon);
  $tr.appendChild($tdMode);
  $tr.appendChild($tdStat);
  $tdIcon.appendChild($icon);
  $tdMode.append($p1, $p2);
  $tdStat.append($p3, $p4);

  return $tr;
}

function insertStats(username) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', `https://api.chess.com/pub/player/${username}/stats`);
  xhr.responseType = 'json';
  xhr.addEventListener('load', function (event) {
    while ($statsTable.firstChild) {
      $statsTable.removeChild($statsTable.firstChild);
    }
    const gameModes = Object.keys(xhr.response);
    gameModes.forEach((key, index) => {
      if (key !== 'fide') {
        const $statBox = renderStat(key, xhr.response[key]);
        $statsTable.appendChild($statBox);
      }
    });
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
  $p2.textContent = getJoinedDate(club.joined);

  $row.append($iconWrapper, $clubDesc);
  $iconWrapper.appendChild($icon);
  $clubDesc.append($p1, $p2);

  return $row;
}

function insertClubs(username) {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', `https://api.chess.com/pub/player/${username}/clubs`);
  xhr.responseType = 'json';
  xhr.addEventListener('load', function (event) {
    while ($clubsTable.firstChild) {
      $clubsTable.removeChild($clubsTable.firstChild);
    }
    const clubs = xhr.response.clubs;
    let maxDisplay = 0;

    if (clubs.length < 1) {
      const $msg = document.createElement('div');
      $msg.className = 'row justify-center';
      const $p = document.createElement('p');
      $p.textContent = 'No clubs found.';
      $msg.appendChild($p);
      $clubsTable.append($msg);
    } else {
      if (clubs.length < 5) {
        maxDisplay = clubs.length;
      } else {
        maxDisplay = 5;
      }

      let count = 0;
      let i = clubs.length - 1;
      while (count < maxDisplay) {
        $clubsTable.appendChild(renderClub(clubs[i]));
        count++;
        i--;
      }
    }
  });
  xhr.send();
}

// function renderMatch(game, username) {
//   const mode = getMode(game.time_class, game.rules);
//   const date = getMatchDate(game.end_time);
//   const white = game.white.username;
//   const black = game.black.username;
//   const whiteRating = game.white.rating;
//   const blackRating = game.black.rating;

//   const result = parsePGN(game.pgn, white, black, username);

//   const $entry = `<div class="match-entry bg-win">
//                     <table id="match-info">
//                       <tbody>
//                         <tr>
//                           <td class="info-cell">
//                             <div class="cell-wrapper">
//                               <div>
//                                 <div>
//                                   <span>${mode}</span>
//                                 </div>
//                                 <div>
//                                   <span class="text-gray">${date}</span>
//                                 </div>
//                               </div>
//                             </div>
//                           </td>
//                           <td class="user-cell">
//                             <div class="cell-wrapper">
//                               <div>
//                                 <div>
//                                   <span>${white} ${whiteRating}</span>
//                                 </div>
//                                 <div>
//                                   <span class="text-black">${black} ${blackRating}</span>
//                                 </div>
//                               </div>
//                             </div>
//                           </td>
//                           <td class="result-cell">
//                             <div class="cell-wrapper">
//                               <div>
//                                 <div>
//                                   <span class="${result.color}">${result.resultStr}</span>
//                                 </div>
//                                 <div>
//                                   <span class="text-gray">${result.moves} moves</span>
//                                 </div>
//                               </div>
//                             </div>
//                           </td>
//                           <td class="link-cell">
//                             <i class="fa-solid fa-link"></i>
//                           </td>
//                         </tr>
//                       </tbody>
//                     </table>
//                   </div>`;
//   return $entry;
// }

function getWPCT(win, loss, draw) {
  const total = win + loss + draw;
  const dec = (2 * win + draw) / (2 * total);
  const pct = Math.trunc(dec * 100);
  return `${pct}%`;
}

function getJoinedDate(timestamp) {
  const date = new Date(timestamp * 1000);
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  return ` Joined ${month} ${year}`;
}

// function getMatchDate(timestamp) {
//   const date = new Date(timestamp * 1000);
//   const month = monthsAbbr[date.getMonth()];
//   const day = date.getDate();
//   const year = date.getFullYear();
//   return `${month} ${day}, ${year}`;
// }

// function getMode(timeClass, rules) {
//   if (rules === 'chess') {
//     return timeClass.charAt(0).toUpperCase() + timeClass.slice(1);
//   } else if (rules === 'chess960') {
//     return 'Daily 960';
//   } else if (rules === 'bughouse') {
//     return 'Bughouse';
//   } else if (rules === 'kingofthechill') {
//     return 'King of the Hill';
//   } else if (rules === 'threecheck') {
//     return '3-Check';
//   } else if (rules === 'crazyhouse') {
//     return 'Crazyhouse';
//   }
// }

// function parsePGN(pgn, white, black, username) {
//   let flag1 = false;
//   let flag2 = false;
//   const flag3 = pgn.includes('{');
//   const moveCount = [];
//   let result = '';
//   let colorStr = '';

//   for (let i = pgn.length - 1; i >= 0; i--) {
//     if (flag2 === true && /[0-9]/.test(pgn[i])) {
//       moveCount.unshift(pgn[i]);
//     }

//     if (pgn[i] === '{') {
//       flag1 = true;
//     }

//     if (flag3 === true) {
//       if (flag1 === true && pgn[i] === '.') {
//         flag2 = true;
//       }
//     } else {
//       if (pgn[i] === '.') {
//         flag2 = true;
//       }
//     }

//     // penultimate character is always a number 0, 1, or 2
//     if (i === pgn.length - 2) {
//       if (pgn[i] === '0') {
//         if (username === white) {
//           result = 'Win';
//           colorStr = 'text-green';
//         } else {
//           result = 'Loss';
//           colorStr = 'text-red';
//         }
//       } else if (pgn[i] === '1') {
//         if (username === black) {
//           result = 'Win';
//           colorStr = 'text-green';
//         } else {
//           result = 'Loss';
//           colorStr = 'text-red';
//         }
//       } else if (pgn[i] === '2') {
//         result = 'Draw';
//         colorStr = 'text-gray';
//       }
//     }
//   }

//   return { resultStr: result, moves: moveCount.join(''), color: colorStr };
// }
