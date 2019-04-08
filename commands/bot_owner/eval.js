/**
 * @file eval command
 * @author Kara
 * @license GPL-3.0
 */

exports.exec = async (Kara, message, args) => {
  try {
    if (!args.code) {
      return Kara.emit('commandUsage', message, this.help);
    }

    args.code = args.code.join(' ');

    let evaled;
    if (args.broadcast && Kara.shard) {
      evaled = await Kara.shard.broadcastEval(args.code);
    }
    else {
      evaled = eval(args.code);
    }

    if (typeof evaled !== 'string') {
      evaled = xrequire('util').inspect(evaled);
    }

    let output = await message.channel.send({
      embed: {
        color: Kara.colors.GREEN,
        fields: [
          {
            name: ':inbox_tray:  INPUT',
            value: `\`\`\`js\n${args.code}\n\`\`\``
          },
          {
            name: ':outbox_tray:  OUTPUT',
            value: `\`\`\`js\n${clean(Kara, evaled)}\n\`\`\``
          }
        ]
      }
    });

    if (args.delete) {
      output.delete(10000).catch(() => {});
      message.delete(1000).catch(() => {});
    }
  }
  catch(e) {
    let error = await message.channel.send({
      embed: {
        color: Kara.colors.RED,
        fields: [
          {
            name: ':no_entry:  ERROR',
            value: `\`\`\`js\n${clean(Kara, e)}\n\`\`\``
          }
        ]
      }
    });

    if (args.delete) {
      error.delete(10000).catch(() => {});
      message.delete(1000).catch(() => {});
    }
  }
};

exports.config = {
  aliases: [],
  enabled: true,
  argsDefinitions: [
    { name: 'code', type: String, multiple: true, defaultOption: true },
    { name: 'broadcast', type: Boolean },
    { name: 'delete', type: Boolean }
  ],
  ownerOnly: true
};

exports.help = {
  name: 'eval',
  description: 'Evaluates JavaScript code.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'eval <JavaScript code> [--delete]',
  example: [ 'eval message.guild.members.size', 'eval Kara.users.size --delete' ]
};

/**
 * Cleans the evaled result from tokens, etc.
 * @function clean
 * @param {object} Kara The Kara object.
 * @param {string} text The evaled result/error before cleaning.
 * @returns {string} The evaled result/error after cleaning.
 */
function clean(Kara, text) {
  text = text.toString();
  if (text.includes(Kara.token)) {
    text = text.replace(Kara.token, 'Not for your evil :eyes:!');
  }
  if (typeof(text) === 'string') {
    return text.replace(/`/g, `\`${String.fromCharCode(8203)}`).replace(/@/g, `@${String.fromCharCode(8203)}`);
  }
  return text;
}
