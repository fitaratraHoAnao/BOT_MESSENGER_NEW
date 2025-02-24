const axios = require('axios');
const sendMessage = require('../handles/sendMessage');

module.exports = {
    command: 'pdf',
    execute: async (sender_psid, message) => {
        const userInput = message.text.trim(); // Nom du PDF envoyé par l'utilisateur
        
        try {
            const apiUrl = `https://pdf-eight-snowy.vercel.app/recherche?pdf=${encodeURIComponent(userInput)}`;
            const response = await axios.get(apiUrl);
            
            if (response.data.message === "Fichier trouvé.") {
                const pdfUrl = response.data.url;
                sendMessage(sender_psid, `Voici votre fichier PDF : ${pdfUrl}`);
            } else {
                sendMessage(sender_psid, "Désolé, le fichier demandé n'a pas été trouvé.");
            }
        } catch (error) {
            console.error("Erreur lors de la requête à l'API:", error);
            sendMessage(sender_psid, "Je n'ai pas pu récupérer le fichier PDF.");
        }
    }
};
