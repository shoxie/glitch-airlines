/**
 * @file support command
 * @author Kara
 * @license GPL-3.0
 */

exports.exec = async (Kara, message) => {
  await message.channel.send({
    embed: {
      color: Kara.colors.GOLD,
      title: 'Kara Airlines',
      url: 'https://discord.gg/ZyBEENv',
      description: 'Need help or support with Kara Discord Bot?\nJoin Kara Support Server for any help you need.\nhttps://discord.gg/ZyBEENv',
    }
  });
};

exports.config = {
  aliases: [ 'ss' ],
  enabled: true
};

exports.help = {
  name: 'support',
  description: 'Sends the invite link to Kara HQ.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'support',
  example: []
};
