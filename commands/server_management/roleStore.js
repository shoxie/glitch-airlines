/**
 * @file roleStore command
 * @author Kara
 * @license GPL-3.0
 */

exports.exec = async (Kara, message) => {
  let buyableRoleModels = await Kara.database.models.role.findAll({
    attributes: [ 'roleID', 'price' ],
    where: {
      guildID: message.guild.id,
      price: {
        [Kara.database.Op.not]: null
      }
    }
  });

  let rolesInStore = buyableRoleModels.
    map(model => model.dataValues).
    filter(role => message.guild.roles.has(role.roleID));

  if (rolesInStore.length) {
    let fields = [];

    for (let role of rolesInStore) {
      fields.push({
        name: `${message.guild.roles.get(role.roleID).name} (${role.roleID})`,
        value: `${role.price} $`
      });
    }

    await message.channel.send({
      embed: {
        color: Kara.colors.BLUE,
        title: 'Role Store',
        description: 'Buy a role using the `buyRole` command.\nUse `help buyRole` command for more info.',
        fields: fields
      }
    });
  }
  else {
    await message.channel.send({
      embed: {
        color: Kara.colors.RED,
        title: 'Role Store',
        description: 'No role\'s for sale in this server at this time.'
      }
    });
  }
};

exports.config = {
  aliases: [ 'roleShop' ],
  enabled: true
};

exports.help = {
  name: 'roleStore',
  description: 'Lists the roles that are available for sale in the Role Store of the server. Listed roles in the Role Store can be bought by anyone, with %currency.name_plural%, in your server using the `buyRole` command. When users buy roles, the server owner gets 90% of the profit.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'roleStore',
  example: []
};
