const playerInput = document.querySelector('#input-player');
const teamInput = document.querySelector('#input-team');
const positionInput = document.querySelector('#input-position');
const submitPlayerBtn = document.querySelector('#submit');
const tabs = document.querySelectorAll('.tabs li');
const modal = document.querySelector('#log-game-modal');
const playersTracked = document.querySelector('#players-tracked');
const playerCards = document.querySelector('#player-cards');
const leaderboard = document.querySelector('#leaderboard-view');
const abInput = document.querySelector('#ab-modal-input');
const hitsInput = document.querySelector('#hits-modal-input');
const hrInput = document.querySelector('#hr-modal-input');
const rbiInput = document.querySelector('#rbi-modal-input');
const runsInput = document.querySelector('#runs-modal-input');
const walksInput = document.querySelector('#bb-modal-input');
const submitStatsBtn = document.querySelector('#submit-modal');
const submitPitcherStatsBtn = document.querySelector('#submit-modal-pitcher');
const modalPlayerName = document.querySelector('#modal-player-name');
const hitterStats = document.querySelector('#hitter-stats');
const pitcherStats = document.querySelector('#pitcher-stats');
const ipInput = document.querySelector('#ip-modal-input');
const strikeOutInput = document.querySelector('#k-modal-input');
const pitcherHitsInput = document.querySelector('#pitcher-hits-modal-input');
const pitcherWalksInput = document.querySelector('#pitcher-bb-modal-input');
const errorInput = document.querySelector('#er-modal-input');
const eraInput = document.querySelector('#era-modal-input');
const lbSort = document.querySelector('#lb-sort');
const lbChips = document.querySelectorAll('.lb-chip');
const lbToggleBtns = document.querySelectorAll('.lb-type');
const lbChipsHitter = document.querySelector('.lb-chips-hitter');
const lbChipsPitcher = document.querySelector('.lb-chips-pitcher');
const lbHeadHitter = document.querySelector('.lb-head-hitter');
const lbHeadPitcher = document.querySelector('.lb-head-pitcher');
const playerContainer = document.querySelector('.player-card-container');


let players = [];
let nextId = 1;
let currentPlayerId = null;
let currentPlayerType = 'hitters';




submitPlayerBtn.addEventListener('click', () => createPlayer({
    name: playerInput.value,
    team: teamInput.value,
    position: positionInput.value
}
));

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const tabName = tab.getAttribute('data-tab');

        if (tabName === 'player-cards') {
            playerContainer.style.display = 'grid';
            leaderboard.style.display = 'none'
        } else if (tabName === 'leaderboard') {
            leaderboard.style.display = 'block';
            playerContainer.style.display = 'none';
            renderLeaderboard();
        }
    })
});

submitStatsBtn.addEventListener('click', logModal);
submitPitcherStatsBtn.addEventListener('click', logModal);

lbToggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        lbToggleBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const btnName = btn.getAttribute('data-type');


        if (btnName === 'hitters') {
            currentPlayerType = btnName;
            lbChipsHitter.style.display = 'flex';
            lbChipsPitcher.style.display = 'none';
            lbHeadHitter.style.display = 'grid';
            lbHeadPitcher.style.display = 'none';
            renderLeaderboard('HR', 'hitters');
        } else {
            currentPlayerType = btnName;
            lbChipsPitcher.style.display = 'flex';
            lbChipsHitter.style.display = 'none';
            lbHeadPitcher.style.display = 'grid';
            lbHeadHitter.style.display = 'none';
            renderLeaderboard('K', 'pitchers');
        }
    });
});

lbChips.forEach(chip => {
    chip.addEventListener('click', () => {
        lbChips.forEach(c => c.classList.remove('active'));
        chip.classList.add('active');
        renderLeaderboard(chip.getAttribute('data-sort'), currentPlayerType);
    });
});

function createPlayer({ name, team, position }) {

    const isPitcher = checkIsPitcher(position);


    const player = {
        id: nextId++,
        name,
        team,
        position,
        stats: isPitcher ?
            { IP: 0, K: 0, H: 0, E: 0, BB: 0, ERA: [] } :
            { AB: 0, H: 0, HR: 0, RBI: 0, R: 0, BB: 0 }
    };


    players.push(player);
    playerInput.value = '';
    teamInput.value = '';
    positionInput.value = '';

    savePlayers();
    renderPlayers();
}

function renderPlayers() {
    playerCards.innerHTML = '';

    players.forEach(player => {

        playersTracked.textContent = `${players.length} player${players.length >= 2 ? 's' : ''} tracked`;

        const card = document.createElement('div');
        card.classList.add('card-styles', 'p-3', 'player-grid');
        card.classList.add('card');

        const infoContainer = document.createElement('div');
        infoContainer.classList.add('card-styles', 'text-positioning', 'flex');

        const playerName = document.createElement('h3');
        playerName.textContent = player.name;

        const teamName = document.createElement('p');
        teamName.textContent = player.team;

        const positionElement = document.createElement('p');
        positionElement.textContent = player.position;

        card.appendChild(playerName);
        infoContainer.appendChild(teamName);
        infoContainer.appendChild(positionElement);

        const hr = document.createElement('hr');

        const statCount = document.createElement('div');
        statCount.classList.add('stat-count', 'flex');


        const logGameBtn = document.createElement('button');
        logGameBtn.classList.add('log-game-btn');
        logGameBtn.textContent = 'Log Game';

        logGameBtn.addEventListener('click', () => {
            currentPlayerId = player.id;
            const currentPlayer = players.find(p => p.id === currentPlayerId);

            if (checkIsPitcher(player.position)) {
                pitcherStats.classList.add('show');
                hitterStats.classList.remove('show');
            } else {
                hitterStats.classList.add('show');
                pitcherStats.classList.remove('show');
            }

            modalPlayerName.textContent = currentPlayer.name;
            modal.showModal();
        });

        const deleteBtn = document.createElement('button');
        deleteBtn.classList.add('delete-btn');
        deleteBtn.setAttribute('aria-label', 'Remove player');
        deleteBtn.textContent = '×';

        deleteBtn.addEventListener('click', () => deletePlayer(player.id));

        const isPitcher = checkIsPitcher(player.position);



        if (isPitcher) {
            const avgEra = player.stats.ERA.length > 0
                ? (player.stats.ERA.reduce((sum, val) => sum + val, 0) / player.stats.ERA.length).toFixed(2)
                : 0;

            statCount.appendChild(createStat(player.stats.IP, 'IP'));
            statCount.appendChild(createStat(player.stats.K, 'K'));
            statCount.appendChild(createStat(player.stats.H, 'H'));
            statCount.appendChild(createStat(player.stats.E, 'E'));
            statCount.appendChild(createStat(player.stats.BB, 'BB'));
            statCount.appendChild(createStat(avgEra, 'ERA'));
        } else {
            statCount.appendChild(createStat(player.stats.AB, 'AB'));
            statCount.appendChild(createStat(player.stats.H, 'H'));
            statCount.appendChild(createStat(player.stats.HR, 'HR'));
            statCount.appendChild(createStat(player.stats.RBI, 'RBI'));
            statCount.appendChild(createStat(player.stats.R, 'R'));
            statCount.appendChild(createStat(player.stats.BB, 'BB'));
        }

        card.appendChild(infoContainer);
        card.appendChild(hr);
        card.appendChild(statCount);
        card.appendChild(logGameBtn);
        card.appendChild(deleteBtn);


        playerCards.appendChild(card);
    });
};

function createStat(statAmount, statLabel) {

    const statPositioning = document.createElement('div');
    statPositioning.classList.add('stat-positioning');

    const statNum = document.createElement('p');
    statNum.textContent = statAmount;


    const statName = document.createElement('p');
    statName.textContent = statLabel;

    statPositioning.appendChild(statNum);
    statPositioning.appendChild(statName);

    return statPositioning;
}

function checkIsPitcher(position) {
    return ['P', 'SP', 'RP', 'Pitcher', 'CP'].includes(position.toUpperCase());
}

function logModal() {
    const player = players.find(p => p.id === currentPlayerId);


    if (checkIsPitcher(player.position)) {
        const ip = ipInput.value;
        const strikeouts = strikeOutInput.value;
        const pitcherHits = pitcherHitsInput.value;
        const pitcherWalks = pitcherWalksInput.value;
        const error = errorInput.value;
        const era = eraInput.value;


        players = players.map(p => {
            if (p.id === currentPlayerId) {
                return {
                    ...p, stats: {
                        ...p.stats, IP: p.stats.IP + Number(ip),
                        K: p.stats.K + Number(strikeouts),
                        H: p.stats.H + Number(pitcherHits),
                        E: p.stats.E + Number(error),
                        BB: p.stats.BB + Number(pitcherWalks),
                        ERA: [...p.stats.ERA, Number(era)]
                    }
                }
            }
            return p;
        })
    } else {
        const ab = abInput.value;
        const hits = hitsInput.value;
        const hr = hrInput.value;
        const rbi = rbiInput.value;
        const runs = runsInput.value;
        const walks = walksInput.value;

        players = players.map(p => {
            if (p.id === currentPlayerId) {
                return {
                    ...p, stats: {
                        ...p.stats, HR: p.stats.HR + Number(hr), AB: p.stats.AB + Number(ab),
                        H: p.stats.H + Number(hits),
                        RBI: p.stats.RBI + Number(rbi),
                        R: p.stats.R + Number(runs),
                        BB: p.stats.BB + Number(walks)
                    }
                }
            }
            return p;
        });
    }

    checkIsPitcher(player.position);
    savePlayers();
    renderLeaderboard();
    renderPlayers();
    modal.close();

    abInput.value = '';
    hitsInput.value = '';
    hrInput.value = '';
    rbiInput.value = '';
    runsInput.value = '';
    walksInput.value = '';

    ipInput.value = '';
    strikeOutInput.value = '';
    pitcherHitsInput.value = '';
    pitcherWalksInput.value = '';
    errorInput.value = '';
    eraInput.value = '';
}

function renderLeaderboard(sortBy = 'HR', playerType = 'hitters') {
    const leaderboardContainer = document.querySelector
        ('#leaderboard-container');

    const hitters = players.filter(player => !checkIsPitcher(player.position));
    const pitchers = players.filter(player => checkIsPitcher(player.position));
    const group = playerType === 'hitters' ? hitters : pitchers;
    const sorted = [...group].sort((b, a) => (a.stats[sortBy] ?? 0) - (b.stats[sortBy] ?? 0));
    console.log('sortBy:', sortBy, 'playerType:', playerType, 'group:', group);

    leaderboardContainer.innerHTML = '';

    sorted.forEach((hitter, index) => {

        const lbRow = document.createElement('div');
        const lbRank = document.createElement('span');
        const lbPlayer = document.createElement('span');
        const lbHr = document.createElement('span');
        const lbHits = document.createElement('span');
        const lbRbi = document.createElement('span');
        const lbRuns = document.createElement('span');

        if (playerType === 'hitters') {
            lbRow.classList.add('lb-row');


            lbRank.classList.add('lb-rank');
            lbRank.textContent = index + 1;


            lbPlayer.classList.add('lb-player');
            lbPlayer.textContent = hitter.name;


            lbHr.classList.add('lb-stat');
            lbHr.textContent = hitter.stats.HR;


            lbHits.classList.add('lb-stat');
            lbHits.textContent = hitter.stats.H;



            lbRbi.classList.add('lb-stat');
            lbRbi.textContent = hitter.stats.RBI;


            lbRuns.classList.add('lb-stat');
            lbRuns.textContent = hitter.stats.R;
        } else {
            lbRow.classList.add('lb-row');


            lbRank.classList.add('lb-rank');
            lbRank.textContent = index + 1;


            lbPlayer.classList.add('lb-player');
            lbPlayer.textContent = hitter.name;


            lbHr.classList.add('lb-stat');
            lbHr.textContent = hitter.stats.K;


            lbHits.classList.add('lb-stat');
            lbHits.textContent = hitter.stats.IP;



            lbRbi.classList.add('lb-stat');
            lbRbi.textContent = hitter.stats.BB;


            lbRuns.classList.add('lb-stat');
            lbRuns.textContent = hitter.stats.ERA;
        }

        lbRow.appendChild(lbRank);
        lbRow.appendChild(lbPlayer);
        lbRow.appendChild(lbHr);
        lbRow.appendChild(lbHits);
        lbRow.appendChild(lbRbi);
        lbRow.appendChild(lbRuns);
        leaderboardContainer.appendChild(lbRow);

    });

}

function savePlayers() {
    localStorage.setItem('players', JSON.stringify(players));
}

function loadPlayers() {
    const storedPlayers = localStorage.getItem('players');

    if (storedPlayers) {
        players = JSON.parse(storedPlayers);
        nextId = Math.max(...players.map(p => p.id) + 1);
    }

    renderPlayers();
}

function deletePlayer(id) {
    players = players.filter(player => player.id !== id);
    savePlayers();
    renderPlayers();
}

window.addEventListener('DOMContentLoaded', () => {
    loadPlayers();
});

