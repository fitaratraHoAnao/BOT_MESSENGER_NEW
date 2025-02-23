// cmds/claude.js
module.exports = {
    command: 'Claude',
    execute: async (sender_psid, message) => {
        const sendMessage = require('../handles/sendMessage');
        sendMessage(sender_psid, `Claude répond : ${message.text}`);
    }
};

