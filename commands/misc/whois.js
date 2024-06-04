// whois.js
const { EmbedBuilder } = require('discord.js');
const moment = require('moment');

module.exports = {
    name: 'whois',
    aliases: ['sinoka', 'sinosi', 'whodis', 'whothis', 'whou', 'whoyou'],
    description: 'Retrieves user information like join date, register date, roles, and permissions.',
    async execute(message, args) {
        try {
            let users = [];

            if (message.mentions.users.size) {
                users = message.mentions.users.map(user => user);
            } else if (args.length) {
                for (const arg of args) {
                    try {
                        const user = await message.client.users.fetch(arg);
                        users.push(user);
                    } catch (error) {
                        const embed = new EmbedBuilder()
                            .setColor('#F39C12')
                            .setDescription('<:error:1247140297784426567> Invalid user provided.');
                        return message.reply({ embeds: [embed] });
                    }
                }
            } else {
                users = [message.author];
            }

            const embeds = await Promise.all(users.map(async (user) => {
                let member;
                try {
                    member = await message.guild.members.fetch(user.id);
                } catch (error) {
                    member = null;
                }

                let roles = 'N/A';
                let permissions = 'N/A';
                let joinedAt = 'N/A';

                if (member) {
                    roles = member.roles.cache
                        .filter(role => role.name !== '@everyone')
                        .map(role => `<@&${role.id}>`)
                        .join(', ') || 'none';
                    permissions = member.permissions.toArray().join(', ') || 'none';
                    joinedAt = moment(member.joinedAt).format('ddd, MMM D, YYYY h:mm A');
                }

                const createdAt = moment(user.createdAt).format('ddd, MMM D, YYYY h:mm A');

                return new EmbedBuilder()
                    .setColor('#EBDCFA')
                    .setTitle(`${member ? member.displayName : user.username} (${user.username})`)
                    .setDescription(`${member || user}`)
                    .setThumbnail(user.displayAvatarURL())
                    .addFields(
                        { name: 'Joined', value: `${joinedAt}`, inline: true },
                        { name: 'Registered', value: `${createdAt}`, inline: true },
                        { name: `Roles`, value: roles },
                        { name: 'Permissions', value: permissions }
                    )
                    .setFooter({ text: `User ID: ${user.id}` })
                    .setTimestamp();
            }));

            message.reply({ embeds });
        } catch (error) {
            throw error;
        }
    },
};
