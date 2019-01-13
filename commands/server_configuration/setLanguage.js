/**
 * @file setLanguage command
 * @author Kara
 * @license GPL-3.0
 */

exports.exec = async (Bastion, message, args) => {
  if (!args.name && !args.list) {
    return Bastion.emit('commandUsage', message, this.help);
  }

  if (args.list) {
    return await message.channel.send({
      embed: {
        color: Bastion.colors.BLUE,
        title: 'Available Languages',
        description: `Kara's translations are a community effort. If you want to see Kara translated into another language we'd love your help. Visit our [translation site](https://i18n.bastionbot.org) for more info.\n\nCurrenty it's available in the following languages:\n${Bastion.i18n._locales.join(', ').toUpperCase()}`
      }
    });
  }

  args.name = args.name.toLowerCase();
  if (args.name) {
    if (!Bastion.i18n._locales.includes(args.name)) {
      return Bastion.emit('error', '', Bastion.i18n.error(message.guild.language, 'notFound', 'Language Code'), message.channel);
    }

    await Bastion.database.models.guild.update({
      language: args.name
    },
    {
      where: {
        guildID: message.guild.id
      },
      fields: [ 'language' ]
    });

    await message.channel.send({
      embed: {
        color: Bastion.colors.GREEN,
        description: `Language for this server is now set to: \`${args.name.toUpperCase()}\` \n\nKara's translation is a community effort. So, some translations might not be accurate or complete, but you can improve them if you want in our [translation site](https://i18n.bastionbot.org).\nIf you help translate Bastion, you get a special **Translators** role and access to a secret channel for translators in Kara's offical Discord server: https://discord.gg/fzx8fkt`
      }
    }).catch(e => {
      Bastion.log.error(e);
    });
  }
};

exports.config = {
  aliases: [],
  enabled: true,
  argsDefinitions: [
    { name: 'name', type: String, defaultOption: true },
    { name: 'list', type: Boolean, alias: 'l' }
  ]
};

exports.help = {
  name: 'setLanguage',
  description: 'Sets %bastion%\'s language for the server.',
  botPermission: '',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'setLanguage < Language Code | --list>',
  example: [ 'setLanguage es' ]
};
