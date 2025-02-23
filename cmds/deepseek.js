const axios = require('axios');
const sendMessage = require('../handles/sendMessage');

module.exports = {
    command:'deepseek',
    execute: async (sender_psid, message) => {
        const userInput = message.text;
        const uid = sender_psid; // Utiliser l'ID de l'utilisateur pour maintenir l'historique

        try {
            const apiUrl = `https://api-test-one-brown.vercel.app/deepseek?question=${encodeURIComponent(userInput)}&uid=${uid}`;
            const response = await axios.get(apiUrl);
            let botResponse = response.data.response;

            // Supprimer le contenu entre <think>...</think>
            botResponse = botResponse.replace(/<think>[\s\S]*?<\/think>\n*/, '');

            sendMessage(sender_psid, botResponse);
        } catch (error) {
            console.error('Erreur lors de la requête à l\'API:', error);
            sendMessage(sender_psid, "Je n'ai pas pu obtenir de réponse.");
        }
    }
};
