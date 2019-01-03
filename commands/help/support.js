/**
 * @file support command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (Bastion, message) => {
  await message.channel.send({
    embed: {
      color: Bastion.colors.GOLD,
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
