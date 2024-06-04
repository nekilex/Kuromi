// info.js
const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'info',
    aliases: ['about', 'botinfo'],
    description: `Provides bot information.`,
    async execute(message) {
        try {
            const embed = new EmbedBuilder()
                .setColor('#EBDCFA')
                .setTitle('Kuromi')
                .setThumbnail(message.client.user.displayAvatarURL())
                .setDescription(`Kuromi is a Discord Utility App built exclusively for nekilex's Discord servers`)
                .addFields(
                    { name: 'Programming Language', value: 'JavaScript', inline: true },
                    { name: 'Version', value: 'Dev 1.0.0', inline: true }
                )

            message.reply({ embeds: [embed] });
        } catch (error) {
            throw error;
        }
    }
};
