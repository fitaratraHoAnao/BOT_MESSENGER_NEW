const fs = require('fs');
const path = require('path');
const sendMessage = require('./sendMessage');

const commandsPerPage = 5; // Nombre de commandes affichées par page

module.exports = (sender_psid, message) => {
    const text = message.text.toLowerCase().trim();
    let page = 1;

    // Vérifier si l'utilisateur demande une page spécifique (ex: "help 2")
    if (text.startsWith("help ")) {
        const pageNumber = parseInt(text.split(" ")[1]);
        if (!isNaN(pageNumber) && pageNumber > 0) {
            page = pageNumber;
        }
    }

    // Récupérer la liste des commandes du dossier cmds/
    const commandsDir = require('path').join(__dirname, '../cmds');
    const commandFiles = fs.readdirSync(commandsDir).filter(file => file.endsWith('.js'));

    const totalPages = Math.ceil(commandFiles.length / commandsPerPage);
    if (page > totalPages) {
        return sendMessage(sender_psid, `❌ Page invalide. Il y a seulement ${totalPages} pages.`);
    }

    // Sélectionner les commandes pour la page demandée
    const startIndex = (page - 1) * commandsPerPage;
    const endIndex = startIndex + commandsPerPage;
    const commandsToShow = commandFiles.slice(startIndex, endIndex);

    let responseText = `🚀 **Commands List** (Page ${page}/${totalPages})\n📜 **Total Commands**: ${commandFiles.length}\n\n`;

    const buttons = [];
    commandsToShow.forEach((file, index) => {
        const commandName = path.parse(file).name; // Récupère le nom du fichier sans extension
        responseText += `${startIndex + index + 1}. ✨ **${commandName}**\n📝 Description non disponible\n\n`;

        // Ajouter un bouton pour chaque commande
        buttons.push({
            type: "postback",
            title: commandName,
            payload: commandName.toLowerCase()
        });
    });

    // Ajouter les boutons de navigation si nécessaire
    if (page > 1) {
        buttons.push({
            type: "postback",
            title: "⬅️ Page précédente",
            payload: `help ${page - 1}`
        });
    }
    if (page < totalPages) {
        buttons.push({
            type: "postback",
            title: "➡️ Page suivante",
            payload: `help ${page + 1}`
        });
    }

    // Envoyer la réponse avec les boutons
    sendMessage(sender_psid, {
        recipient: { id: sender_psid },
        message: {
            attachment: {
                type: "template",
                payload: {
                    template_type: "button",
                    text: responseText,
                    buttons: buttons
                }
            }
        }
    });
};
