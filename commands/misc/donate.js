/**
 * @file donate command
 * @author Kara
 * @license GPL-3.0
 */

exports.exec = async (Kara, message) => {
  await message.channel.send({
    embed: {
      color: Kara.colors.DARK_GREEN,
      title: 'Support Kara\'s development',
      description: '**Share your appreciation and get cool rewards!**' +
                   '\nDonate to support the development of Kara and keep it running forever.' +
                   '\n\nYou can donate via the methods below and get the rewards as mentioned in our Patreon tiers.',

      footer: {
        text: 'If everyone using Kara gave $1, we could keep Kara thriving for months to come.'
      }
    }
  });
};

exports.config = {
  aliases: [],
  enabled: true
};

exports.help = {
  name: 'donate',
  description: 'Instructions on how to financially support the development of the Kara Bot project.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'donate',
  example: []
};
