/**
 * @file inRole command
 * @author Kara
 * @license GPL-3.0
 */

exports.exec = async (Kara, message, args) => {
  if (!args.role) {
    return Kara.emit('commandUsage', message, this.help);
  }

  let role = message.mentions.roles.first();
  if (!role) {
    role = message.guild.roles.find(role => role.name === args.role.join(' '));
  }

  if (role) {
    let members = role.members.map(m => m.user.tag).map((m, i) => `${i + 1}. ${m}`);

    let noOfPages = members.length / 10;
    let i = (args.page > 0 && args.page < noOfPages + 1) ? args.page : 1;
    i = i - 1;

    await message.channel.send({
      embed: {
        color: Kara.colors.BLUE,
        title: `Members in ${role.name} role:\n`,
        description: members.slice(i * 10, (i * 10) + 10).join('\n'),
        thumbnail: {
          url: `https://dummyimage.com/250/${role.hexColor.slice(1)}/&text=%20`
        },
        footer: {
          text: `Page: ${i + 1} of ${noOfPages > parseInt(noOfPages) ? parseInt(noOfPages) + 1 : parseInt(noOfPages)}`
        }
      }
    });
  }
  else {
    return Kara.emit('error', '', Kara.i18n.error(message.guild.language, 'roleNotFound'), message.channel);
  }
};

exports.config = {
  aliases: [],
  enabled: true,
  argsDefinitions: [
    { name: 'role', type: String, alias: 'r', multiple: true, defaultOption: true },
    { name: 'page', type: Number, alias: 'p', defaultValue: 1 }
  ]
};

exports.help = {
  name: 'inRole',
  description: 'Shows members that have a specified role in your Discord server.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'inRole < Role Name | @role-mention > [-p <PAGE_NO>]',
  example: [ 'inRole Legends -p 2', 'inrole @Legendary Heroes' ]
};
