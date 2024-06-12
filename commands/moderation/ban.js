// ban.js
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'ban',
    aliases: ['banuser', 'remove'],
    description: 'Ban user by mentioning or providing user ID with an optional reason.',
    async execute(message, args) {
        try {
            if (args.length === 0) {
                const embed = new EmbedBuilder()
                    .setColor('#F39C12')
                    .setDescription('<:error:1247140297784426567> No user ID or mentioned user provided.');
                return message.reply({ embeds: [embed] });
            }

            let users = [];
            const reason = args.slice(1).join(' ') || '';

            for (const arg of args) {
                let member;
                if (arg.startsWith('<@') && arg.endsWith('>')) {
                    const userId = arg.replace(/[<@!>]/g, '');
                    member = message.guild.members.cache.get(userId);
                } else {
                    member = message.guild.members.cache.get(arg);
                }

                if (member) {
                    users.push(member);
                } else {
                    const embed = new EmbedBuilder()
                        .setColor('#F39C12')
                        .setDescription(`<:error:1247140297784426567> User with ID ${arg} is not in this server.`);
                    message.reply({ embeds: [embed] });
                }
            }

            for (const member of users) {
                try {
                    await member.ban({ reason: reason || undefined });
                    const successMessage = `<:granted:1247140301060046907> Successfully banned ${member.user.tag}${reason ? ` for "${reason}"` : ''}.`;

                    const embed = new EmbedBuilder()
                        .setColor('#2ECC70')
                        .setDescription(successMessage);
                    message.reply({ embeds: [embed] });
                } catch (error) {
                    const embed = new EmbedBuilder()
                        .setColor('#F39C12')
                        .setDescription(`<:error:1247140297784426567> An error occurred while banning ${member.user.tag}.`);
                    message.reply({ embeds: [embed] });
                }
            }
        } catch (error) {
            throw error;
        }
    },
};
