/**
 * @file cacheMembers command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license GPL-3.0
 */

exports.exec = async (Kara, message, args) => {
    let guild = await message.guild.fetchMembers();
  
     await message.channel.send({
      embed: {
        color: Kara.colors.GREEN,
        description: `**${guild.members.size}** members of **${guild.name}** have been cached.`
      }
    }).catch(e => {
        Kara.log.error(e);
    });
  };
  
   exports.config = {
    aliases: [ 'fetchMembers' ],
    enabled: true,
    argsDefinitions: []
  };
  
   exports.help = {
    name: 'cacheMembers',
    description: 'Fetches all members of your server from Discord and stores them in Kara\'s local cache.',
    botPermission: '',
    userTextPermission: 'MANAGE_GUILD',
    userVoicePermission: '',
    usage: 'cacheMembers',
    example: []
  };