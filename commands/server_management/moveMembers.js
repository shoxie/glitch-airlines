/**
 * @file moveMembers command
 * @author Kara
 * @license GPL-3.0
 */

exports.exec = async (Kara, message, args) => {
  if (!args.from || !args.to) {
    return Kara.emit('commandUsage', message, this.help);
  }


  let voiceChannels = message.guild.channels.filter(channel => channel.type === 'voice');
  let sourceVoiceChannel = voiceChannels.get(args.from);
  let destinationVoiceChannel = voiceChannels.get(args.to);

  if (!sourceVoiceChannel || !destinationVoiceChannel) {
    return Kara.emit('error', '', 'Invalid voice channel(s). Please recheck the IDs of the Voice Channels.', message.channel);
  }

  if (!sourceVoiceChannel.permissionsFor(message.member).has('MOVE_MEMBERS')) return;
  if (!destinationVoiceChannel.permissionsFor(message.member).has('MOVE_MEMBERS')) return;


  let sourceVoiceChannelMembers = sourceVoiceChannel.members.array();
  for (let member of sourceVoiceChannelMembers) {
    await member.setVoiceChannel(destinationVoiceChannel).catch((e) => Kara.log.error(e));
  }


  message.channel.send({
    embed: {
      color: Kara.colors.GREEN,
      description: `${message.author.tag} moved all the members from **${sourceVoiceChannel.name}** Voice Channel to **${destinationVoiceChannel.name}** Voice Channel.`
    }
  }).catch(e => {
    Kara.log.error(e);
  });
};

exports.config = {
  aliases: [ 'mvMem' ],
  enabled: true,
  argsDefinitions: [
    { name: 'from', type: String },
    { name: 'to', type: String }
  ]
};

exports.help = {
  name: 'moveMembers',
  description: 'Moves all the members in a voice channel to another specified voice channel.',
  botPermission: 'MOVE_MEMBERS',
  userTextPermission: '',
  userVoicePermission: 'MOVE_MEMBERS',
  usage: 'moveMembers ',
  example: [ 'movemembers --from 199281703245316119 --to 167028141619413002' ]
};
