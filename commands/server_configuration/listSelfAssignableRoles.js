/**
 * @file listSelfAssignableRoles command
 * @author Kara
 * @license GPL-3.0
 */

exports.exec = async (Bastion, message, args) => {
  let guildModel = await Bastion.database.models.guild.findOne({
    attributes: [ 'selfAssignableRoles' ],
    where: {
      guildID: message.guild.id
    }
  });

  if (!guildModel || !guildModel.dataValues.selfAssignableRoles) {
    return Bastion.emit('error', '', Bastion.i18n.error(message.guild.language, 'notSet', 'self-assignable roles'), message.channel);
  }

  let roles = guildModel.dataValues.selfAssignableRoles;
  roles = roles.filter(r => message.guild.roles.get(r));
  roles = [ ...new Set(roles) ];

  let roleNames = [];
  for (let i = 0; i < roles.length; i++) {
    roleNames.push(message.guild.roles.get(roles[i]).name);
  }
  roleNames = roleNames.map((r, i) => `${i + 1}. ${r}`);

  let noOfPages = roleNames.length / 10;
  let i = (args.page > 0 && args.page < noOfPages + 1) ? args.page : 1;
  i = i - 1;

  await message.channel.send({
    embed: {
      color: Bastion.colors.BLUE,
      title: 'Self assignable roles:',
      description: roleNames.slice(i * 10, (i * 10) + 10).join('\n'),
      footer: {
        text: `Page: ${i + 1} of ${noOfPages > parseInt(noOfPages) ? parseInt(noOfPages) + 1 : parseInt(noOfPages)}`
      }
    }
  });
};

exports.config = {
  aliases: [ 'lsar' ],
  enabled: true,
  argsDefinitions: [
    { name: 'page', type: Number, alias: 'p', defaultOption: true, defaultValue: 1 }
  ]
};

exports.help = {
  name: 'listSelfAssignableRoles',
  description: 'Lists all self-assignable roles.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'listSelfAssignableRoles [page_no]',
  example: [ 'listSelfAssignableRoles', 'listSelfAssignableRoles 2' ]
};
