/**
 * @file serverID command
 * @author Kara
 * @license GPL-3.0
 */

exports.exec = async (Bastion, message) => {
  await message.channel.send({
    embed: {
      color: Bastion.colors.BLUE,
      title: 'Server ID',
      description: message.guild.id
    }
  });
};

exports.config = {
  aliases: [ 'sid' ],
  enabled: true
};

exports.help = {
  name: 'serverID',
  description: 'Shows the ID of your Discord server.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'serverID',
  example: []
};
