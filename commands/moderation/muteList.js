/**
 * @file muteList command
 * @author Kara
 * @license GPL-3.0
 */

exports.exec = async (Kara, message, args) => {
  if (!message.guild.available) return Kara.log.info(`${message.guild.name} Guild is not available. It generally indicates a server outage.`);

  let muteRole = message.guild.roles.find(role => role.name === 'Kara:mute'), mutedMembers = [];
  if (muteRole) {
    mutedMembers = muteRole.members.map(member => member.user.tag);
  }

  if (mutedMembers.length) {
    mutedMembers = mutedMembers.map((l, i) => `**${i + 1}.**  ${l}`);

    let noOfPages = mutedMembers.length / 10;
    let i = (args.page > 0 && args.page < noOfPages + 1) ? args.page : 1;
    i = i - 1;

    await message.channel.send({
      embed: {
        color: Kara.colors.BLUE,
        title: 'Muted Users',
        description: mutedMembers.join('\n'),
        footer: {
          text: `Page: ${i + 1} of ${noOfPages > parseInt(noOfPages) ? parseInt(noOfPages) + 1 : parseInt(noOfPages)}`
        }
      }
    });
  }
  else {
    await message.channel.send({
      embed: {
        color: Kara.colors.RED,
        description: 'The list\'s empty! No one is currently muted in this server.'
      }
    });
  }
};

exports.config = {
  aliases: [],
  enabled: true,
  argsDefinitions: [
    { name: 'page', type: Number, defaultOption: true, defaultValue: 1 }
  ]
};

exports.help = {
  name: 'muteList',
  description: 'Lists all the server-wide muted users of your Discord Server.',
  botPermission: '',
  userTextPermission: 'MANAGE_ROLES',
  userVoicePermission: '',
  usage: 'muteList [PAGE_NO]',
  example: [ 'muteList', 'muteList 2' ]
};
