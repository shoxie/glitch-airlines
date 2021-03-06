/**
 * @file shardStats command
 * @author Kara
 * @license GPL-3.0
 */

exports.exec = async (Kara, message) => {
  if (!Kara.shard) {
    return Kara.emit('error', '', 'Kara is not sharded. Run Kara using the sharding manager.', message.channel);
  }

  let uptime = Kara.uptime;
  let seconds = uptime / 1000;
  let days = parseInt(seconds / 86400);
  seconds = seconds % 86400;
  let hours = parseInt(seconds / 3600);
  seconds = seconds % 3600;
  let minutes = parseInt(seconds / 60);
  seconds = parseInt(seconds % 60);

  uptime = `${seconds}s`;
  if (days) {
    uptime = `${days}d ${hours}h ${minutes}m ${seconds}s`;
  }
  else if (hours) {
    uptime = `${hours}h ${minutes}m ${seconds}s`;
  }
  else if (minutes) {
    uptime = `${minutes}m ${seconds}s`;
  }

  await message.channel.send({
    embed: {
      color: Kara.colors.BLUE,
      title: 'Shard Stats',
      url: Kara.package.url,
      fields: [
        {
          name: 'Shard ID',
          value: Kara.shard.id,
          inline: true
        },
        {
          name: 'Uptime',
          value: uptime,
          inline: true
        },
        {
          name: 'WebSocket PING',
          value: `${Kara.ping.toFixed(2)}ms`,
          inline: true
        },
        {
          name: 'Presence',
          value: `${Kara.guilds.size.toHumanString()} Servers\n`
          + `${Kara.channels.filter(channel => channel.type === 'text').size.toHumanString()} Text Channels\n`
          + `${Kara.channels.filter(channel => channel.type === 'voice').size.toHumanString()} Voice Channels`,
          inline: true
        },
        {
          name: 'Memory',
          value: `${(process.memoryUsage().rss / 1024 / 1024).toFixed(2)} MB RSS\n`
                 + `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB Heap`,
          inline: true
        }
      ],
      footer: {
        text: `Total Shards: ${Kara.shard.count}`
      },
      timestamp: new Date()
    }
  });
};

exports.config = {
  aliases: [ 'shard' ],
  enabled: true
};

exports.help = {
  name: 'shardStats',
  description: 'Shows detailed stats and info of the shard the command was used in.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'shardStats',
  example: []
};
