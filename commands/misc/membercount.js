// membercount.js
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'membercount',
    aliases: ['membcount', 'members'],
    description: `Gets user's server by mentioning or providing user ID.`,
    async execute(message) {
        try {
            await message.guild.members.fetch();
            const members = message.guild.members.cache.filter(member => !member.user.bot);
            const embed = new EmbedBuilder()
                .setColor('#EBDCFA')
                .setDescription(`<:info:1247134460319633408> Members: ${members.size}`)
            message.reply({ embeds: [embed] });
        } catch (error) {
            throw error;
        }
    },
};
