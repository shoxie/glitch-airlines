/**
 * @file setBirthDate command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (Bastion, message, args) => {
  if (!args.date) {
    return Bastion.emit('commandUsage', message, this.help);
  }

  args.date = Date.parse(args.date.join(' '));

  if (!args.date) {
    return Bastion.emit('error', '', Bastion.i18n.error(message.guild.language, 'invalidInput', 'date'), message.channel);
  }

  let age = Date.now() - args.date;
  let year = 31556952000;

  if (age > 100 * year) {
    return Bastion.emit('error', '', Bastion.i18n.error(message.guild.language, 'ageAbove100'), message.channel);
  }
  else if (age < 13 * year) {
    return Bastion.emit('error', '', Bastion.i18n.error(message.guild.language, 'ageBelow13'), message.channel);
  }

  let userModel = await Bastion.database.models.user.findOne({
    attributes: [ 'birthDate' ],
    where: {
      userID: message.author.id
    }
  });

  if (!userModel) {
    return message.channel.send({
      embed: {
        description: `<@${message.author.id}> you didn't had a profile yet. I've now created your profile. Now you can use the command again to set your birth date.`
      }
    }).catch(e => {
      Bastion.log.error(e);
    });
  }

  await Bastion.database.models.user.update({
    birthDate: args.date
  },
  {
    where: {
      userID: message.author.id
    },
    fields: [ 'birthDate' ]
  });

  await message.channel.send({
    embed: {
      color: Bastion.colors.GREEN,
      title: 'Birth Date Set',
      description: `See you on your Birthday, ${message.author.tag}!`
    }
  }).catch(e => {
    Bastion.log.error(e);
  });
};

exports.config = {
  aliases: [ 'setBDate' ],
  enabled: true,
  argsDefinitions: [
    { name: 'date', type: String, multiple: true, defaultOption: true }
  ]
};

exports.help = {
  name: 'setBirthDate',
  description: 'Sets your birth date that shows up in the Kara user profile. Don\'t worry Kara will never show your age/year to public.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'setBirthDate <DATE>',
  example: [ 'setBirthDate 2/20/2002' ]
};
