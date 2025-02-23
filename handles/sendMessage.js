// handles/sendMessage.js
const request = require('request');

module.exports = (sender_psid, response) => {
    let request_body = {
        recipient: { id: sender_psid },
        message: { text: response }
    };

    request({
        uri: 'https://graph.facebook.com/v12.0/me/messages',
        qs: { access_token: process.env.PAGE_ACCESS_TOKEN },
        method: 'POST',
        json: request_body
    }, (err, res, body) => {
        if (err) {
            console.error('Erreur lors de l'envoi du message:', err);
        }
    });
};
