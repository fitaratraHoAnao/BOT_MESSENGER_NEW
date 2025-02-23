const fs = require('fs');
const path = require('path');
const sendMessage = require('./sendMessage');

// Charger dynamiquement les commandes depuis le dossier cmds/
const commands = {};
fs.readdirSync(path.join(__dirname, '../cmds')).forEach(file => {
    const command = require(`../cmds/${file}`);
    if (command.command) {
        commands[command.command.toLowerCase()] = command;
    } else if (command.onStart) {
        commands['ai'] = command; // AI se déclenche sur tout message
    }
});

module.exports = (sender_psid, message) => {
    const text = message.text.toLowerCase().trim();

    // Vérifier d'abord si le message commence par une commande connue
    for (let cmd in commands) {
        if (text.startsWith(cmd)) {
            return commands[cmd].execute(sender_psid, message);
        }
    }

    // Si aucune commande spécifique n'est détectée, exécuter AI si disponible
    if (commands['ai'] && commands['ai'].onStart) {
        return commands['ai'].onStart(sender_psid, message);
    }

    // Réponse par défaut si aucun traitement n'est applicable
    sendMessage(sender_psid, "Commande inconnue. Tapez 'help' pour voir les commandes disponibles.");
};
