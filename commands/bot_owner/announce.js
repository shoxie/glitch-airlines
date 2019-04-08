/**
 * @file announce command
 * @author Kara
 * @license GPL-3.0
 */

exports.exec = async (Kara, message, args) => {
  if (!args.length) {
    return Kara.emit('commandUsage', message, this.help);
  }

  let guildModels = await Kara.database.models.guild.findAll({
    attributes: [ 'announcementChannel' ]
  });

  let announcementChannels = guildModels.filter(guildModel => guildModel.dataValues.announcementChannel).map(guildModel => guildModel.dataValues.announcementChannel);
  let announcementMessage = args.join(' ');

  for (let channel of announcementChannels) {
    if (Kara.shard) {
      await Kara.shard.broadcastEval(`
        let channel = this.channels.get('${channel}');
        if (channel) {
          channel.send({
            embed: {
              color: this.colors.BLUE,
              description: \`${announcementMessage}\`
            }
          }).catch(this.log.error);
        }
      `);
    }
    else {
      await Kara.channels.get(channel).send({
        embed: {
          color: Kara.colors.BLUE,
          description: announcementMessage
        }
      }).catch(() => {});
    }
  }

  await message.channel.send({
    embed: {
      color: Kara.colors.GREEN,
      title: 'Announced',
      description: announcementMessage
    }
  }).catch(e => {
    Kara.log.error(e);
  });
};

exports.config = {
  aliases: [ 'notify' ],
  enabled: true,
  ownerOnly: true
};

exports.help = {
  name: 'announce',
  description: 'Send a message to announcement channel of all the servers Kara is connected to.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'announce <message>',
  example: [ 'announce Just a random announcement.' ]
};
