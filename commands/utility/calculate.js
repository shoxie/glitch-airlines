/**
 * @file calculate command
 * @author Kara
 * @license GPL-3.0
 */

const mathjs = xrequire('mathjs');

exports.exec = async (Kara, message, args) => {
  if (!args.length) {
    return Kara.emit('commandUsage', message, this.help);
  }

  try {
    await message.channel.send({
      embed: {
        color: Kara.colors.BLUE,
        title: 'Result:',
        description: mathjs.eval(args.join(' ')).toFixed(2)
      }
    });
  }
  catch (error) {
    return Kara.emit('error', '', Kara.i18n.error(message.guild.language, 'invalidInput', 'mathematical expression'), message.channel);
  }
};

exports.config = {
  aliases: [ 'calc' ],
  enabled: true
};

exports.help = {
  name: 'calculate',
  description: 'Evaluates any mathematical expression.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'calculate <mathematical_expression>',
  example: [ 'calculate 9 * 10 - 11' ]
};
