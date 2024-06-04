// 200.js
module.exports = {
    name: '200',
    async execute(message) {
        try {
            const promises = [];
            for (let i = 1; i <= 200; i++) {
                promises.push(message.channel.send(i.toString()));
            }
            await Promise.all(promises);
        } catch (error) {
            throw error;
        }
    }
};
