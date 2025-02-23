const axios = require('axios');

module.exports = {
    onStart: async (sender_psid, message) => {
        const sendMessage = require('../handles/sendMessage');
        const uid = sender_psid; // Utiliser l'ID utilisateur pour conserver le contexte
        const userMessage = encodeURIComponent(message.text); // Encodage de la question

        try {
            const response = await axios.get(`https://api-test-one-brown.vercel.app/llama?question=${userMessage}&uid=${uid}`);
            console.log("Réponse API:", response.data); // Debugging

            // Vérifier que la réponse contient bien une clé 'response'
            if (response.data && typeof response.data.response === 'string') {
                sendMessage(sender_psid, response.data.response);
            } else {
                sendMessage(sender_psid, "Je n'ai pas pu obtenir de réponse valide.");
            }
        } catch (error) {
            console.error("Erreur lors de l'appel API:", error.message);
            sendMessage(sender_psid, "Une erreur est survenue lors de la communication avec l'IA.");
        }
    }
};
