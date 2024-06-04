// clean.js
module.exports = {
    name: 'clean',
    aliases: ['linis',],
    description: `Deletes command messages from a user along with the bot's responses to that user, limited to 100 messages.`,
    async execute(message) {
        try {
            const prefixes = ["k!", "K!"];
            if (prefixes.some(prefix => message.content.startsWith(prefix)) && !message.author.bot) {
                await message.delete();

                const fetchedMessages = await message.channel.messages.fetch({ limit: 100 });
                const userMessages = fetchedMessages.filter(m => prefixes.some(prefix => m.content.startsWith(prefix)) && m.author.id === message.author.id);

                for (const msg of userMessages.values()) {
                    await msg.delete();

                    const botMessages = fetchedMessages.filter(m => m.reference?.messageId === msg.id && m.author.bot);
                    for (const botMsg of botMessages.values()) {
                        await botMsg.delete();
                    }
                }
            }
        } catch (error) {
            throw error;
        }
    },
};