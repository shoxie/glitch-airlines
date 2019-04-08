/**
 * @file createCategory command
 * @author Kara
 * @license GPL-3.0
 */

exports.exec = async (Kara, message, args) => {
  if (!args.name) {
    return Kara.emit('commandUsage', message, this.help);
  }

  let minLength = 2, maxLength = 100;
  args.name = args.name.join(' ');

  if (!args.name.length.inRange(minLength, maxLength)) {
    return Kara.emit('error', '', Kara.i18n.error(message.guild.language, 'channelNameLength', minLength, maxLength), message.channel);
  }

  let category = await message.guild.createChannel(args.name, 'category');

  await message.channel.send({
    embed: {
      color: Kara.colors.GREEN,
      description: Kara.i18n.info(message.guild.language, 'createChannel', message.author.tag, 'category', category.name),
      footer: {
        text: `ID: ${category.id}`
      }
    }
  }).catch(e => {
    Kara.log.error(e);
  });
};

exports.config = {
  aliases: [],
  enabled: true,
  argsDefinitions: [
    { name: 'name', type: String, multiple: true, defaultOption: true }
  ]
};

exports.help = {
  name: 'createCategory',
  description: 'Creates a new channel category on your Discord server.',
  botPermission: 'MANAGE_CHANNELS',
  userTextPermission: 'MANAGE_CHANNELS',
  userVoicePermission: '',
  usage: 'createCategory <Category Name>',
  example: [ 'createCategory News Feed' ]
};
