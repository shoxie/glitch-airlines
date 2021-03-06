/**
 * @file presenceUpdate event
 * @author Kara
 * @license GPL-3.0
 */

module.exports = async (oldMember, newMember) => {
  try {
    newMember.client.monitors.exec(__filename.slice(__dirname.length + 1, -3), oldMember, newMember);

    if (newMember.user.bot) return;
    if (newMember.roles.size < 2) return;
    if (newMember.user.presence.status === 'offline') return;
    if (oldMember.frozenPresence.game && newMember.user.presence.game && oldMember.frozenPresence.game.type === newMember.user.presence.game.type) return;

    let guildModel = await newMember.client.database.models.guild.findOne({
      attributes: [ 'streamerRole' ],
      where: {
        guildID: newMember.guild.id
      }
    });
    if (!guildModel || !guildModel.dataValues.streamerRole) return;

    let streamerRole = newMember.guild.roles.get(guildModel.dataValues.streamerRole);
    if (!streamerRole) return;

    if (!newMember.user.presence.game || newMember.user.presence.game.type !== 1) {
      if (!newMember.roles.has(streamerRole.id)) return;
      await newMember.removeRole(streamerRole, 'Stopped streaming').catch(() => {});
    }
    else {
      await newMember.addRole(streamerRole, 'Started streaming').catch(() => {});
    }
  }
  catch (e) {
    newMember.client.log.error(e);
  }
};
