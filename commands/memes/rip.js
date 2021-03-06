/**
 * @file rip command
 * @author Kara
 * @license GPL-3.0
 */

exports.exec = async (Kara, message, args) => {
  await message.channel.send({
    embed: {
      color: Kara.colors.BLUE,
      title: `R.I.P ${args.length ? args.join(' ') : 'Everything'}`,
      image: {
        url: 'https://resources.bastionbot.org/images/tombstone_rip.png'
      },
      footer: {
        text: 'May the Soul Rest in Peace.'
      }
    }
  });
};

exports.config = {
  aliases: [],
  enabled: true
};

exports.help = {
  name: 'rip',
  description: 'Show your condolences for something (or everything).',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'rip <text>',
  example: [ 'rip Grammar' ]
};
