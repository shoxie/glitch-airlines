/**
 * @file wouldYouRather command
 * @author Kara
 * @license GPL-3.0
 */

const question = xrequire('./assets/wouldYouRather.json');

exports.exec = async (Kara, message) => {
  await message.channel.send({
    embed: {
      color: Kara.colors.BLUE,
      description: question.getRandom()
    }
  });
};

exports.config = {
  aliases: [ 'wouldyou' ],
  enabled: true
};

exports.help = {
  name: 'wouldYouRather',
  description: 'Shows a would you rather situation. See how you and your friends answer that!',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'wouldYouRather',
  example: []
};
