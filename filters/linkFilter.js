/**
 * @file linkFilter
 * @author Kara
 * @license GPL-3.0
 */

/**
 * Handles filtering of links in messages
 * @param {Message} message Discord.js message object
 * @returns {Promise<true>} Whether or not any link is found in the message, by
 * an unauthorized user
 */
module.exports = message => {
  return new Promise(async (resolve, reject) => {
    try {
      resolve(false);

      // If the user has Manage Server permission, we don't need to filter it
      if (message.member.hasPermission('MANAGE_GUILD')) return;

      // Fetch filter data from database
      let guildModel = await message.client.database.models.guild.findOne({
        attributes: [ 'guildID', 'filterLinks', 'whitelistedDomains', 'moderationLog' ],
        where: {
          guildID: message.guild.id
        },
        include: [
          {
            model: message.client.database.models.textChannel,
            attributes: [ 'channelID', 'ignoreLinkFilter' ]
          },
          {
            model: message.client.database.models.role,
            attributes: [ 'roleID', 'ignoreLinkFilter' ]
          }
        ]
      });

      // Check if link filter is disabled
      if (!guildModel || !guildModel.dataValues.filterLinks) return;

      // Check if the channel is whitelisted
      if (guildModel.textChannels.
        filter(channel => channel.dataValues.ignoreLinkFilter).
        map(channel => channel.dataValues.channelID).
        includes(message.channel.id)) return;

      // Check if the user is in a whitelisted role
      let whitelistedRoles = guildModel.roles.
        filter(role => role.dataValues.ignoreLinkFilter).
        map(role => role.dataValues.roleID);

      for (let role of whitelistedRoles) {
        if (message.member.roles.has(role)) return;
      }

      let whitelistedDomains = guildModel.dataValues.whitelistedDomains ? guildModel.dataValues.whitelistedDomains : [];
      let links = message.content.match(/(http[s]?:\/\/)(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&/=]*)/gi);

      // If there are no links in the message content, return
      if (!links) return;

      // If some domains are whitelisted, remove them from `links`
      if (whitelistedDomains.length) {
        let matches = [];
        for (let i = 0; i < whitelistedDomains.length; i++) {
          matches[i] = links.filter(url => !message.client.methods.isSameDomain(whitelistedDomains[i], url));
        }
        links = message.client.methods.intersect(...matches);
      }
      // Check if there are any more `links` left
      if (!links.length) return;

      // If the code reaches here, the message contains links that needs to be filtered
      resolve(true);

      // Delete the message
      if (message.deletable) message.delete().catch(() => {});

      message.channel.send({
        embed: {
          color: message.client.colors.ORANGE,
          description: `${message.author} you are not allowed to post links here.`
        }
      }).then(msg => {
        msg.delete(5000).catch(() => {});
      }).catch(e => {
        message.client.log.error(e);
      });

      // Log the links that are filtered
      if (!guildModel.dataValues.moderationLog) return;

      let modLogChannel = message.guild.channels.get(guildModel.dataValues.moderationLog);
      if (!modLogChannel) return;

      await modLogChannel.send({
        embed: {
          color: message.client.colors.ORANGE,
          title: 'Filtered Links',
          fields: [
            {
              name: 'User',
              value: message.author.tag,
              inline: true
            },
            {
              name: 'User ID',
              value: message.author.id,
              inline: true
            },
            {
              name: 'Links',
              value: links.join('\n')
            }
          ],
          timestamp: new Date()
        }
      });
    }
    catch (e) {
      reject(e);
    }
  });
};
