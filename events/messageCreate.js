// messageCreate.js
const { EmbedBuilder } = require('discord.js');
const { readdirSync, statSync } = require('fs');
const { resolve, join } = require('path');
const prefix = "k!";
const commandsFolder = '../commands';

const commands = new Map();

const scanCommands = (folderPath) => {
    const items = readdirSync(folderPath);
    for (const item of items) {
        const fullPath = join(folderPath, item);
        const stats = statSync(fullPath);
        if (stats.isDirectory()) {
            scanCommands(fullPath);
        } else if (stats.isFile() && item.endsWith('.js')) {
            const command = require(fullPath);
            commands.set(command.name.toLowerCase(), fullPath);
            if (command.aliases && Array.isArray(command.aliases)) {
                command.aliases.forEach(alias => {
                    commands.set(alias.toLowerCase(), fullPath);
                });
            }
        }
    }
};


scanCommands(resolve(__dirname, commandsFolder));

function levenshteinDistance(str1, str2) {
    const len1 = str1.length;
    const len2 = str2.length;
    const matrix = Array.from({ length: len1 + 1 }, (_, i) => [i]);

    for (let j = 0; j <= len2; j++) {
        matrix[0][j] = j;
    }

    for (let i = 1; i <= len1; i++) {
        for (let j = 1; j <= len2; j++) {
            const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
            matrix[i][j] = Math.min(
                matrix[i - 1][j] + 1,
                matrix[i][j - 1] + 1,
                matrix[i - 1][j - 1] + cost
            );
        }
    }

    return matrix[len1][len2];
}

function suggestCommand(commandName) {
    let suggestedCommand = null;
    let minDistance = Infinity;

    for (const cmdName of commands.keys()) {
        const distance = levenshteinDistance(commandName, cmdName);
        if (distance < minDistance) {
            suggestedCommand = cmdName;
            minDistance = distance;
        }
    }

    return suggestedCommand && suggestedCommand !== commandName ? suggestedCommand : null;
}

module.exports = async function (message, db) {
    if (message.author.bot) return;

    if (!message.content.toLowerCase().startsWith(prefix)) {
        console.log(`[${new Date(message.createdTimestamp).toLocaleString()}] Type: Message | Member: ${message.author.tag} (${message.author.id}) | Message: ${message.content} | Channel: ${message.channel.name} (${message.channel.id}) | Message ID: ${message.id}`);
        return;
    }

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    console.log(`[${new Date(message.createdTimestamp).toLocaleString()}] Type: Command | Member: ${message.author.tag} (${message.author.id}) | Command: ${commandName}${args.length ? ` | Parameters: ${args.join(' ')}` : ''} | Channel: ${message.channel.name} (${message.channel.id}) | Message ID: ${message.id}`);

    const commandPath = commands.get(commandName);
    if (!commandPath) {
        const suggestedCommand = suggestCommand(commandName);
        if (suggestedCommand) {
            try {
                await message.reply(`Did you mean \`${prefix}${suggestedCommand}\`?`);
            } catch (error) {
            }
        } else {
            try {
                await message.reply('Unknown command.');
            } catch (error) {
            }
        }
        return;
    }

    try {
        const commandFile = require(commandPath);
        await commandFile.execute(message, args, db);
    } catch (error) {
        const embed = new EmbedBuilder()
            .setColor('#F39C12')
            .setDescription(`<:error:1247140297784426567> **There was an error executing the command.**\n\`\`\`${error}\`\`\``);
        try {
            await message.reply({ embeds: [embed] });
        } catch (replyError) {
        }
    }
};
