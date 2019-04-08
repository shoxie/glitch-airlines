/**
 * @file thisOrThat command
 * @author Kara
 * @license GPL-3.0
 */

const question = xrequire('./assets/thisOrThat.json');

exports.exec = async (Kara, message) => {
  await message.channel.send({
    embed: {
      color: Kara.colors.BLUE,
      description: question.getRandom()
    }
  });
};

exports.config = {
  aliases: [ 'thisthat' ],
  enabled: true
};

exports.help = {
  name: 'thisOrThat',
  description: 'Asks a this or that question. See how you and your friends choose!',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'thisOrThat',
  example: []
};
