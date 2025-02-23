// cmds/help.js
module.exports = {
    command: 'help',
    execute: async (sender_psid) => {
        const sendMessage = require('../handles/sendMessage');
        sendMessage(sender_psid, 'Commandes disponibles: Claude, help, AI (automatique)');
    }
};
