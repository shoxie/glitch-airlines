/**
 * @file deleteTrigger command
 * @author Kara
 * @license GPL-3.0
 */

exports.exec = async (Kara, message, args) => {
  if (!args[0]) {
    return Kara.emit('commandUsage', message, this.help);
  }

  await Kara.database.models.trigger.destroy({
    where: {
      trigger: args.join(' '),
      guildID: message.guild.id
    }
  });

  await message.channel.send({
    embed: {
      color: Kara.colors.RED,
      title: 'Trigger deleted',
      description: args.join(' ')
    }
  }).catch(e => {
    Kara.log.error(e);
  });
};

exports.config = {
  aliases: [ 'deltrigger', 'deletetrip', 'deltrip' ],
  enabled: true
};

exports.help = {
  name: 'deleteTrigger',
  description: 'Deletes the specified message trigger.',
  botPermission: '',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'deleteTrigger <trigger>',
  example: [ 'deleteTrigger Hi, there?' ]
};
