const fs = require('fs');
const path = require('path');
const sendMessage = require('../handles/sendMessage');

module.exports = {
    command:'help',
    execute: async (sender_psid, message) => {
        const cmdsDir = path.join(__dirname); // Dossier cmds/
        const files = fs.readdirSync(cmdsDir).filter(file => file.endsWith('.js')); // Liste des fichiers
        const totalCommands = files.length;
        const commandsPerPage = 5;
        let args = message.text.split(" ");
        let page = parseInt(args[1]) || 1;

        // Afficher tous les fichiers si "help all"
        if (args[1] && args[1].toLowerCase() === "all") {
            page = 1;
            commandsPerPage = totalCommands;
        }

        const totalPages = Math.ceil(totalCommands / commandsPerPage);
        if (page < 1 || page > totalPages) page = 1;

        // Pagination des commandes
        const startIndex = (page - 1) * commandsPerPage;
        const paginatedCommands = files.slice(startIndex, startIndex + commandsPerPage);

        let response = `🚀 **Commands List** (Page ${page}/${totalPages})\n📜 **Total Commands**: ${totalCommands}\n\n`;

        paginatedCommands.forEach((file, index) => {
            const commandName = file.replace('.js', '');
            response += `${startIndex + index + 1}. ✨ **${commandName.charAt(0).toUpperCase() + commandName.slice(1)}**\n📝 Description ici\n\n`;
        });

        response += `📌 **Tip**: Use "help [page]" to switch pages, or "help all" to see all commands!`;

        sendMessage(sender_psid, response);
    }
};
