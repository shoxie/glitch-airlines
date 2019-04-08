/**
 * @file fortnite command
 * @author Kara
 * @license GPL-3.0
 */

const request = xrequire('request-promise-native');

exports.exec = async (Kara, message, args) => {
  if (!args.player) {
    return Kara.emit('commandUsage', message, this.help);
  }

  // If user doesn't provide the platform, default to PC
  if (!args.platform) {
    args.platform = 'pc';
  }
  else {
    let platforms = [ 'pc', 'xbl', 'psn' ]; // Available platforms for the game
    // If the platform is not valid, return the available platforms
    if (!platforms.includes(args.platform = args.platform.toLowerCase())) {
      return Kara.emit('error', '', Kara.i18n.error(message.guild.language, 'invalidPlatform', `${platforms.join(', ').toUpperCase()}`), message.channel);
    }
  }

  let options = {
    uri: `https://api.fortnitetracker.com/v1/profile/${args.platform}/${encodeURIComponent(args.player.join(' '))}`,
    headers: {
      'TRN-Api-Key': Kara.credentials.fortniteAPIKey,
      'User-Agent': `Kara/${Kara.package.version} (${Kara.user.tag}; ${Kara.user.id}) https://bastionbot.org`
    },
    json: true
  };

  let player = await request(options);
  if (player.error) {
    return Kara.emit('error', 'Error', player.error, message.channel);
  }

  let stats = player.lifeTimeStats.map(stat => {
    return {
      name: stat.key,
      value: stat.value,
      inline: true
    };
  });

  await message.channel.send({
    embed: {
      color: Kara.colors.BLUE,
      author: {
        name: player.epicUserHandle
      },
      title: `Fortnite Stats - ${player.platformNameLong}`,
      fields: stats,
      thumbnail: {
        url: 'https://i.imgur.com/dfgwClZ.jpg'
      },
      footer: {
        text: 'Powered by Tracker Network'
      }
    }
  });
};

exports.config = {
  aliases: [],
  enabled: true,
  argsDefinitions: [
    { name: 'player', type: String, multiple: true, defaultOption: true },
    { name: 'platform', type: String, alias: 'p', defaultValue: 'PC' }
  ]
};

exports.help = {
  name: 'fortnite',
  description: 'Get stats of any Fortnite player.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'fortnite <EPIC_NICKNAME> [ -p <PLATFORM> ]',
  example: [ 'fortnite k3rn31 -p PC' ]
};
