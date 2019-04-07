const fs = require('fs');
const cheerio = require('cheerio');
const request = require("request");
const convert = require('xml-js');
const { RichEmbed } = require('discord.js');
//const config = require('./config.json');


exports.exec = (Bastion, message, args) => {
    getSteam(args);


    function getSteam(username, args) {
        var options = {
            getID64URL: "http://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=669019B4CBEEAF255DF849BD8BD295FC&vanityurl=",
            getDAC: "http://autochess.varena.com/api/autochess/player/",
        }
        request(options.getID64URL + args, function (error, response, body) {
            body = JSON.parse(body).response;
            if (body.success == 1) {
                var steamid64 = body.steamid;
                var steamid32 = steamID64toSteamID32(steamid64);
                request(options.getDAC + steamid32 + '/overview', function (err, response, body) {

                    var body = JSON.parse(body).data;
                    console.log(body)
                    if (body) {
                        const embed = new RichEmbed()
                            .setTitle(`Stats for ${message.author.username} :`)
                            .setColor(getRandomColor())
                            .addField("Rank/Max Rank:", getRank(body.current_level) + '/' + getRank(body.highest_level), true)
                            .addField("Avg Rank:", Math.round(body.avg_rank * 100) / 100, true)
                            .addField("Total Games:", body.total_games, true)
                            .addField("Top 1:", body.win_games, true)
                            .addField("Top 3:", body.top3_games, true)
                            .addField("Total candies:", body.total_candies, true)
                            .setFooter("Th1nhNg0_bot Autochess Stats");
                        message.channel.send(embed);
                    }
                    else message.channel.send("```SORRY,SOMETHING WENT WRONG```");
                    console.log(error)
                });
            }
            else message.channel.send("```ERROR, CANT FIND USER\n PLEASE USE YOUR USERNAME```");
        });
    }

    function steamID64toSteamID32(steamID64) {
        return Number(steamID64.substr(-16, 16)) - 6561197960265728
    }

    function getRank(number) {
        var rank = ["Pawn", "Knight", "Bishop", "Castle", "Castle", "Castle", "King", "Queen"];
        var tier = Math.floor(number / 10);
        return rank[tier] + " " + (number % 10 + 1);
    }

    function getRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) { color += letters[Math.floor(Math.random() * 16)]; }
        return color;
    }

    function convert_data(data) {
        const $ = cheerio.load(data);
        var link = $('a').first().attr('href');
        var desc = $.text();
        return { link, desc }
    }
}
exports.config = {
    aliases: ['atc'],
    enabled: true
};

exports.help = {
    name: 'autochess',
    botPermission: '',
    userTextPermission: '',
    userVoicePermission: '',
    usage: 'autochess',
    example: []
};
