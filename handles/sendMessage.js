const handleMessage = require('./handleMessage');
const handlePostback = require('./handlePostback');
const request = require('request');

module.exports = (sender_psid, response, quickReplies = null) => {
    let request_body = {
        recipient: { id: sender_psid },
        message: {}
    };

    // Vérifie si on doit envoyer des boutons Quick Replies
    if (quickReplies && Array.isArray(quickReplies)) {
        request_body.message.text = response;
        request_body.message.quick_replies = quickReplies.map(title => ({
            content_type: "text",
            title: title,
            payload: title.toUpperCase().replace(/\s/g, "_") // Convertir en format payload
        }));
    } else {
        request_body.message.text = response;
    }

    request({
        uri: 'https://graph.facebook.com/v12.0/me/messages',
        qs: { access_token: process.env.PAGE_ACCESS_TOKEN },
        method: 'POST',
        json: request_body
    }, (err, res, body) => {
        if (err) {
            console.error(`Erreur lors de l'envoi du message: ${err}`);
        }
    });
};
