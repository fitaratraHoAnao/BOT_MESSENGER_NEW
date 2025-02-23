// handles/handlePostback.js
module.exports = (sender_psid, postback) => {
    const sendMessage = require('./sendMessage');
    sendMessage(sender_psid, `Postback reçu: ${postback.payload}`);
};
