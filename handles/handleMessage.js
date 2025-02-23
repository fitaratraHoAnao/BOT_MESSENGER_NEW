const fs = require('fs');
const path = require('path');
const sendMessage = require('./sendMessage');

const userSessions = {}; // Stocke l'état des utilisateurs

// Charger dynamiquement les commandes depuis le dossier cmds/
const commands = {};
fs.readdirSync(path.join(__dirname, '../cmds')).forEach(file => {
    const command = require(`../cmds/${file}`);
    if (command.command) {
        commands[command.command.toLowerCase()] = command;
    } else if (command.onStart) {
        commands['ai'] = command; // AI se déclenche sur tout message si rien n'est actif
    }
});

module.exports = (sender_psid, message) => {
    const text = message.text.toLowerCase().trim();

    // Vérifier si l'utilisateur veut désactiver une commande en cours
    if (text === "stop" && userSessions[sender_psid]) {
        const activeCommand = userSessions[sender_psid];
        delete userSessions[sender_psid]; // Désactiver la commande en cours
        return sendMessage(sender_psid, `La commande ${activeCommand} a été désactivée avec succès.`);
    }

    // Vérifier d'abord si le message est une commande connue
    for (let cmd in commands) {
        if (text.startsWith(cmd)) {
            userSessions[sender_psid] = cmd; // Activer la commande
            sendMessage(sender_psid, `La commande ${cmd} est activée.`);
            return commands[cmd].execute(sender_psid, message);
        }
    }

    // Vérifier si une commande est active pour cet utilisateur
    if (userSessions[sender_psid]) {
        const activeCommand = userSessions[sender_psid];
        return commands[activeCommand].execute(sender_psid, message);
    }

    // Si aucune commande spécifique n'est détectée, exécuter AI si disponible
    if (commands['ai'] && commands['ai'].onStart) {
        return commands['ai'].onStart(sender_psid, message);
    }

    // Réponse par défaut si aucun traitement n'est applicable
    sendMessage(sender_psid, "Commande inconnue. Tapez 'help' pour voir les commandes disponibles.");
};
