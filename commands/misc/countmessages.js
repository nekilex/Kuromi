const { EmbedBuilder } = require('discord.js');

module.exports = {
    name: 'countmessages',
    aliases: [''],
    description: 'Counts the number of messages in the mentioned channel or the current channel if no channel is mentioned',
    async execute(message) {
        try {
            let mentionedChannel = message.mentions.channels.first();
            let channelToCount = mentionedChannel || message.channel;

            let messageCount = 0;
            let lastMessageId;
            let fetchMessages;

            do {
                fetchMessages = await channelToCount.messages.fetch({ limit: 100, before: lastMessageId });
                messageCount += fetchMessages.size;
                lastMessageId = fetchMessages.last()?.id;
            } while (fetchMessages.size === 100);

            const embed = new EmbedBuilder()
                .setColor('#EBDCFA')
                .setDescription(`<:info:1247134460319633408> There are ${messageCount} messages in ${mentionedChannel ? mentionedChannel : 'this'} channel.`);
            message.reply({ embeds: [embed] });
        } catch (error) {
            throw error;
        }
    },
};
