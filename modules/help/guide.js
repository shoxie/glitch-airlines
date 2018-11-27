/**
 * @file guide command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.exec = (Bastion, message) => {
  message.channel.send({
    embed: {
      color: Bastion.colors.GOLD,
      title: 'Kara Airlines',
      description: 'Need help installing and setting up Private Bot? No worries, we have made an amazing guide to help you out on that. And if you don\'t understand that or you need any more help or maybe if you just have a simple question, just join the The Council on Discord.',
      fields: [
        {
          name: 'Time Bureau Council',
          value: 'https://discord.gg/YDsHng6'
        }
      ]
    }
  }).catch(e => {
    Bastion.log.error(e);
  });
};

exports.config = {
  aliases: [],
  enabled: true
};

exports.help = {
  name: 'guide',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'guide',
  example: []
};
