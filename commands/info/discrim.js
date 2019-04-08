/**
 * @file discrim command
 * @author Kara
 * @license GPL-3.0
 */

exports.exec = async (Kara, message, args) => {
  if (!/^\d{4}$/.test(args[0])) {
    return Kara.emit('commandUsage', message, this.help);
  }

  let members = message.guild.members.filter(m => m.user.discriminator === args[0]).map(m => m.user.tag);
  let total = members.length;
  members = members.length > 0 ? members.slice(0, 10).join('\n') : 'None';

  await message.channel.send({
    embed: {
      color: Kara.colors.BLUE,
      title: 'Discriminator search',
      description: `Found **${total}** users with discriminator **${args[0]}**`,
      fields: [
        {
          name: 'Users',
          value: total > 10 ? `${members} and ${total - 10} more.` : members
        }
      ]
    }
  });
};

exports.config = {
  aliases: [],
  enabled: true
};

exports.help = {
  name: 'discrim',
  description: 'Searches for the users of your Discord server for the specified discriminator.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'discrim <discriminator>',
  example: [ 'discrim 8383' ]
};
