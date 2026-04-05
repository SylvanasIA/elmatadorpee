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
    // Inicializar swissData si no existe
    if (!data.swissData) {
        data.swissData = data.players.map(name => ({
            name,
            points: 0,
            wins: 0,
            losses: 0,
            ties: 0
        }));
    }

    // Inicializar rondas si no existen
    if (!data.swissRounds) {
        data.swissRounds = [];
        generateSwissRound(data);
    }

    // Inicializar pestaña activa (por defecto la última ronda)
    if (data.activeSwissTab === undefined) {
        data.activeSwissTab = data.swissRounds.length - 1;
    }

    const mainContainer = document.createElement('div');
    mainContainer.className = 'swiss-container';

    // 1. Navegación de Pestañas
    const nav = document.createElement('div');
    nav.className = 'swiss-nav';
    
    // Botones de Rondas
    data.swissRounds.forEach((_, rIdx) => {
        const btn = document.createElement('button');
        btn.className = `swiss-tab-btn ${data.activeSwissTab === rIdx ? 'active' : ''}`;
        btn.innerHTML = `<i class="fas fa-layer-group"></i> Ronda ${rIdx + 1}`;
        btn.onclick = () => switchSwissTab(rIdx);
        nav.appendChild(btn);
    });

    // Botón de Clasificación
    const lbBtn = document.createElement('button');
    lbBtn.className = `swiss-tab-btn tab-leaderboard ${data.activeSwissTab === 'leaderboard' ? 'active' : ''}`;
    lbBtn.innerHTML = `<i class="fas fa-list-ol"></i> Clasificación`;
    lbBtn.onclick = () => switchSwissTab('leaderboard');
    nav.appendChild(lbBtn);

    mainContainer.appendChild(nav);

    // 2. Contenido de la Pestaña
    const content = document.createElement('div');
    content.className = 'swiss-tab-content';

    if (data.activeSwissTab === 'leaderboard') {
        // Renderizar Tabla de Clasificación
        calculateSwissStats(data);
        const sortedPlayers = [...data.swissData].sort((a, b) => b.points - a.points || b.wins - a.wins);

        const leaderboardDiv = document.createElement('div');
        leaderboardDiv.className = 'leaderboard-container';
        leaderboardDiv.style.marginTop = '0'; // Sin margen extra en pestaña
        leaderboardDiv.innerHTML = `
            <table class="leaderboard-table">
                <thead>
                    <tr>
                        <th>Pos</th>
                        <th>Jugador</th>
                        <th style="text-align: center;">Puntos</th>
                        <th style="text-align: center;">V - E - D</th>
                    </tr>
                </thead>
                <tbody>
                    ${sortedPlayers.map((p, i) => `
                        <tr class="${i === 0 ? 'is-first' : ''}">
                            <td style="font-weight: 800; opacity: 0.5;">#${i + 1}</td>
                            <td style="font-weight: 700;">${p.name}</td>
                            <td style="text-align: center; color: var(--accent-color); font-weight: 800; font-size: 1.1rem;">${p.points}</td>
                            <td style="text-align: center; font-size: 0.85rem; font-weight: 600;">
                                <span style="color: var(--success)">${p.wins}</span> - 
                                <span style="color: var(--warning)">${p.ties}</span> - 
                                <span style="color: var(--danger)">${p.losses}</span>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
        content.appendChild(leaderboardDiv);
    } else {
        // Renderizar Ronda Específica
        const rIdx = data.activeSwissTab;
        const round = data.swissRounds[rIdx];
        if (round) {
            const roundDiv = document.createElement('div');
            roundDiv.className = 'swiss-round';
            
            const isLatestRound = rIdx === data.swissRounds.length - 1;
            
            roundDiv.innerHTML = `
                <h4>
                    <span>Partidas de la Ronda ${rIdx + 1}</span>
                    ${isLatestRound && !data.isFinished ? '<span class="actual-badge">Ronda actual</span>' : ''}
                </h4>
                <div class="swiss-matches-grid">
                    ${round.matches.map((m, mIdx) => renderSwissMatch(m, rIdx, mIdx, data.isFinished)).join('')}
                </div>
            `;
            content.appendChild(roundDiv);

            // Botones de acción solo en la última ronda si no está terminado
            if (isLatestRound && !data.isFinished) {
                const actionsDiv = document.createElement('div');
                actionsDiv.style.marginTop = '2rem';
                actionsDiv.style.textAlign = 'center';
                actionsDiv.style.display = 'flex';
                actionsDiv.style.gap = '1rem';
                actionsDiv.style.justifyContent = 'center';

                actionsDiv.innerHTML = `
                    <button class="btn-secondary" onclick="addNewSwissRound()">
                        <i class="fas fa-plus"></i> Generar Siguiente Ronda
                    </button>
                    <button class="btn-primary" onclick="finishSwiss()" style="background-color: var(--accent-color); color: #000;">
                        <i class="fas fa-flag-checkered"></i> Finalizar Torneo
                    </button>
                `;
                content.appendChild(actionsDiv);
            }
        }
    }

    mainContainer.appendChild(content);
    container.appendChild(mainContainer);
}

window.switchSwissTab = function(tabIndex) {
    const data = loadTournament();
    if (!data) return;
    data.activeSwissTab = tabIndex;
    saveTournament(data);
    renderTournament(data, document.getElementById('tournament-display'));
};

function renderSwissMatch(match, rIdx, mIdx, isFinished) {
    const p1Win = match.result === 'p1';
    const p2Win = match.result === 'p2';
    const isTie = match.result === 'tie';

    if (match.p2 === 'BYE') {
        return `
            <div class="swiss-match-card" style="opacity: 0.8; border-style: dashed;">
                <div class="match-players-row">
                    <div class="player-box is-winner">${match.p1}</div>
                    <div class="vs-circle">BYE</div>
                    <div class="player-box" style="opacity: 0.3;">---</div>
                </div>
                <div style="font-size: 0.65rem; color: var(--success); text-align: center; font-weight: 800; letter-spacing: 1px;">
                    VICTORIA AUTOMÁTICA
                </div>
            </div>
        `;
    }

    const cardClass = p1Win ? 'p1-win' : (p2Win ? 'p2-win' : (isTie ? 'tie-win' : ''));

    return `
        <div class="swiss-match-card ${cardClass}">
            <div class="match-players-row">
                <div class="player-box ${p1Win ? 'is-winner' : ''}">${match.p1}</div>
                <div class="vs-circle">VS</div>
                <div class="player-box ${p2Win ? 'is-winner' : ''}">${match.p2}</div>
            </div>
            
            ${!isFinished ? `
                <div class="swiss-result-btns">
                    <button class="result-btn ${p1Win ? 'active-win' : ''}" onclick="setSwissResult(${rIdx}, ${mIdx}, 'p1')">
                        <i class="fas fa-trophy"></i> P1 Win
                    </button>
                    <button class="result-btn ${isTie ? 'active-tie' : ''}" onclick="setSwissResult(${rIdx}, ${mIdx}, 'tie')">
                        <i class="fas fa-equals"></i> Tie
                    </button>
                    <button class="result-btn ${p2Win ? 'active-win' : ''}" onclick="setSwissResult(${rIdx}, ${mIdx}, 'p2')">
                        <i class="fas fa-trophy"></i> P2 Win
                    </button>
                </div>
            ` : `<div style="text-align:center; font-size: 0.7rem; color: var(--text-secondary); font-weight: 800; letter-spacing: 1px; margin-top: 5px;">
                    <i class="fas fa-lock"></i> RESULTADO FINAL
                 </div>`}
        </div>
    `;
}

function generateSwissRound(data) {
    const players = [...data.players];
    let pairings = [];
    
    if (data.swissRounds.length === 0) {
        // Ronda 1: Aleatorio
        const shuffled = players.sort(() => Math.random() - 0.5);
        for (let i = 0; i < shuffled.length; i += 2) {
            if (i + 1 < shuffled.length) {
                pairings.push({ p1: shuffled[i], p2: shuffled[i + 1], result: null });
            } else {
                pairings.push({ p1: shuffled[i], p2: 'BYE', result: 'p1' });
            }
        }
    } else {
        // Rondas siguientes: Basado en puntos
        calculateSwissStats(data);
        const sorted = [...data.swissData].sort((a, b) => b.points - a.points || Math.random() - 0.5);
        const pairedNames = new Set();
        
        for (let i = 0; i < sorted.length; i++) {
            const p1Name = sorted[i].name;
            if (pairedNames.has(p1Name)) continue;
            
            let found = false;
            // Buscar oponente libre con puntos similares
            for (let j = i + 1; j < sorted.length; j++) {
                const p2Name = sorted[j].name;
                if (!pairedNames.has(p2Name)) {
                    pairings.push({ p1: p1Name, p2: p2Name, result: null });
                    pairedNames.add(p1Name);
                    pairedNames.add(p2Name);
                    found = true;
                    break;
                }
            }
            
            if (!found) {
                // Si sobra uno, darle BYE
                pairings.push({ p1: p1Name, p2: 'BYE', result: 'p1' });
                pairedNames.add(p1Name);
            }
        }
    }
    
    data.swissRounds.push({ matches: pairings });
    saveTournament(data);
}

function calculateSwissStats(data) {
    // Reiniciar stats
    data.swissData.forEach(p => {
        p.points = 0;
        p.wins = 0;
        p.losses = 0;
        p.ties = 0;
    });

    // Procesar cada match de cada ronda
    data.swissRounds.forEach(round => {
        round.matches.forEach(m => {
            const p1 = data.swissData.find(p => p.name === m.p1);
            const p2 = data.swissData.find(p => p.name === m.p2);

            if (m.result === 'p1') {
                if (p1) { p1.points += 3; p1.wins += 1; }
                if (p2 && m.p2 !== 'BYE') { p2.losses += 1; }
            } else if (m.result === 'p2') {
                if (p2) { p2.points += 3; p2.wins += 1; }
                if (p1) { p1.losses += 1; }
            } else if (m.result === 'tie') {
                if (p1) { p1.points += 1; p1.ties += 1; }
                if (p2) { p2.points += 1; p2.ties += 1; }
            }
        });
    });
}

window.addNewSwissRound = function() {
    const data = loadTournament();
    // Verificar si la ronda actual está completa
    const currentRound = data.swissRounds[data.swissRounds.length - 1];
    const incomplete = currentRound.matches.some(m => !m.result && m.p2 !== 'BYE');
    
    if (incomplete) {
        if (!confirm('Hay partidas sin resultado en la ronda actual. ¿Generar siguiente ronda de todas formas?')) {
            return;
        }
    }
    
    generateSwissRound(data);
    // Cambiar automáticamente a la nueva pestaña de ronda
    data.activeSwissTab = data.swissRounds.length - 1;
    saveTournament(data);
    renderTournament(data, document.getElementById('tournament-display'));
};

window.setSwissResult = function(rIdx, mIdx, result) {
    const data = loadTournament();
    const match = data.swissRounds[rIdx].matches[mIdx];
    
    // Toggle result: si haces click en el mismo, se borra
    if (match.result === result) {
        match.result = null;
    } else {
        match.result = result;
    }
    
    saveTournament(data);
    renderTournament(data, document.getElementById('tournament-display'));
};

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
