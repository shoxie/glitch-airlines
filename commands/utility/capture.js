/**
 * @file capture command
 * @author Kara
 * @license GPL-3.0
 */

exports.exec = async (Kara, message, args) => {
  if (!args.url) {
    return Kara.emit('commandUsage', message, this.help);
  }

  if (!/^(http[s]?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&/=]*)$/.test(args.url)) {
    return Kara.emit('error', '', Kara.i18n.error(message.guild.language, 'invalidInput', 'URL'), message.channel);
  }

  let webshot = await Kara.methods.makeBWAPIRequest('/url/capture', {
    encoding: null,
    qs: {
      url: args.url
    }
  });

  webshot = Buffer.from(webshot);

  await message.channel.send({
    files: [ { attachment: webshot, name: 'capture.png' } ]
  });
};

exports.config = {
  aliases: [],
  enabled: true,
  argsDefinitions: [
    { name: 'url', type: String, defaultOption: true }
  ]
};

exports.help = {
  name: 'capture',
  description: 'Captures a screenshot of the specified webpage.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'capture <url>',
  example: [ 'capture https://bastionbot.org' ]
};
