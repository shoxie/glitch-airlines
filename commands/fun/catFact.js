/**
 * @file catFact command
 * @author Kara
 * @license GPL-3.0
 */

const catFacts = xrequire('./assets/catFacts.json');

exports.exec = async (Kara, message) => {
  await message.channel.send({
    embed: {
      color: Kara.colors.BLUE,
      title: 'Cat Fact',
      description: catFacts.getRandom()
    }
  });
};

exports.config = {
  aliases: [],
  enabled: true
};

exports.help = {
  name: 'catFact',
  description: 'Shows a random fact about cats.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'catfact',
  example: []
};
