const fs = require('fs');
const path = require('path');
const sendMessage = require('./sendMessage');
const handlePostback = require('./handlePostback');
const userSessions = {}; // Stocke l'état des utilisateurs

// Charger dynamiquement les commandes depuis le dossier cmds/
const commands = {};
fs.readdirSync(path.join(__dirname, '../cmds')).forEach(file => {
    const command = require(`../cmds/${file}`);
    if (command.command) {
        commands[command.command.toLowerCase()] = command;
    } else if (command.onStart) {
        commands['onstart'] = command; // Associer la commande qui contient onStart
    }
});

module.exports = (sender_psid, message) => {
    const text = message.text.toLowerCase().trim();

    // Autoriser toujours la commande "help"
    if (text === "help" && commands["help"]) {
        return commands["help"].execute(sender_psid, message);
    }

    // Vérifier si l'utilisateur veut désactiver une commande en cours
    if (text === "stop" && userSessions[sender_psid]) {
        const activeCommand = userSessions[sender_psid];
        delete userSessions[sender_psid]; // Désactiver la commande en cours
        return sendMessage(sender_psid, `La commande ${activeCommand} a été désactivée avec succès.`);
    }

    // Vérifier si le message correspond à une commande connue
    for (let cmd in commands) {
        if (text.startsWith(cmd)) {
            userSessions[sender_psid] = cmd; // Activer la nouvelle commande (écrase l'ancienne)
            sendMessage(sender_psid, `La commande ${cmd} est activée.`);
            return commands[cmd].execute(sender_psid, message);
        }
    }

    // Vérifier si une commande est active pour cet utilisateur
    if (userSessions[sender_psid]) {
        const activeCommand = userSessions[sender_psid];
        return commands[activeCommand].execute(sender_psid, message);
    }

    // Si aucune commande n'est active, utiliser la commande contenant onStart
    if (commands['onstart'] && commands['onstart'].onStart) {
        return commands['onstart'].onStart(sender_psid, message);
    }

    // Réponse par défaut si aucun traitement n'est applicable
    sendMessage(sender_psid, "Commande inconnue. Tapez 'help' pour voir les commandes disponibles.");
};
