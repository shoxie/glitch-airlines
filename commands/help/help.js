/**
 * @file help command
 * @author Kara
 * @license GPL-3.0
 */

exports.exec = async (Kara, message, args) => {
  if (args.command) {
    let channel, command = args.command.toLowerCase();
    if (Kara.commands.has(command) || Kara.aliases.has(command)) {
      if (Kara.commands.has(command)) {
        command = Kara.commands.get(command);
      }
      else if (Kara.aliases.has(command)) {
        command = Kara.commands.get(Kara.aliases.get(command).toLowerCase());
      }
      let example = [];
      if (command.help.example.length < 1) {
        example.push('-');
      }
      else {
        for (let i = 0; i < command.help.example.length; i++) {
          example.push(`\`\`\`${message.guild.prefix[0]}${command.help.example[i]}\`\`\``);
        }
      }

      if (args.dm) {
        channel = message.author;
      }
      else {
        channel = message.channel;
      }

      await channel.send({
        embed: {
          color: Kara.colors.GOLD,
          fields: [
            {
              name: 'Command',
              value: `\`${command.help.name}\``,
              inline: true
            },
            {
              name: 'Aliases',
              value: command.config.aliases.join(', ') || '-',
              inline: true
            },
            {
              name: 'Module',
              value: command.config.module.replace('_', ' ').toTitleCase(),
              inline: true
            },
            {
              name: 'Description',
              value: Kara.i18n.command(message.guild.language, command.help.name).description,
              inline: false
            },
            {
              name: 'BOT Permissions',
              value: `\`${command.help.botPermission || '-'}\``,
              inline: true
            },
            {
              name: 'User Permissions',
              value: `\`${command.config.ownerOnly ? 'Bot Owner' : command.config.musicMasterOnly ? 'Music Master' : command.help.userTextPermission || '-'}\``,
              inline: true
            },
            {
              name: 'Usage',
              value: `\`\`\`${message.guild.prefix[0]}${command.help.usage}\`\`\``,
              inline: false
            },
            {
              name: 'Example',
              value: example.join('\n'),
              inline: false
            }
          ],
          footer: {
            text: command.config.enabled ? '' : 'This command is temporarily disabled.'
          }
        }
      });
    }
    else {
      return Kara.emit('error', '', Kara.i18n.error(message.guild.language, 'notFound', 'command'), message.channel);
    }
  }
  else {
    await message.channel.send({
      embed: {
        color: Kara.colors.GOLD,
        title: 'Help',
        description: `To get the list of commands, type \`${message.guild.prefix[0]}commands\`.` +
                     `\nTo get help about a specific command, type \`${message.guild.prefix[0]}help <command_name>\`.` +
                     `\n\nNeed help or support with Kara Bot?\n${message.guild.id === '267022940967665664' ? 'Ask for help or DM <@155622262660268033>.' : 'Join [**Kara HQ**](https://discord.gg/ZyBEENv) for testing the commands or any help you need with the bot or maybe just for fun.\nhttps://discord.gg/fzx8fkt'}`,
        fields: [
          {
            name: 'Kara HQ',
            value: '[Join](https://discord.gg/ZyBEENv)',
            inline: true
          },
          {
            name: 'Kara Bot',
            value: `[Invite](https://discordapp.com/oauth2/authorize?client_id=${Kara.user.id}&scope=bot&permissions=8)`,
            inline: true
          }
        ],
        thumbnail: {
          url: Kara.user.displayAvatarURL
        },
        footer: {
          text: `Server Prefix: ${message.guild.prefix.join(' ')} • Total Commands: ${Kara.commands.size}`
        }
      }
    });
  }
};

exports.config = {
  aliases: [ 'h' ],
  enabled: true,
  argsDefinitions: [
    { name: 'command', type: String, alias: 'c', defaultOption: true },
    { name: 'dm', type: Boolean }
  ]
};

exports.help = {
  name: 'help',
  description: 'Shows help on the specified command.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'help [command_name [--dm]]',
  example: [ 'help', 'help magic8ball', 'help acrophobia --dm' ]
};
