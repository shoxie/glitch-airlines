/**
 * @file xp command
 * @author Kara
 * @license GPL-3.0
 */

exports.exec = async (Kara, message, args) => {
  args = message.mentions.users.first() || message.author;

  let guildMemberModel = await Kara.database.models.guildMember.findOne({
    attributes: [ 'experiencePoints', 'level' ],
    where: {
      userID: args.id,
      guildID: message.guild.id
    }
  });
  let level = 0, xp = 0;

  if (guildMemberModel) {
    level = guildMemberModel.dataValues.level;
    xp = guildMemberModel.dataValues.experiencePoints;
  }

  let description = message.author.id === args.id ? `**${args.tag}** you have collected **${xp}** experience points out of ${Kara.methods.getRequiredExpForLevel(parseInt(level, 10) + 1)} that you can acquire in this level.` : `**${args.tag}** has collected **${xp}** experience points.`;

  message.channel.send({
    embed: {
      color: Kara.colors.BLUE,
      description: description
    }
  });
};

exports.config = {
  aliases: [],
  enabled: true
};

exports.help = {
  name: 'xp',
  description: 'Shows the experience points of the specified user\'s account.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'xp [@user-mention]',
  example: [ 'xp', 'xp @user#0001' ]
};
