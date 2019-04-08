/**
 * @file setProfilePicture command
 * @author Kara
 * @license GPL-3.0
 */

exports.exec = async (Kara, message, args) => {
  if (Kara.methods.isPublicKara(Kara)) {
    return Kara.emit('error', '', 'This command is temporarily disabled in the public Kara. For details, please contact [Kara Support](https://discord.gg/fzx8fkt).', message.channel);
  }

  args = args.join(' ');
  if (!/^(https?:\/\/)((([-a-z0-9]{1,})?(-?)+[-a-z0-9]{1,})(\.))+([a-z]{1,63})\/((([a-z0-9._\-~#%])+\/)+)?([a-z0-9._\-~#%]+)\.(jpg|jpeg|gif|png|bmp)$/i.test(args)) {
    return Kara.emit('commandUsage', message, this.help);
  }

  let userModel = await Kara.database.models.user.findOne({
    attributes: [ 'avatar' ],
    where: {
      userID: message.author.id
    }
  });

  if (!userModel) return;

  await Kara.database.models.user.update({
    avatar: args
  },
  {
    where: {
      userID: message.author.id
    },
    fields: [ 'avatar' ]
  });

  await message.channel.send({
    embed: {
      color: Kara.colors.GREEN,
      title: 'Profile Picture Set',
      image: {
        url: args
      },
      footer: {
        text: message.author.tag
      }
    }
  }).catch(e => {
    Kara.log.error(e);
  });
};

exports.config = {
  aliases: [],
  enabled: true
};

exports.help = {
  name: 'setProfilePicture',
  description: 'Sets your profile picture that shows up in the Kara user profile.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'setProfilePicture <IMAGE_URL>',
  example: [ 'setProfilePicture https://bastionbot.org/avatar.gif' ]
};
