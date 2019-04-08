exports.exec = async (Kara, message, args) => {
  if (args.length < 1) {
    return Kara.emit('commandUsage', message, this.help);
  }

  await message.channel.send({
    embed: {
      color: Kara.colors.BLUE,
      description: args.join(' '),
      footer: {
        text: `${Kara.credentials.ownerId.includes(message.author.id) ? '' : Kara.i18n.info(message.guild.language, 'endorsementMessage')}`
      }
    }
  });
};

exports.config = {
  aliases: [ 'say' ],
  enabled: true
};

exports.help = {
  name: 'echo',
  description: 'Sends the same message that you had sent. Just like an echo!',
  botPermission: '',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'echo <text>',
  example: [ 'echo Hello, world!' ]
};
