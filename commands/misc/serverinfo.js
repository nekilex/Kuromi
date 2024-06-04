// serverinfo.js
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'serverinfo',
    aliases: ['aboutserver', 'aboutserv', 'aboutsv'],
    async execute(message) {
        try {
            const server = message.guild;

            const embed = new EmbedBuilder()
                .setColor('#EBDCFA')
                .setTitle(`${server.name} Server Information`)
                .setThumbnail(server.iconURL())
                .addFields(
                    { name: 'Owner', value: (await server.fetchOwner()).user.tag, inline: true },
                    { name: 'Members', value: `${server.memberCount}`, inline: true },
                    { name: 'Roles', value: `${server.roles.cache.size}`, inline: true },
                    { name: 'Category Channels', value: `${server.channels.cache.filter(channel => channel.type === 'category').size}`, inline: true },
                    { name: 'Text Channels', value: `${server.channels.cache.filter(channel => channel.type === 'text').size}`, inline: true },
                    { name: 'Voice Channels', value: `${server.channels.cache.filter(channel => channel.type === 'voice').size}`, inline: true }
                )
                .setFooter({ text: `Server ID: ${server.id}` })
                .setTimestamp(server.createdAt);

            message.reply({ embeds: [embed] });
        } catch (error) {
            throw error;
        }
    },
};
