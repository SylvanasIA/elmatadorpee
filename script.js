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
    { "name": "Taurus EX Arcoiris", "language": "Inglés", "cost": 50000, "image": "https://assets.pokemon-zone.com/game-assets/CardPreviews/cTR_20_000980_00_MELISSA_SR.webp", "quantity": 1 }
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

// Asegurarse de que el DOM esté cargado antes de ejecutar
document.addEventListener('DOMContentLoaded', loadRewards);
