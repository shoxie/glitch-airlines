/**
 * @file support command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.exec = (Bastion, message) => {
  message.channel.send({
    embed: {
      color: Bastion.colors.GOLD,
      title: 'Time Bureau Council',
      url: 'https://discord.gg/YDsHng6',
      description: 'Need help or support with Bastion Discord Bot?\nJoin The Council for any help you need.\nhttps://discord.gg/YDsHng6',
      
    }
  }).catch(e => {
    Bastion.log.error(e);
  });
};

exports.config = {
  aliases: [ 'ss' ],
  enabled: true
};

exports.help = {
  name: 'support',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'support',
  example: []
};
