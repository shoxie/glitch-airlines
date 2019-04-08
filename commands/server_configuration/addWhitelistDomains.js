/**
 * @file addWhitelistDomains command
 * @author Kara
 * @license GPL-3.0
 */

exports.exec = async (Kara, message, args) => {
  if (!args.domains || !args.domains.length) {
    return Kara.emit('commandUsage', message, this.help);
  }

  let guildModel = await Kara.database.models.guild.findOne({
    attributes: [ 'whitelistedDomains' ],
    where: {
      guildID: message.guild.id
    }
  });

  let whitelistDomains = guildModel.dataValues.whitelistedDomains.concat(args.domains);
  whitelistDomains = [ ...new Set(whitelistDomains) ];

  await Kara.database.models.guild.update({
    whitelistedDomains: whitelistDomains
  },
  {
    where: {
      guildID: message.guild.id
    },
    fields: [ 'whitelistedDomains' ]
  });

  await message.channel.send({
    embed: {
      color: Kara.colors.GREEN,
      title: 'Added Domains to Whitelist',
      description: args.domains.join('\n')
    }
  }).catch(e => {
    Kara.log.error(e);
  });
};

exports.config = {
  aliases: [],
  enabled: true,
  argsDefinitions: [
    { name: 'domains', type: String, alias: 'd', multiple: true, defaultOption: true }
  ]
};

exports.help = {
  name: 'addWhitelistDomains',
  description: 'Adds a domain to the whitelist for link filter.',
  botPermission: '',
  userTextPermission: 'MANAGE_GUILD',
  userVoicePermission: '',
  usage: 'addWhitelistDomains [Domain] [anotherDomain] [someOtherDomain]',
  example: [ 'addWhitelistDomains https://bastionbot.org https://*.sankarsankampa.com' ]
};
