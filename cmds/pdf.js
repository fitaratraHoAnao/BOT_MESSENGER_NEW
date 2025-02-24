const axios = require('axios');
const fs = require('fs');
const path = require('path');
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
                const pdfPath = path.join(__dirname, `${userInput}.pdf`);
                
                // Télécharger le fichier PDF
                const pdfResponse = await axios({
                    url: pdfUrl,
                    method: 'GET',
                    responseType: 'stream'
                });
                
                const writer = fs.createWriteStream(pdfPath);
                pdfResponse.data.pipe(writer);
                
                writer.on('finish', () => {
                    sendMessage(sender_psid, { attachment: { type: 'file', payload: { url: pdfPath } } });
                    // Supprimer le fichier après l'envoi
                    setTimeout(() => fs.unlinkSync(pdfPath), 10000);
                });
            } else {
                sendMessage(sender_psid, "Désolé, le fichier demandé n'a pas été trouvé.");
            }
        } catch (error) {
            console.error("Erreur lors de la requête à l'API:", error);
            sendMessage(sender_psid, "Je n'ai pas pu récupérer le fichier PDF.");
        }
    }
};
