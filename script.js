// Datos de las recompensas incluidos directamente para facilitar el despliegue
// y evitar problemas de carga (CORS) en entornos locales o simples.
const rewardsData = [
    { "name": "Koga", "language": "Inglés", "cost": 50000, "image": "https://assets.pokemon-zone.com/game-assets/CardPreviews/cTR_20_000140_00_KYOU_SR.webp", "quantity": 1 },
    { "name": "Fantina", "language": "Inglés", "cost": 50000, "image": "https://assets.pokemon-zone.com/game-assets/CardPreviews/cTR_20_000980_00_MELISSA_SR.webp", "quantity": 4 },
    { "name": "Barry", "language": "Inglés", "cost": 50000, "image": "https://assets.pokemon-zone.com/game-assets/CardPreviews/cTR_20_000400_00_JUN_SR.webp", "quantity": 1 },
    { "name": "Mega Altaria Ex", "language": "Inglés", "cost": 30000, "image": "https://assets.pokemon-zone.com/game-assets/CardPreviews/cPK_20_011840_00_MEGATYLTALISex_SR.webp", "quantity": 3 },
    { "name": "Pikachu Ex Arcoiris", "language": "Chino", "cost": 50000, "image": "https://assets.pokemon-zone.com/game-assets/CardPreviews/cPK_20_005410_01_PIKACHUex_SAR.webp", "quantity": 1 },
    { "name": "Mega Blastoise Ex", "language": "Chino", "cost": 50000, "image": "https://assets.pokemon-zone.com/game-assets/CardPreviews/cPK_20_013250_01_MEGAKAMEXex_SAR.webp", "quantity": 1 },
    { "name": "Lucario Ex", "language": "Español", "cost": 30000, "image": "https://assets.pokemon-zone.com/game-assets/CardPreviews/cPK_20_005580_00_LUCARIOex_SR.webp", "quantity": 1 },
    { "name": "Alolan Muk Ex Arcoiris", "language": "Chino", "cost": 50000, "image": "https://assets.pokemon-zone.com/game-assets/CardPreviews/cPK_20_006920_01_ALOLABETBETONex_SAR.webp", "quantity": 1 },
    { "name": "Melmetal Ex Arcoiris", "language": "Chino", "cost": 50000, "image": "https://assets.pokemon-zone.com/game-assets/CardPreviews/cPK_20_012560_01_MELMETALex_SAR.webp", "quantity": 1 },
    { "name": "Taurus EX Arcoiris", "language": "Inglés", "cost": 50000, "image": "https://assets.pokemon-zone.com/game-assets/CardPreviews/cPK_20_012650_01_KENTAUROSex_SAR.webp", "quantity": 1 }
];

function loadRewards() {
    renderRewards(rewardsData);
}

function renderRewards(rewards) {
    const container = document.getElementById('rewards-container');
    if (!container) return;

    container.innerHTML = ''; // Limpiar mensaje de carga

    rewards.forEach(reward => {
        const card = document.createElement('div');
        card.className = 'reward-card';

        const statusClass = reward.quantity < 5 ? 'status-limited' : 'status-available';
        const statusText = reward.quantity < 5 ? '¡Casi agotado!' : 'Disponible';

        card.innerHTML = `
            <div class="reward-image-container">
                <img src="${reward.image}" alt="${reward.name}" class="reward-image">
                <div class="card-language">${reward.language}</div>
            </div>
            <div class="reward-info">
                <h2 class="reward-name" title="${reward.name}">${reward.name}</h2>
                <div class="reward-cost">
                    <i class="fas fa-coins"></i>
                    <span>${reward.cost.toLocaleString()} Puntos</span>
                </div>
                <div class="reward-footer">
                    <span class="reward-quantity">${reward.quantity} rest.</span>
                    <span class="status-badge ${statusClass}">${statusText}</span>
                </div>
            </div>
        `;

        container.appendChild(card);
    });
}

function initTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');

            // Actualizar botones
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Actualizar contenido
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === `${targetTab}-section`) {
                    content.classList.add('active');
                }
            });
        });
    });
}

function initTournament() {
    const setupBtn = document.getElementById('setup-players');
    const generateBtn = document.getElementById('generate-tournament');
    const resetBtn = document.getElementById('reset-tournament');
    const playerCountInput = document.getElementById('player-count');
    const playerNamesContainer = document.getElementById('player-names-container');
    const playerInputsGrid = document.getElementById('player-inputs');

    if (!setupBtn) return;

    // Cargar torneo guardado si existe
    const savedTournament = loadTournament();
    if (savedTournament) {
        restoreTournament(savedTournament);
    }

    setupBtn.addEventListener('click', () => {
        const count = parseInt(playerCountInput.value);
        if (count < 2) return alert('Mínimo 2 jugadores');

        playerInputsGrid.innerHTML = '';
        for (let i = 0; i < count; i++) {
            const div = document.createElement('div');
            div.className = 'player-input-item';
            div.innerHTML = `
                <span>${i + 1}</span>
                <input type="text" placeholder="Nombre Jugador ${i + 1}" class="player-name-input">
            `;
            playerInputsGrid.appendChild(div);
        }

        playerNamesContainer.style.display = 'block';
        setupBtn.style.display = 'none';
        generateBtn.style.display = 'inline-flex';
        resetBtn.style.display = 'inline-flex';
    });

    generateBtn.addEventListener('click', () => {
        const playerCount = parseInt(playerCountInput.value);
        const matchFormat = document.getElementById('match-format').value;
        const tournamentType = document.getElementById('tournament-type').value;
        const display = document.getElementById('tournament-display');

        const playerInputs = document.querySelectorAll('.player-name-input');
        const players = Array.from(playerInputs).map((input, i) => input.value.trim() || `Jugador ${i + 1}`);

        const tournamentData = {
            playerCount,
            matchFormat,
            tournamentType,
            players,
            status: 'active'
        };

        saveTournament(tournamentData);
        renderTournament(tournamentData, display);

        // Ocultar configuración tras iniciar
        playerNamesContainer.style.display = 'none';
        generateBtn.style.display = 'none';
    });

    resetBtn.addEventListener('click', () => {
        if (confirm('¿Estás seguro de que quieres borrar el torneo actual?')) {
            localStorage.removeItem('currentTournament');
            location.reload();
        }
    });
}

function saveTournament(data) {
    localStorage.setItem('currentTournament', JSON.stringify(data));
}

function loadTournament() {
    const data = localStorage.getItem('currentTournament');
    return data ? JSON.parse(data) : null;
}

function restoreTournament(data) {
    const display = document.getElementById('tournament-display');
    const setupBtn = document.getElementById('setup-players');
    const resetBtn = document.getElementById('reset-tournament');
    const playerCountInput = document.getElementById('player-count');
    const matchFormatInput = document.getElementById('match-format');
    const typeInput = document.getElementById('tournament-type');

    // Restaurar valores del formulario
    playerCountInput.value = data.playerCount;
    matchFormatInput.value = data.matchFormat;
    typeInput.value = data.tournamentType;

    setupBtn.style.display = 'none';
    resetBtn.style.display = 'inline-flex';

    renderTournament(data, display);
}

function renderTournament(data, container) {
    container.innerHTML = '';

    let resolvedType = data.tournamentType;
    if (data.tournamentType === 'auto') {
        resolvedType = data.playerCount > 8 ? 'swiss' : 'brackets';
    }

    const header = document.createElement('div');
    header.style.width = '100%';
    header.innerHTML = `
        <h3 style="margin-bottom: 1rem; color: var(--twitch-light-purple)">
            Torneo ${resolvedType.toUpperCase()} - ${data.matchFormat.toUpperCase()} (${data.playerCount} jugadores)
        </h3>
    `;
    container.appendChild(header);

    if (resolvedType === 'swiss') {
        renderSwissTable(data.players, container);
    } else if (resolvedType === 'brackets') {
        renderBrackets(data.players, container);
    }
}

function renderSwissTable(playerNames, container) {
    const table = document.createElement('div');
    table.style.width = '100%';
    table.innerHTML = `
        <table style="width: 100%; border-collapse: collapse; margin-top: 1rem; color: var(--text-primary)">
            <thead>
                <tr style="border-bottom: 2px solid var(--border-color); text-align: left;">
                    <th style="padding: 10px;">Pos</th>
                    <th style="padding: 10px;">Jugador</th>
                    <th style="padding: 10px;">Puntos</th>
                    <th style="padding: 10px;">BUCH</th>
                </tr>
            </thead>
            <tbody>
                ${playerNames.map((name, i) => `
                    <tr style="border-bottom: 1px solid var(--border-color);">
                        <td style="padding: 10px;">${i + 1}</td>
                        <td style="padding: 10px;">${name}</td>
                        <td style="padding: 10px;">0</td>
                        <td style="padding: 10px;">0</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
        <div style="margin-top: 1.5rem; text-align: center;">
            <button class="btn-primary" onclick="alert('Funcionalidad de ronda en desarrollo')">Sortear Ronda 1</button>
        </div>
    `;
    container.appendChild(table);
}

function renderBrackets(playerNames, container) {
    const numPlayers = playerNames.length;
    const rounds = Math.ceil(Math.log2(numPlayers));
    const bracketContainer = document.createElement('div');
    bracketContainer.style.display = 'flex';
    bracketContainer.style.gap = '2rem';
    bracketContainer.style.overflowX = 'auto';
    bracketContainer.style.padding = '1rem';
    bracketContainer.style.width = '100%';

    for (let r = 0; r < rounds; r++) {
        const roundMatches = Math.pow(2, rounds - r - 1);
        const roundCol = document.createElement('div');
        roundCol.className = 'round-col';
        roundCol.innerHTML = `<h4 style="text-align: center; margin-bottom: 1rem; color: var(--text-secondary)">Ronda ${r + 1}</h4>`;

        for (let m = 0; m < roundMatches; m++) {
            const player1 = playerNames[m * 2] || 'BYE';
            const player2 = playerNames[m * 2 + 1] || 'BYE';

            const match = document.createElement('div');
            match.style.cssText = `
                background: var(--card-bg);
                border: 1px solid var(--border-color);
                border-radius: 4px;
                padding: 0.5rem;
                margin-bottom: 1rem;
                min-width: 180px;
                display: flex;
                flex-direction: column;
                gap: 5px;
            `;
            match.innerHTML = `
                <div style="font-size: 0.85rem; border-bottom: 1px solid var(--border-color); padding-bottom: 4px; display: flex; justify-content: space-between;">
                    <span>${player1}</span>
                    <span style="color: var(--text-secondary)">0</span>
                </div>
                <div style="font-size: 0.85rem; display: flex; justify-content: space-between;">
                    <span>${player2}</span>
                    <span style="color: var(--text-secondary)">0</span>
                </div>
            `;
            roundCol.appendChild(match);
        }
        bracketContainer.appendChild(roundCol);

        // Para rondas posteriores, los nombres se limpian (TBD)
        if (r === 0) playerNames = [];
    }
    container.appendChild(bracketContainer);
}

// Asegurarse de que el DOM esté cargado antes de ejecutar
document.addEventListener('DOMContentLoaded', () => {
    loadRewards();
    initTabs();
    initTournament();
});
