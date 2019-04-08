module.exports = function (client, config) {

    const { RichEmbed } = require('discord.js');
    const utility = require('./utility.js');
    // Set the bot's presence (activity and status)
    client.on("ready", () => {
        console.log(`Logged in as ${client.user.tag}!`);
        client.user.setPresence({
            game: {
                name: 'Bot work',
                type: 'PLAYING'
            },
            status: 'online'
        });
    })

    var myInter;
    client.on('message', msg => {
        var messageArray = msg.content.split(" ");
        var command = messageArray[0];

        if (command === config.prefix + 'help') {
            var embed = new RichEmbed()
                .setTitle("List of command:")
                .setColor('#ffa500')
                .addField(config.prefix + "stats", "Your stats on Discord")
                .addField(config.prefix + "autonews", "Auto get news from vnexpress")
                .addField(config.prefix + "stopnews", "Stop get news from vnexpress")
                .addField(config.prefix + "chess [Steam Username or steamID64]", "Get player's Dota2AutoChess stats");
            msg.channel.send(embed);
        }

        if (command === config.prefix + 'stats') {
            utility.getStats('', msg);
        }

        if (command === config.prefix + 'chess') {
            var args = messageArray.slice(1).join(" ");
            utility.getChess(args, msg);
        }

        if (command === config.prefix + 'autonews') {
            myInter = setInterval(async function () {
                await utility.sendNews(msg);
                utility.updateNews()
            }, config.timer);
        }

        if (command === config.prefix + 'stopnews') {
            clearInterval(myInter);
        }
    });
}