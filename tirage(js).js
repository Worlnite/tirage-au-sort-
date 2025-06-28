// Récupération des éléments HTML
const nameInput = document.getElementById('nameInput');
const addNameBtn = document.getElementById('addNameBtn');
const bulkNameInput = document.getElementById('bulkNameInput');
const addBulkNamesBtn = document.getElementById('addBulkNamesBtn');
const nameList = document.getElementById('nameList');
const participantCount = document.getElementById('participantCount');
const clearListBtn = document.getElementById('clearListBtn');
const drawBtn = document.getElementById('drawBtn');
const winnerDisplay = document.getElementById('winnerDisplay');
const removeWinnerCheckbox = document.getElementById('removeWinnerCheckbox'); // Nouveau : la checkbox

let participants = []; // Tableau pour stocker les noms des participants

// Fonction pour mettre à jour l'affichage de la liste et le compteur
function updateParticipantList() {
    nameList.innerHTML = ''; // Vide la liste actuelle
    participants.forEach((name, index) => {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <span>${name}</span>
            <button class="remove-name-btn" data-index="${index}">X</button>
        `;
        nameList.appendChild(listItem);
    });
    participantCount.textContent = participants.length; // Met à jour le compteur

    // Active/désactive le bouton de tirage et de vidage
    if (participants.length >= 2) { // Il faut au moins 2 participants pour un tirage
        drawBtn.disabled = false;
        drawBtn.classList.remove('disabled');
    } else {
        drawBtn.disabled = true;
        drawBtn.classList.add('disabled');
    }

    if (participants.length > 0) {
        clearListBtn.disabled = false;
    } else {
        clearListBtn.disabled = true;
    }
}

// Fonction pour afficher un message temporaire dans winnerDisplay
function showTemporaryMessage(message, type = 'info') {
    winnerDisplay.classList.remove('winner', 'drawing'); // Nettoyer les anciennes classes
    winnerDisplay.textContent = message;

    // Définir les styles en fonction du type de message
    switch (type) {
        case 'info':
            winnerDisplay.style.color = '#00ffff'; // Cyan
            winnerDisplay.style.borderColor = '#00ffff';
            winnerDisplay.style.boxShadow = 'none';
            winnerDisplay.style.textShadow = 'none';
            break;
        case 'error':
            winnerDisplay.style.color = '#ff3366'; // Rouge-rose
            winnerDisplay.style.borderColor = '#ff3366';
            winnerDisplay.style.boxShadow = '0 0 10px rgba(255, 51, 102, 0.7)';
            winnerDisplay.style.textShadow = '0 0 5px rgba(255, 51, 102, 0.8)';
            break;
        case 'success':
            winnerDisplay.style.color = '#00ff00'; // Vert
            winnerDisplay.style.borderColor = '#00ff00';
            winnerDisplay.style.boxShadow = '0 0 20px rgba(0, 255, 0, 0.8), 0 0 40px rgba(0, 255, 0, 0.6)';
            winnerDisplay.style.textShadow = '0 0 10px rgba(0, 255, 0, 0.8)';
            break;
        default:
            // Style par défaut (vert pour "Prêt pour le tirage...")
            winnerDisplay.style.color = '#00ff00';
            winnerDisplay.style.borderColor = '#00ff00';
            winnerDisplay.style.boxShadow = '0 0 20px rgba(0, 255, 0, 0.8), 0 0 40px rgba(0, 255, 0, 0.6)';
            winnerDisplay.style.textShadow = '0 0 10px rgba(0, 255, 0, 0.8)';
    }

    // Réinitialiser l'affichage après un court délai
    setTimeout(() => {
        winnerDisplay.textContent = 'Prêt pour le tirage...';
        winnerDisplay.style.color = '#00ff00';
        winnerDisplay.style.borderColor = '#00ff00';
        winnerDisplay.style.boxShadow = '0 0 20px rgba(0, 255, 0, 0.8), 0 0 40px rgba(0, 255, 0, 0.6)';
        winnerDisplay.style.textShadow = '0 0 10px rgba(0, 255, 0, 0.8)';
    }, 2000); // 2 secondes
}


// Fonction pour ajouter un nom unique
function addUniqueName(name) {
    const trimmedName = name.trim();
    if (trimmedName && !participants.includes(trimmedName)) {
        participants.push(trimmedName);
        return true; // Nom ajouté
    }
    return false; // Nom non ajouté (vide ou déjà présent)
}

// Fonction pour ajouter un nom (saisie unique)
function addName() {
    if (addUniqueName(nameInput.value)) {
        nameInput.value = ''; // Vide le champ de saisie
        showTemporaryMessage('Participant ajouté !', 'info');
        updateParticipantList();
    } else if (nameInput.value.trim() !== '') {
        showTemporaryMessage('Ce participant est déjà dans la liste.', 'error');
    }
}

// Fonction pour ajouter des noms en masse
function addBulkNames() {
    const bulkText = bulkNameInput.value;
    if (!bulkText.trim()) {
        showTemporaryMessage('Veuillez coller des noms dans le champ de texte.', 'error');
        return;
    }

    // Diviser par sauts de ligne ou virgules, puis filtrer les vides
    const namesToAdd = bulkText.split(/[\n,]+/)
                               .map(name => name.trim())
                               .filter(name => name !== '');

    let addedCount = 0;
    namesToAdd.forEach(name => {
        if (addUniqueName(name)) {
            addedCount++;
        }
    });

    if (addedCount > 0) {
        bulkNameInput.value = ''; // Vide le textarea
        showTemporaryMessage(`${addedCount} participant(s) ajouté(s) en masse !`, 'info');
        updateParticipantList();
    } else {
        showTemporaryMessage('Aucun nouveau participant valide à ajouter.', 'error');
    }
}


// Fonction pour supprimer un nom
function removeName(event) {
    if (event.target.classList.contains('remove-name-btn')) {
        const indexToRemove = parseInt(event.target.dataset.index);
        const removedName = participants[indexToRemove]; // Garder le nom pour le message
        participants.splice(indexToRemove, 1); // Supprime l'élément à l'index donné
        updateParticipantList();
        showTemporaryMessage(`Participant '${removedName}' supprimé.`, 'error');
    }
}

// Fonction pour vider toute la liste
function clearList() {
    if (confirm('Êtes-vous sûr de vouloir vider toute la liste des participants ?')) {
        participants = [];
        updateParticipantList();
        showTemporaryMessage('Liste des participants effacée !', 'error');
    }
}

// Fonction pour lancer le tirage au sort
function drawWinner() {
    if (participants.length < 2) {
        showTemporaryMessage('Ajoutez au moins 2 participants pour le tirage !', 'error');
        return;
    }

    // Désactive les boutons pendant le tirage
    addNameBtn.disabled = true;
    addBulkNamesBtn.disabled = true;
    clearListBtn.disabled = true;
    drawBtn.disabled = true;
    nameInput.disabled = true;
    bulkNameInput.disabled = true;
    removeWinnerCheckbox.disabled = true; // Nouveau : désactiver la checkbox
    drawBtn.classList.add('disabled');

    winnerDisplay.classList.add('drawing'); // Active l'effet d'animation du tirage
    winnerDisplay.style.color = '#00ffff';
    winnerDisplay.style.borderColor = '#00ffff';
    winnerDisplay.textContent = 'Tirage en cours...';

    let animationCounter = 0;
    const animationNames = ['Chargement...', 'Recherche...', 'Analyse...', 'Détermination...'];
    const animationInterval = setInterval(() => {
        winnerDisplay.textContent = animationNames[animationCounter % animationNames.length];
        animationCounter++;
    }, 300);

    const animationDuration = 3000; // 3 secondes

    setTimeout(() => {
        clearInterval(animationInterval); // Arrête l'animation de texte

        const randomIndex = Math.floor(Math.random() * participants.length);
        const winner = participants[randomIndex];

        winnerDisplay.classList.remove('drawing'); // Désactive l'effet d'animation
        winnerDisplay.classList.add('winner'); // Ajoute une classe pour le style du gagnant final
        winnerDisplay.textContent = `Le gagnant est : ${winner} !`;
        winnerDisplay.style.color = '#00ff00'; // Couleur verte pour le gagnant
        winnerDisplay.style.borderColor = '#00ff00';
        winnerDisplay.style.boxShadow = '0 0 20px rgba(0, 255, 0, 0.8), 0 0 40px rgba(0, 255, 0, 0.6)';
        winnerDisplay.style.textShadow = '0 0 10px rgba(0, 255, 0, 0.8)';

        // NOUVEAU : Vérifier si la checkbox est cochée pour supprimer le gagnant
        if (removeWinnerCheckbox.checked) {
            participants.splice(randomIndex, 1);
        }

        // Réactive les boutons après le tirage
        addNameBtn.disabled = false;
        addBulkNamesBtn.disabled = false;
        clearListBtn.disabled = false;
        drawBtn.disabled = false;
        nameInput.disabled = false;
        bulkNameInput.disabled = false;
        removeWinnerCheckbox.disabled = false; // Nouveau : réactiver la checkbox
        drawBtn.classList.remove('disabled');
        updateParticipantList(); // Met à jour la liste (avec ou sans le gagnant)

    }, animationDuration);
}


// Écouteurs d'événements
addNameBtn.addEventListener('click', addName);
nameInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        addName();
    }
});
addBulkNamesBtn.addEventListener('click', addBulkNames);
nameList.addEventListener('click', removeName);
clearListBtn.addEventListener('click', clearList);
drawBtn.addEventListener('click', drawWinner);

// Initialisation de la liste et des boutons au chargement de la page
updateParticipantList();