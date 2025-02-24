const fs = require('fs');
const path = require('path');
const sendMessage = require('./sendMessage');
const handlePostback = require('./handlePostback');

const userSessions = {}; // Stocke l'état des utilisateurs

// Charger dynamiquement les commandes depuis le dossier cmds/
const commands = {};
let onStartCommand = null; // Stocker la commande contenant onStart

fs.readdirSync(path.join(__dirname, '../cmds')).forEach(file => {
    const command = require(`../cmds/${file}`);
    if (command.command) {
        commands[command.command.toLowerCase()] = command;
    } 
    if (command.onStart) {
        onStartCommand = command; // Sauvegarde de la commande qui contient onStart
    }
});

module.exports = (sender_psid, message) => {
    const text = message.text.toLowerCase().trim();

    // 📌 Vérifier si l'utilisateur demande un PDF (ex: "math", "livre")
    const pdfPath = path.join(__dirname, '../pdf', `${text}.pdf`);
    if (fs.existsSync(pdfPath)) {
        const fileUrl = `https://pdf-eight-snowy.vercel.app/pdf/${text}.pdf`; // Modifier avec ton URL d'API

        return sendMessage(sender_psid, {
            attachment: {
                type: "file",
                payload: {
                    url: fileUrl,
                    is_reusable: true
                }
            }
        });
    }

    // 📌 Si l'utilisateur envoie "active", on exécute la fonction onStart
    if (text === "active" && onStartCommand && onStartCommand.onStart) {
        delete userSessions[sender_psid]; // Réinitialiser la session
        return onStartCommand.onStart(sender_psid, message);
    }

    // 📌 Vérifier si le message commence par "help"
    if (text.startsWith("help") && commands["help"]) {
        return commands["help"].execute(sender_psid, message);
    }

    // 📌 Vérifier si le message correspond à une commande connue
    for (let cmd in commands) {
        if (text.startsWith(cmd)) {
            userSessions[sender_psid] = cmd; // Activer la nouvelle commande (remplace l'ancienne)
            return commands[cmd].execute(sender_psid, message);
        }
    }

    // 📌 Vérifier si une commande est déjà active et poursuivre la discussion avec cette commande
    if (userSessions[sender_psid]) {
        const activeCommand = userSessions[sender_psid];
        return commands[activeCommand].execute(sender_psid, message);
    }

    // 📌 Si aucune commande n'est active, exécuter onStart
    if (onStartCommand && onStartCommand.onStart) {
        return onStartCommand.onStart(sender_psid, message);
    }

    // 📌 Réponse par défaut si aucun traitement n'est applicable
    sendMessage(sender_psid, "Commande inconnue. Tapez 'help' pour voir les commandes disponibles.");
};
