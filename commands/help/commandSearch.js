/**
 * @file commandSearch command
 * @author Kara
 * @license GPL-3.0
 */

exports.exec = async (Kara, message, args) => {
  if (!args.length || args.join('').length < 2) {
    return Kara.emit('commandUsage', message, this.help);
  }

  args = args.join('').toLowerCase();
  let commands = Kara.commands.map(c => c.help.name.toLowerCase()).filter(c => c.includes(args));
  if (commands.length === 0) {
    return Kara.emit('error', '', Kara.i18n.error(message.guild.language, 'notFound', 'command'), message.channel);
  }

  await message.channel.send({
    embed: {
      color: Kara.colors.GOLD,
      title: 'Command Search',
      description: `Found ${commands.length} commands containing *${args}*.`,
      fields: [
        {
          name: 'Commands',
          value: `${message.guild.prefix[0]}${commands.join(`\n${message.guild.prefix[0]}`)}`
        }
      ]
    }
  });
};

exports.config = {
  aliases: [ 'cmdsearch' ],
  enabled: true
};

exports.help = {
  name: 'commandSearch',
  description: 'Search for a command with the given text.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'commandSearch <keyword>',
  example: [ 'commandSearch user' ]
};
