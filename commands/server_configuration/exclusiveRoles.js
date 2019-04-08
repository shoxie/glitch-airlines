exports.exec = async (Kara, message, args) => {
  if (args.roles) {
    args.roles = args.roles.filter(role => message.guild.roles.has(role));

    if (!args.roles.length) {
      return await message.channel.send({
        embed: {
          color: Kara.colors.RED,
          description: 'Please use valid role IDs'
        }
      });
    }

    for (let roleID of args.roles) {
      await Kara.database.models.role.upsert({
        roleID: roleID,
        guildID: message.guild.id,
        exclusive: !args.remove
      },
      {
        where: {
          guildID: message.guild.id,
          exclusive: args.remove
        },
        fields: [ 'roleID', 'guildID', 'exclusive' ]
      });
    }

    args.roles = args.roles.
      map(role => `${message.guild.roles.get(role)} / ${role}`);

    await message.channel.send({
      embed: {
        color: args.remove ? Kara.colors.RED : Kara.colors.GREEN,
        title: args.remove ? 'Exclusive Roles Removed' : 'Exclusive Roles Added',
        description: args.roles.join('\n')
      }
    }).catch(e => {
      Kara.log.error(e);
    });
  }
  else {
    let roleModels = await Kara.database.models.role.findAll({
      fields: [ 'roleID' ],
      where: {
        guildID: message.guild.id,
        exclusive: true
      }
    });

    let exclusiveRoles = roleModels.map(model => model.dataValues.roleID);
    exclusiveRoles = exclusiveRoles.
      filter(role => message.guild.roles.has(role)).
      map(role => `${message.guild.roles.get(role)} / ${role}`);

    if (exclusiveRoles.length) {
      await message.channel.send({
        embed: {
          color: Kara.colors.BLUE,
          title: 'Exclusive Roles',
          description: exclusiveRoles.join('\n')
        }
      });
    }
    else {
      await message.channel.send({
        embed: {
          color: Kara.colors.BLUE,
          title: 'Exclusive Roles',
          description: 'No exclusive roles have been set.'
        }
      });
    }
  }
};

exports.config = {
  aliases: [],
  enabled: true,
  argsDefinitions: [
    { name: 'roles', type: String, multiple: true, defaultOption: true },
    { name: 'remove', type: Boolean, alias: 'r', defaultValue: false }
  ]
};

exports.help = {
  name: 'exclusiveRoles',
  description: 'Add/remove the specified roles as exclusive roles. If no argument is passed, it will show the current list of exclusive roles.',
  botPermission: '',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'exclusiveRoles [ ROLE_ID_1 ROLE_ID_2 ... ] [--remove]',
  example: [ 'exclusiveRoles', 'exclusiveRoles 219101083619902983 2494130541574845651', 'exclusiveRoles 2494130541574845651 --remove' ]
};
