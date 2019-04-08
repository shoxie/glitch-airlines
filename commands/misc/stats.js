/**
 * @file stats command
 * @author Kara
 * @license GPL-3.0
 */

exports.exec = async (Kara, message) => {
  let owners = [];
  for (let userID of Kara.credentials.ownerId) {
    let user = await Kara.fetchUser(userID).catch(() => {});
    owners.push(user.tag);
  }

  let shardStats = Kara.shard ? await Kara.shard.broadcastEval('this.uptime') : 'None';
  if (shardStats instanceof Array) {
    shardStats = shardStats.length === Kara.shard.count ? 'All shards online' : `Launched ${shardStats.length} / ${Kara.shard.count} shards`;
  }

  let uptime = Kara.shard ? await Kara.shard.broadcastEval('this.uptime') : Kara.uptime;
  if (uptime instanceof Array) {
    uptime = uptime.reduce((max, cur) => Math.max(max, cur), -Infinity);
  }
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

  let guilds = Kara.shard ? await Kara.shard.broadcastEval('this.guilds.size') : Kara.guilds.size;
  if (guilds instanceof Array) {
    guilds = guilds.reduce((sum, val) => sum + val, 0);
  }
  let textChannels = Kara.shard ? await Kara.shard.broadcastEval('this.channels.filter(channel => channel.type === \'text\').size') : Kara.channels.filter(channel => channel.type === 'text').size;
  if (textChannels instanceof Array) {
    textChannels = textChannels.reduce((sum, val) => sum + val, 0);
  }
  let voiceChannels = Kara.shard ? await Kara.shard.broadcastEval('this.channels.filter(channel => channel.type === \'voice\').size') : Kara.channels.filter(channel => channel.type === 'voice').size;
  if (voiceChannels instanceof Array) {
    voiceChannels = voiceChannels.reduce((sum, val) => sum + val, 0);
  }
  let rss = Kara.shard ? await Kara.shard.broadcastEval('process.memoryUsage().rss') : process.memoryUsage().rss;
  if (rss instanceof Array) {
    rss = rss.reduce((sum, val) => sum + val, 0);
  }
  let heapUsed = Kara.shard ? await Kara.shard.broadcastEval('process.memoryUsage().heapUsed') : process.memoryUsage().heapUsed;
  if (heapUsed instanceof Array) {
    heapUsed = heapUsed.reduce((sum, val) => sum + val, 0);
  }

  await message.channel.send({
    embed: {
      color: Kara.colors.BLUE,
      author: {
        name: `Kara ${Kara.package.version}`
      },
      url: Kara.package.url,
      fields: [
        {
          name: 'Author',
          value: `[${Kara.package.author}](${Kara.package.authorUrl})`,
          inline: true
        },
        {
          name: 'BOT ID',
          value: Kara.credentials.botId,
          inline: true
        },
        {
          name: `Owner${Kara.credentials.ownerId.length > 1 ? 's' : ''}`,
          value: owners.join('\n'),
          inline: true
        },
        {
          name: `Owner ID${Kara.credentials.ownerId.length > 1 ? 's' : ''}`,
          value: Kara.credentials.ownerId.join('\n'),
          inline: true
        },
        {
          name: 'Default Prefixes',
          value: Kara.configurations.prefix.join(' '),
          inline: true
        },
        {
          name: 'Uptime',
          value: uptime,
          inline: true
        },
        {
          name: 'Shards',
          value: Kara.shard ? `${Kara.shard.count} Shards` : 'None',
          inline: true
        },
        {
          name: 'Shard Status',
          value: shardStats,
          inline: true
        },
        {
          name: 'Presence',
          value: `${guilds.toHumanString()} Servers\n`
          + `${textChannels.toHumanString()} Text Channels\n`
          + `${voiceChannels.toHumanString()} Voice Channels`,
          inline: true
        },
        {
          name: 'Memory',
          value: `${(rss / 1024 / 1024).toFixed(2)} MB RSS\n`
                 + `${(heapUsed / 1024 / 1024).toFixed(2)} MB Heap`,
          inline: true
        }
      ],
      thumbnail: {
        url: Kara.user.displayAvatarURL
      },
      footer: {
        text: `${Kara.shard ? `Shard: ${Kara.shard.id} • ` : ''}WebSocket PING: ${parseInt(Kara.ping)}ms`
      },
      timestamp: new Date()
    }
  });
};

exports.config = {
  aliases: [ 'info' ],
  enabled: true
};

exports.help = {
  name: 'stats',
  description: 'Shows detailed stats and info of %bastion%.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'stats',
  example: []
};
