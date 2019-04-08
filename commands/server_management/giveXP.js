/**
 * @file giveXP command
 * @author Kara
 * @license GPL-3.0
 */

exports.exec = async (Kara, message, args) => {
  if (!args.id || !args.points) {
    return Kara.emit('commandUsage', message, this.help);
  }

  if (message.mentions.users.size) {
    args.id = message.mentions.users.first().id;
  }

  let guildMemberModel = await Kara.database.models.guildMember.findOne({
    attributes: [ 'experiencePoints' ],
    where: {
      userID: args.id,
      guildID: message.guild.id
    }
  });
  if (!guildMemberModel) {
    return Kara.emit('error', '', Kara.i18n.error(message.guild.language, 'profileNotCreated', `<@${args.id}>`), message.channel);
  }

  args.points = `${parseInt(guildMemberModel.dataValues.experiencePoints) + parseInt(args.points)}`;

  await Kara.database.models.guildMember.update({
    experiencePoints: args.points
  },
  {
    where: {
      userID: args.id,
      guildID: message.guild.id
    },
    fields: [ 'experiencePoints' ]
  });

  await message.channel.send({
    embed: {
      color: Kara.colors.GREEN,
      description: `<@${args.id}> has been awarded with **${args.points}** experience points.`
    }
  }).catch(e => {
    Kara.log.error(e);
  });
};

exports.config = {
  aliases: [],
  enabled: true,
  guildOwnerOnly: true,
  argsDefinitions: [
    { name: 'id', type: String, defaultOption: true },
    { name: 'points', alias: 'n', type: String }
  ]
};

exports.help = {
  name: 'giveXP',
  description: 'Give the specified amount of experience points to the specified user and increase their level.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'giveXP <@USER_MENTION | USER_ID> <-n POINTS>',
  example: [ 'giveXP @user#0001 -n 100', 'giveXP 242621467230268813 -n 150' ]
};
