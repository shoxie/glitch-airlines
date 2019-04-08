/**
 * @file deleteAllTriggers command
 * @author Kara
 * @license GPL-3.0
 */

exports.exec = async (Kara, message) => {
  await Kara.database.models.trigger.destroy({
    where: {
      guildID: message.guild.id
    }
  });

  await message.channel.send({
    embed: {
      color: Kara.colors.RED,
      description: 'Deleted all the triggers and responses.'
    }
  }).catch(e => {
    Kara.log.error(e);
  });
};

exports.config = {
  aliases: [ 'delalltriggers', 'deletealltrips', 'delalltrips' ],
  enabled: true
};

exports.help = {
  name: 'deleteAllTriggers',
  description: 'Deletes all the triggers and responses you have set.',
  botPermission: '',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'deleteAllTriggers',
  example: []
};
