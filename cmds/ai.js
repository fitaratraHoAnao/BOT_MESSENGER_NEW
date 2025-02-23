const axios = require('axios');
const sendMessage = require('../handles/sendMessage');

module.exports = {
    onStart: async (sender_psid, message) => {
        try {
            const userMessage = encodeURIComponent(message.text);
            const uid = sender_psid; // Utiliser sender_psid comme UID pour la conversation continue

            const apiUrl = `https://api-test-one-brown.vercel.app/llama?question=${userMessage}&uid=${uid}`;
            const response = await axios.get(apiUrl);

            if (response.data && response.data.answer) {
                sendMessage(sender_psid, response.data.answer);
            } else {
                sendMessage(sender_psid, "Je n'ai pas pu obtenir de réponse.");
            }
        } catch (error) {
            console.error("Erreur lors de l'appel à l'API AI:", error);
            sendMessage(sender_psid, "Une erreur est survenue, réessayez plus tard.");
        }
    }
};
