// purge.js
module.exports = {
    name: 'purge',
    aliases: ['nuke', 'tnt', 'boom'],
    description: 'Deletes messages in the current or a specific channel.',
    execute(message, args) {
        try {
            let channel = message.channel;
            let amount;
            
            if (args.length === 2 && message.mentions.channels.first()) {
                channel = message.mentions.channels.first();
                amount = parseInt(args[1]);
            }

            else if (message.guild.channels.cache.find(ch => ch.name === args[0])) {
                channel = message.guild.channels.cache.find(ch => ch.name === args[0]);
                amount = parseInt(args[1]);
            }

            else if (message.guild.channels.cache.find(ch => ch.name === args[1])) {
                channel = message.guild.channels.cache.find(ch => ch.name === args[1]);
                amount = parseInt(args[0]);
            }

            else if (args.length === 1) {
                amount = parseInt(args[0]);
            }

            if (!amount || isNaN(amount)) {
                amount = 100;
            }
            
            channel.bulkDelete(amount)
            .then(messages => {
                message.channel.send(`Successfully deleted ${messages.size} messages from ${channel}.`)
                    .then(msg => {
                        setTimeout(() => {
                            msg.delete();
                        }, 5000);
                    });
            })
            .catch(error => {
                console.error('Error purging messages:', error);
                message.channel.send('Error purging messages.');
            });
        } catch (error) {
            throw error;
        }
    },
};
