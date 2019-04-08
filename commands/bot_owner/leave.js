/**
 * @file leave command
 * @author Kara
 * @license GPL-3.0
 */

exports.exec = async (Kara, message, args) => {
  if (!(parseInt(args[0]) < 9223372036854775807)) {
    return Kara.emit('commandUsage', message, this.help);
  }

  let guild, found = true;
  if (Kara.shard) {
    guild = await Kara.shard.broadcastEval(`this.guilds.get('${args[0]}') && this.guilds.get('${args[0]}').leave().catch(e => this.log.error(e))`);
    guild = guild.filter(g => g);
    if (!guild.length) {
      found = false;
    }
  }
  else {
    guild = Kara.guilds.get(args[0]);
    if (!guild) {
      found = false;
    }
    await guild.leave();
  }

  if (found) {
    await message.channel.send({
      embed: {
        color: Kara.colors.RED,
        description: `I've left the${Kara.shard ? ' ' : ` **${guild.name}** `}Discord server with the ID **${args[0]}**.`
      }
    }).catch(e => {
      Kara.log.error(e);
    });
  }
  else {
    Kara.emit('error', '', Kara.i18n.error(message.guild.language, 'notFound', 'Discord server'), message.channel);
  }
};

exports.config = {
  aliases: [],
  enabled: true,
  ownerOnly: true
};

exports.help = {
  name: 'leave',
  description: 'Asks Kara to leave a specified server.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'leave <guild_id>',
  example: [ 'leave 441122339988775566' ]
};
