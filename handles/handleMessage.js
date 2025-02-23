// handles/handleMessage.js
const fs = require('fs');
const path = require('path');
const sendMessage = require('./sendMessage');

// Charger dynamiquement toutes les commandes
const commands = {};
fs.readdirSync(path.join(__dirname, '../cmds')).forEach(file => {
    if (file.endsWith('.js')) {
        const command = require(`../cmds/${file}`);
        if (command.command) {
            commands[command.command.toLowerCase()] = command;
        } else if (command.onStart) {
            commands['onStart'] = command;
        }
    }
});

module.exports = (sender_psid, message) => {
    if (commands['onStart']) {
        commands['onStart'].onStart(sender_psid, message);
        return;
    }
    
    let commandKey = Object.keys(commands).find(cmd => message.text.toLowerCase().startsWith(cmd));
    if (commandKey) {
        commands[commandKey].execute(sender_psid, message);
    } else {
        sendMessage(sender_psid, "Commande inconnue. Tapez 'help' pour voir les commandes disponibles.");
    }
};
