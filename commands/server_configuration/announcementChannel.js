/**
 * @file announcementChannel command
 * @author Kara
 * @license GPL-3.0
 */

exports.exec = async (Kara, message, args) => {
  let description, color;

  if (args.remove) {
    await Kara.database.models.guild.update({
      announcementChannel: null
    },
    {
      where: {
        guildID: message.guild.id
      },
      fields: [ 'announcementChannel' ]
    });
    description = Kara.i18n.info(message.guild.language, 'disableAnnouncementChannel', message.author.tag);
    color = Kara.colors.RED;
  }
  else {
    await Kara.database.models.guild.update({
      announcementChannel: message.channel.id
    },
    {
      where: {
        guildID: message.guild.id
      },
      fields: [ 'announcementChannel' ]
    });
    description = Kara.i18n.info(message.guild.language, 'enableAnnouncementChannel', message.author.tag);
    color = Kara.colors.GREEN;
  }

  await message.channel.send({
    embed: {
      color: color,
      description: description
    }
  }).catch(e => {
    Kara.log.error(e);
  });
};

exports.config = {
  aliases: [],
  enabled: true,
  argsDefinitions: [
    { name: 'remove', type: Boolean, alias: 'r' }
  ]
};

exports.help = {
  name: 'announcementChannel',
  description: 'Adds/removes an announcement channel. You will receive announcements made by the bot owner in this channel.',
  botPermission: '',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'announcementChannel [--remove]',
  example: [ 'announcementChannel', 'announcementChannel --remove' ]
};
