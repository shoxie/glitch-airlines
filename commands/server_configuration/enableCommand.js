/**
 * @file enableCommand command
 * @author Kara
 * @license GPL-3.0
 */

exports.exec = async (Kara, message, args) => {
  let disabledCommands, description;
  if (args.name) {
    let command = args.name.toLowerCase();

    if (Kara.commands.has(command) || Kara.aliases.has(command)) {
      if (Kara.commands.has(command)) {
        command = Kara.commands.get(command);
      }
      else if (Kara.aliases.has(command)) {
        command = Kara.commands.get(Kara.aliases.get(command).toLowerCase());
      }
    }
    else {
      return Kara.emit('error', '', Kara.i18n.error(message.guild.language, 'notFound', 'command'), message.channel);
    }

    if (![ 'enablecommand', 'disablecommand' ].includes(command.help.name.toLowerCase()) && !command.config.ownerOnly) {
      let guildModel = await Kara.database.models.guild.findOne({
        attributes: [ 'disabledCommands' ],
        where: {
          guildID: message.guild.id
        }
      });
      if (guildModel.dataValues.disabledCommands) {
        if (guildModel.dataValues.disabledCommands.includes(command.help.name.toLowerCase())) {
          guildModel.dataValues.disabledCommands.splice(guildModel.dataValues.disabledCommands.indexOf(command.help.name.toLowerCase()), 1);

          await Kara.database.models.guild.update({
            disabledCommands: guildModel.dataValues.disabledCommands
          },
          {
            where: {
              guildID: message.guild.id
            },
            fields: [ 'disabledCommands' ]
          });
        }
      }
    }

    description = Kara.i18n.info(message.guild.language, 'enableCommand', message.author.tag, command.help.name);
  }
  else if (args.module) {
    args.module = args.module.join('_').toLowerCase();

    disabledCommands = Kara.commands.filter(c => c.config.module === args.module).map(c => c.help.name.toLowerCase());

    let guildModel = await Kara.database.models.guild.findOne({
      attributes: [ 'disabledCommands' ],
      where: {
        guildID: message.guild.id
      }
    });
    if (guildModel.dataValues.disabledCommands) {
      disabledCommands = guildModel.dataValues.disabledCommands.filter(command => !disabledCommands.includes(command));
    }

    description = Kara.i18n.info(message.guild.language, 'enableModule', message.author.tag, args.module);

    await Kara.database.models.guild.update({
      disabledCommands: disabledCommands
    },
    {
      where: {
        guildID: message.guild.id
      },
      fields: [ 'disabledCommands' ]
    });
  }
  else if (args.all) {
    await Kara.database.models.guild.update({
      disabledCommands: null
    },
    {
      where: {
        guildID: message.guild.id
      },
      fields: [ 'disabledCommands' ]
    });
    description = Kara.i18n.info(message.guild.language, 'enableAllCommands', message.author.tag);
  }
  else {
    return Kara.emit('commandUsage', message, this.help);
  }

  await message.channel.send({
    embed: {
      color: Kara.colors.GREEN,
      description: description
    }
  }).catch(e => {
    Kara.log.error(e);
  });
};

exports.config = {
  aliases: [ 'enablecmd' ],
  enabled: true,
  argsDefinitions: [
    { name: 'name', type: String, defaultOption: true },
    { name: 'module', type: String, multiple: true, alias: 'm' },
    { name: 'all', type: Boolean, alias: 'a' }
  ]
};

exports.help = {
  name: 'enableCommand',
  description: 'Enable disabled command/module in your server.',
  botPermission: '',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'enableCommand < COMMAND_NAME | --module MODULE NAME | --all >',
  example: [ 'enableCommand echo', 'enableCommand --module game stats', 'enableCommand --all' ]
};
