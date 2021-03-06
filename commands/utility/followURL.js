/**
 * @file followURL command
 * @author Kara
 * @license GPL-3.0
 */

exports.exec = async (Kara, message, args) => {
  if (!/^(http[s]?:\/\/)(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&/=]*)$/i.test(args.url)) {
    return Kara.emit('error', '', Kara.i18n.error(message.guild.language, 'invalidInput', 'URL'), message.channel);
  }

  let url = await Kara.methods.makeBWAPIRequest('/url/follow', {
    qs: {
      url: args.url
    }
  });

  await message.channel.send({
    embed: {
      color: Kara.colors.BLUE,
      fields: [
        {
          name: 'Original URL',
          value: url.originalURL
        },
        {
          name: 'Redirected URL',
          value: url.followedURL
        }
      ]
    }
  });
};

exports.config = {
  aliases: [],
  enabled: true,
  argsDefinitions: [
    { name: 'url', type: String, defaultOption: true }
  ]
};

exports.help = {
  name: 'followURL',
  description: 'Follows a URL to until it reaches the last URL and shows you the followed URL. Useful for getting past shortened URLs.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'followURL',
  example: []
};
