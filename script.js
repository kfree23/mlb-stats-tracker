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

    const player = {
        id: nextId++,
        name,
        team,
        position
    };

    players.push(player);

    const card = document.createElement('div');
    card.classList.add('card-styles', 'p-3', 'player-grid');
    card.classList.add('card');

    const infoContainer = document.createElement('div');
    infoContainer.classList.add('card-styles', 'text-positioning', 'flex');

    const playerName = document.createElement('h3');
    playerName.textContent = name;

    const teamName = document.createElement('p');
    teamName.textContent = team;

    const positionElement = document.createElement('p');
    positionElement.textContent = position;

    card.appendChild(playerName);
    infoContainer.appendChild(teamName);
    infoContainer.appendChild(positionElement);

    const hr = document.createElement('hr');

    const statCount = document.createElement('div');
    statCount.classList.add('stat-count', 'flex');

    const statPositioning = document.createElement('div');
    statPositioning.classList.add('stat-positioning');

    const statNum = document.createElement('p');
    statNum.textContent = 0;

    const statName = document.createElement('p');
    statName.textContent = "HR";

    statPositioning.appendChild(statNum);
    statPositioning.appendChild(statName);
    statCount.appendChild(statPositioning);

    card.appendChild(infoContainer);
    card.appendChild(hr);
    card.appendChild(statCount);
    

    playerCards.appendChild(card);
}