// cmds/ai.js
module.exports = {
    onStart: async (sender_psid, message) => {
        const sendMessage = require('../handles/sendMessage');
        sendMessage(sender_psid, `AI Response: ${message.text}`);
    }
};

