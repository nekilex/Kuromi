// ready.js
const { ActivityType } = require('discord.js');

module.exports = {
    ready: function (client) {
        console.log(`Logged in as ${client.user.tag}`);
        try {
            client.user.setActivity('to k!help ', { type: ActivityType.Listening });
            console.log('Activity set successfully!');
        } catch (error) {
            console.error('Error setting activity:', error);
        }
    }
};
