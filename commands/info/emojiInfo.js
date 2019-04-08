/**
 * @file emojiInfo command
 * @author Kara
 * @license GPL-3.0
 */

exports.exec = async (Kara, message, args) => {
  if (!args.length) {
    return Kara.emit('commandUsage', message, this.help);
  }

  args = args[0].split(':')[1];
  if (!args) {
    return Kara.emit('commandUsage', message, this.help);
  }
  args = message.guild.emojis.find(emoji => emoji.name === args);

  if (!args) {
    return Kara.emit('error', '', Kara.i18n.error(message.guild.language, 'notFound', 'emoji'), message.channel);
  }

  await message.channel.send({
    embed: {
      color: Kara.colors.BLUE,
      title: 'Emoji info',
      fields: [
        {
          name: 'Name',
          value: args.name,
          inline: true
        },
        {
          name: 'ID',
          value: args.id,
          inline: true
        },
        {
          name: 'Created At',
          value: args.createdAt.toUTCString(),
          inline: true
        }
      ],
      thumbnail: {
        url: args.url
      }
    }
  });
};

exports.config = {
  aliases: [ 'einfo' ],
  enabled: true
};

exports.help = {
  name: 'emojiInfo',
  description: 'Shows information of a specified emoji of your Discord server.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'emojiInfo <:emoji:>',
  example: [ 'emojiInfo :bastion:' ]
};
