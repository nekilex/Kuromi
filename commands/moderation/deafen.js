// deafen.js
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'deafen',
    aliases: ['deaf', 'removeears'],
    description: 'Deafen user by mentioning or providing user ID.',
    async execute(message, args) {
        try {
            let users = [];

            if (message.mentions.users.size) {
                users = message.mentions.members.map(member => member);
            } else if (args.length) {
                for (const arg of args) {
                    try {
                        const user = await message.client.users.fetch(arg);
                        const member = message.guild.members.cache.get(user.id);
                        if (member) {
                            users.push(member);
                        } else {
                            const embed = new EmbedBuilder()
                                .setColor('#F39C12')
                                .setDescription(`<:error:1247140297784426567> User with ID ${user.id} is not in this server.`);
                            message.reply({ embeds: [embed] });
                        }
                    } catch (error) {
                        const embed = new EmbedBuilder()
                            .setColor('#F39C12')
                            .setDescription('<:error:1247140297784426567> Invalid user provided.');
                        message.reply({ embeds: [embed] });
                    }
                }
            } else {
                const embed = new EmbedBuilder()
                    .setColor('#F39C12')
                    .setDescription('<:error:1247140297784426567> No user ID or mentioned user provided.');
                message.reply({ embeds: [embed] });
                return;
            }

            for (const member of users) {
                if (member.voice.channel) {
                    try {
                        await member.voice.setDeaf(true, 'Deafened by command');
                        const embed = new EmbedBuilder()
                            .setColor('#2ECC70')
                            .setDescription(`<:granted:1247140301060046907> Successfully deafened ${member.user}.`);
                        message.reply({ embeds: [embed] });
                    } catch (error) {
                        const embed = new EmbedBuilder()
                            .setColor('#F39C12')
                            .setDescription(`<:error:1247140297784426567> An error occurred while deafening ${member.user}.`);
                        message.reply({ embeds: [embed] });
                    }
                } else {
                    const embed = new EmbedBuilder()
                        .setColor('#F39C12')
                        .setDescription(`<:error:1247140297784426567> ${member.user} is not in a voice channel.`);
                    message.reply({ embeds: [embed] });
                }
            }
        } catch (error) {
            throw error;
        }
    },
};
