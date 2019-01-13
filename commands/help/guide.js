/**
 * @file guide command
 * @author Kara
 * @license GPL-3.0
 */

exports.exec = async (Bastion, message) => {
  await message.channel.send({
    embed: {
      color: Bastion.colors.GOLD,
      title: 'Kara Bot',
      description: 'Need help installing and setting up Private Kara Bot? No worries, we have made an amazing guide to help you out on that. And if you don\'t understand that or you need any more help or maybe if you just have a simple question, just join the Kara HQ on Discord.',
      fields: [
        
        {
          name: 'Kara HQ Invite Link',
          value: 'https://discord.gg/fzx8fkt'
        }
      ]
    }
  });
};

exports.config = {
  aliases: [],
  enabled: true
};

exports.help = {
  name: 'guide',
  description: 'Shows you the guide on how to setup and install Private Kara Bot. And links to the Kara HQ.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'guide',
  example: []
};
