const SteamAPI = require('steamapi');
const steam = new SteamAPI('A015BD59C8443361D9862C819B3C718A');
exports.exec = async (Kara, message) => {
    var steamProfile = 'https://steamcommunity.com/id/'+args;
    let steamID;
    steam.resolve(steamProfile).then(id => {
    var id = steamID;
    message.channel.send({
        title: 'SteamID found',
        color: 2ecc71,
        description: id
    });
    steam.getUserSummary(steamID).then(summary => {
        console.log(summary);
});
}
}
exports.config = {
    aliases: [],
    enabled: true
  };
  
exports.help = {
    name: 'steam',
    description: 'Shows steam stats of a user.',
    botPermission: '',
    userTextPermission: '',
    userVoicePermission: '',
    usage: 'steam [username]',
    example: []
  };