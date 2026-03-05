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

    // Detectar Campeón
    let champion = null;
    if (resolvedType === 'brackets' && data.brackets) {
        const finalRound = data.brackets[data.brackets.length - 1];
        if (finalRound && finalRound[0] && finalRound[0].winner && finalRound[0].winner !== 'TBD') {
            champion = finalRound[0].winner;
        }
    } else if (resolvedType === 'swiss' && data.swissData) {
        // En Suizo, el campeón es el que tiene más puntos al final (simplificando)
        // Podríamos añadir una condición de "Torneo Finalizado"
        const sorted = [...data.swissData].sort((a, b) => b.points - a.points);
        if (sorted[0] && sorted[0].points > 0) {
            // Mostramos el posible campeón si hay puntos
            champion = sorted[0].name;
            container.innerHTML += `<p style="text-align:center; color: var(--text-secondary); margin-bottom: 1rem;">Líder actual: ${champion}</p>`;
        }
    }

    if (champion && (resolvedType === 'brackets' || (resolvedType === 'swiss' && data.isFinished))) {
        const banner = document.createElement('div');
        banner.className = 'champion-banner';
        banner.innerHTML = `
            <i class="fas fa-crown"></i>
            <h2>¡CAMPEÓN!</h2>
            <div class="champion-name">${champion}</div>
            <p>Felicidades por la victoria en el torneo</p>
        `;
        container.appendChild(banner);
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
        renderSwissTable(data, container);
    } else if (resolvedType === 'brackets') {
        renderBrackets(data, container);
    }
}

function renderSwissTable(data, container) {
    const tableContainer = document.createElement('div');
    tableContainer.style.width = '100%';

    // Si no hay datos de rondas/puntuación en el objeto data, inicializarlos
    if (!data.swissData) {
        data.swissData = data.players.map(name => ({ name, points: 0, buch: 0, wins: 0, losses: 0 }));
    }

    // Ordenar por puntos (descendente)
    const sortedPlayers = [...data.swissData].sort((a, b) => b.points - a.points || b.buch - a.buch);

    tableContainer.innerHTML = `
        <table style="width: 100%; border-collapse: collapse; margin-top: 1rem; color: var(--text-primary)">
            <thead>
                <tr style="border-bottom: 2px solid var(--border-color); text-align: left;">
                    <th style="padding: 10px;">Pos</th>
                    <th style="padding: 10px;">Jugador</th>
                    <th style="padding: 10px; text-align: center;">Puntos</th>
                    <th style="padding: 10px; text-align: center;">V - D</th>
                </tr>
            </thead>
            <tbody>
                ${sortedPlayers.map((p, i) => `
                    <tr style="border-bottom: 1px solid var(--border-color);">
                        <td style="padding: 10px;">${i + 1}</td>
                        <td style="padding: 10px;">${p.name}</td>
                        <td style="padding: 10px; text-align: center;">
                            <input type="number" class="score-input" value="${p.points}" 
                                onchange="updateSwissStats('${p.name}', 'points', this.value)">
                        </td>
                        <td style="padding: 10px; text-align: center;">
                            <span style="color: #00FF7F">${p.wins}</span> - <span style="color: #ff4e4e">${p.losses}</span>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
        <div style="margin-top: 1.5rem; text-align: center; display: flex; gap: 1rem; justify-content: center;">
            <button class="btn-secondary" onclick="updateSwissWins()">Actualizar Victorias</button>
            <button class="btn-primary" 
                style="background-color: var(--accent-color); color: #000;"
                onclick="finishSwiss()">Finalizar Torneo</button>
        </div>
    `;
    container.appendChild(tableContainer);
}

window.finishSwiss = function () {
    if (confirm('¿Quieres finalizar el torneo y declarar al campeón?')) {
        const data = loadTournament();
        data.isFinished = true;
        saveTournament(data);
        renderTournament(data, document.getElementById('tournament-display'));
    }
};

function renderBrackets(data, container) {
    const numPlayers = data.players.length;
    const rounds = Math.ceil(Math.log2(numPlayers));

    // Inicializar matriz de brackets si no existe
    if (!data.brackets) {
        data.brackets = [];
        for (let r = 0; r < rounds; r++) {
            const roundMatches = Math.pow(2, rounds - r - 1);
            const matches = [];
            for (let m = 0; m < roundMatches; m++) {
                matches.push({
                    p1: r === 0 ? (data.players[m * 2] || 'BYE') : 'TBD',
                    p2: r === 0 ? (data.players[m * 2 + 1] || 'BYE') : 'TBD',
                    s1: 0,
                    s2: 0,
                    winner: null
                });
            }
            data.brackets.push(matches);
        }
        saveTournament(data);
    }

    const bracketContainer = document.createElement('div');
    bracketContainer.style.display = 'flex';
    bracketContainer.style.gap = '2rem';
    bracketContainer.style.overflowX = 'auto';
    bracketContainer.style.padding = '1rem';
    bracketContainer.style.width = '100%';

    data.brackets.forEach((roundMatches, r) => {
        const roundCol = document.createElement('div');
        roundCol.className = 'round-col';
        roundCol.innerHTML = `<h4 style="text-align: center; margin-bottom: 1rem; color: var(--text-secondary)">Ronda ${r + 1}</h4>`;

        roundMatches.forEach((match, m) => {
            const matchDiv = document.createElement('div');
            matchDiv.className = 'match-item';

            matchDiv.innerHTML = `
                <div class="match-player ${match.winner === match.p1 ? 'winner' : ''}">
                    <span>${match.p1}</span>
                    <input type="number" class="score-input" value="${match.s1}" 
                        onchange="updateMatchScore(${r}, ${m}, 's1', this.value)" 
                        ${match.p1 === 'BYE' || match.p1 === 'TBD' ? 'disabled' : ''}>
                </div>
                <div class="match-player ${match.winner === match.p2 ? 'winner' : ''}">
                    <span>${match.p2}</span>
                    <input type="number" class="score-input" value="${match.s2}" 
                        onchange="updateMatchScore(${r}, ${m}, 's2', this.value)"
                        ${match.p2 === 'BYE' || match.p2 === 'TBD' ? 'disabled' : ''}>
                </div>
            `;
            roundCol.appendChild(matchDiv);
        });
        bracketContainer.appendChild(roundCol);
    });
    container.appendChild(bracketContainer);
}

// Funciones globales para manejar eventos onchange desde el HTML generado
window.updateMatchScore = function (round, matchIdx, field, value) {
    const data = loadTournament();
    if (!data || !data.brackets) return;

    const match = data.brackets[round][matchIdx];
    match[field] = parseInt(value) || 0;

    // Determinar ganador
    if (match.s1 > match.s2) match.winner = match.p1;
    else if (match.s2 > match.s1) match.winner = match.p2;
    else match.winner = null;

    // Progresar ganador si no es la última ronda
    if (data.brackets[round + 1]) {
        const nextMatchIdx = Math.floor(matchIdx / 2);
        const nextPlayerField = matchIdx % 2 === 0 ? 'p1' : 'p2';
        data.brackets[round + 1][nextMatchIdx][nextPlayerField] = match.winner || 'TBD';
    }

    saveTournament(data);
    renderTournament(data, document.getElementById('tournament-display'));
};

window.updateSwissStats = function (playerName, field, value) {
    const data = loadTournament();
    if (!data || !data.swissData) return;

    const player = data.swissData.find(p => p.name === playerName);
    if (player) {
        player[field] = parseFloat(value) || 0;
        saveTournament(data);
        // No re-renderizamos inmediatamente para no perder el foco del input
    }
};

window.updateSwissWins = function () {
    // Esta función podría calcular victorias automáticamente basado en rondas (si se implementaran los emparejamientos)
    // Por ahora re-renderiza para aplicar ordenamiento por puntos
    const data = loadTournament();
    renderTournament(data, document.getElementById('tournament-display'));
};

// Asegurarse de que el DOM esté cargado antes de ejecutar
document.addEventListener('DOMContentLoaded', () => {
    loadRewards();
    initTabs();
    initTournament();
});
