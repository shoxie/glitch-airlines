/**
 * @file setColor command
 * @author Kara
 * @license GPL-3.0
 */

exports.exec = async (Bastion, message, args) => {
  if (Bastion.methods.isPublicKara(Kara)) {
    return Bastion.emit('error', '', 'This command is temporarily disabled in the public Bastion. For details, please contact [Kara Support](https://discord.gg/fzx8fkt).', message.channel);
  }

  if (!args.color || !/^#?(?:[0-9a-f]{3}|[0-9a-f]{6})$/i.test(args.color)) {
    return Bastion.emit('commandUsage', message, this.help);
  }


  args.color = args.color.replace('#', '');
  args.color = args.color.length === 3 ? args.color.replace(/(.)/g, '$1$1') : args.color;
  let color = parseInt(args.color, 16);

  await Bastion.database.models.user.update({
    color: color
  },
  {
    where: {
      userID: message.author.id
    },
    fields: [ 'color' ]
  });


  message.channel.send({
    embed: {
      color: Bastion.colors.GREEN,
      description: `${message.author}, your User Color has been set to **#${args.color}** and will be used in appropriate places.`
    }
  }).catch(e => {
    Bastion.log.error(e);
  });
};

exports.config = {
  aliases: [],
  enabled: true,
  argsDefinitions: [
    { name: 'color', type: String, defaultOption: true }
  ]
};

exports.help = {
  name: 'setColor',
  description: 'Sets your user color that is used in the Kara user profile.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'setColor < #HEX_COLOR_CODE >',
  example: [ 'setColor #000000' ]
};
