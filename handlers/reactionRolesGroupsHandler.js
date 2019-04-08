/**
 * @file Reaction Roles Groups Handler
 * @author Kara
 * @license GPL-3.0
 */

module.exports = async Kara => {
  try {
    let reactionRolesGroupModels = await Kara.database.models.reactionRolesGroup.findAll({
      attributes: [ 'messageID', 'channelID', 'guildID' ]
    });

    let reactionRolesGroups = reactionRolesGroupModels.map(model => model.dataValues);

    for (let group of reactionRolesGroups) {
      if (!Kara.channels.has(group.channelID)) return;
      let channel = Kara.channels.get(group.channelID);
      if (!channel.messages.has(group.messageID)) {
        await channel.fetchMessage(group.messageID);
      }
    }
  }
  catch (e) {
    Kara.log.error(e);
  }
};
