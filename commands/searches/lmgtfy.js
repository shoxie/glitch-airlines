/**
 * @file lmgtfy command
 * @author Kara
 * @license GPL-3.0
 */

exports.exec = async (Kara, message, args) => {
  if (!args.length) {
    return Kara.emit('commandUsage', message, this.help);
  }

  await message.channel.send({
    embed: {
      color: Kara.colors.BLUE,
      title: 'Let me search that for you:',
      description: `https://lmgtfy.com/?s=d&q=${encodeURIComponent(args.join(' '))}`,
      footer: {
        text: 'Powered by lmgtfy'
      }
    }
  });
};

exports.config = {
  aliases: [ 'lmstfy', 'lmdtfy' ],
  enabled: true
};

exports.help = {
  name: 'lmgtfy',
  description: 'Teach users how to do an internet search and get answers to their questions.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'lmgtfy <text>',
  example: [ 'lmgtfy How to shutdown a computer?' ]
};
