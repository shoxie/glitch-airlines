/**
 * @file filterMentionSpam command
 * @author Kara
 * @license GPL-3.0
 */

exports.exec = async (Kara, message, args) => {
  args.amount = Math.abs(args.amount);

  let color, mentionSpamStats;
  if (args.amount) {
    if (!args.action || ![ 'kick', 'ban' ].includes(args.action = args.action.toLowerCase())) {
      args.action = null;
    }

    await Kara.database.models.guild.update({
      filterMentions: true,
      mentionSpamThreshold: args.amount,
      mentionSpamAction: args.action
    },
    {
      where: {
        guildID: message.guild.id
      },
      fields: [ 'filterMentions', 'mentionSpamThreshold', 'mentionSpamAction' ]
    });

    color = Kara.colors.GREEN;
    mentionSpamStats = Kara.i18n.info(message.guild.language, 'enableMentionSpamFilter', message.author.tag, args.amount, args.action);
  }
  else {
    await Kara.database.models.guild.update({
      filterMentions: false,
      mentionSpamThreshold: null,
      mentionSpamAction: null
    },
    {
      where: {
        guildID: message.guild.id
      },
      fields: [ 'filterMentions', 'mentionSpamThreshold', 'mentionSpamAction' ]
    });
    color = Kara.colors.RED;
    mentionSpamStats = Kara.i18n.info(message.guild.language, 'disableMentionSpamFilter', message.author.tag);
  }

  await message.channel.send({
    embed: {
      color: color,
      description: mentionSpamStats
    }
  }).catch(e => {
    Kara.log.error(e);
  });
};

exports.config = {
  aliases: [],
  enabled: true,
  argsDefinitions: [
    { name: 'amount', type: Number, defaultOption: true },
    { name: 'action', type: String, alias: 'a' }
  ]
};

exports.help = {
  name: 'filterMentionSpam',
  description: 'Toggles filtering of mention spams in the server and also set the threshold and action to be taken.',
  botPermission: '',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'filterMentionSpam [ MENTION_THRESHOLD [ --action KICK|BAN ] ]',
  example: [ 'filterMentionSpam 5', 'filterMentionSpam 5 --action kick', 'filterMentionSpam' ]
};
