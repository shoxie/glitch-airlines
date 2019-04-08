/**
 * @file checkPermissions command
 * @author Kara
 * @license GPL-3.0
 */

exports.exec = async (Kara, message) => {
  let fields = [];
  let permissions = message.guild.me.permissions.serialize();
  for (let permission in permissions) {
    fields.push({
      name: permission.replace(/_/g, ' ').toTitleCase(),
      value: permissions[permission],
      inline: true
    });
  }

  await message.channel.send({
    embed: {
      color: Kara.colors.BLUE,
      title: `Permissions for ${Kara.user.tag}`,
      description: 'Permissions I have in this channel and server.',
      fields: fields
    }
  });
};

exports.config = {
  aliases: [ 'checkPerms' ],
  enabled: true
};

exports.help = {
  name: 'checkPermissions',
  description: 'Shows the permissions Kara has in the server/channel.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'checkPermissions',
  example: []
};
