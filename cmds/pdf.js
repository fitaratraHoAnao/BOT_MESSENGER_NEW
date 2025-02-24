const axios = require('axios');
const sendMessage = require('../handles/sendMessage');

module.exports = {
    command: 'pdf',
    execute: async (sender_psid, message) => {
        const userInput = message.text.trim();
        const sanitizedUserInput = userInput.toLowerCase().replace(/\s+/g, "_"); // Normalisation du nom du fichier

        try {
            const apiUrl = `https://pdf-eight-snowy.vercel.app/recherche?pdf=${encodeURIComponent(sanitizedUserInput)}`;
            const response = await axios.get(apiUrl);

            if (response.data.message === "Fichier trouvé.") {
                const pdfUrl = response.data.url;

                // Envoyer directement le fichier en tant qu'attachement
                sendMessage(sender_psid, {
                    attachment: {
                        type: "file",
                        payload: {
                            url: pdfUrl
                        }
                    }
                });

            } else {
                sendMessage(sender_psid, `Désolé, le fichier '${userInput}' n'existe pas.`);
            }
        } catch (error) {
            console.error("Erreur lors de la requête à l'API:", error.message);
            sendMessage(sender_psid, "Je n'ai pas pu récupérer le fichier PDF.");
        }
    }
};
