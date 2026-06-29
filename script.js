const playerInput = document.querySelector('#input-player');
const teamInput = document.querySelector('#input-team');
const positionInput = document.querySelector('#input-position');
const submitPlayerBtn = document.querySelector('#submit');
const tabs = document.querySelectorAll('.tabs li');
const modal = document.querySelector('#log-game-modal');
const playersTracked = document.querySelector('#players-tracked');
const playerCards = document.querySelector('#player-cards');
const leaderboard = document.querySelector('#leaderboard-container');

let players = [];
let nextId = 1;


console.log(playerCards)

submitPlayerBtn.addEventListener('click', () => createPlayer({
    name: playerInput.value,
    team: teamInput.value,
    position: positionInput.value
}
));

function createPlayer({ name, team, position }) {

    const isPitcher = checkIsPitcher(position);


    const player = {
        id: nextId++,
        name,
        team,
        position,
        stats: isPitcher ?
            { IP: 0, K: 0, H: 0, ER: 0, BB: 0, K9: 0 } :
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
            modal.showModal();
        });

        const isPitcher = checkIsPitcher(player.position);

        if (isPitcher) {
            statCount.appendChild(createStat(player.stats.IP, 'IP'));
            statCount.appendChild(createStat(player.stats.K, 'K'));
            statCount.appendChild(createStat(player.stats.H, 'H'));
            statCount.appendChild(createStat(player.stats.ER, 'ER'));
            statCount.appendChild(createStat(player.stats.BB, 'BB'));
            statCount.appendChild(createStat(player.stats.K9, 'K9'));
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
    return ['P', 'SP', 'RP', 'Pitcher', 'CP'].includes(player.position.toUpperCase());
}

function savePlayers() {
    localStorage.setItem('players', JSON.stringify(players));
}

function loadPlayers() {
    const storedPlayers = localStorage.getItem('players');

    if (storedPlayers) {
        players = JSON.parse(storedPlayers);
    }

    renderPlayers();
}

window.addEventListener('DOMContentLoaded', () => {
    loadPlayers();
});

