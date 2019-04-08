/**
 * @file claim command
 * @author Kara
 * @license GPL-3.0
 */

const moment = xrequire('moment');
const specialIDs = xrequire('./assets/specialIDs.json');

exports.exec = async (Kara, message) => {
  let guildMemberModel = await Kara.database.models.guildMember.findOne({
    attributes: [ 'lastClaimed', 'claimStreak' ],
    where: {
      userID: message.author.id,
      guildID: message.guild.id
    }
  });

  if (guildMemberModel && guildMemberModel.dataValues.lastClaimed) {
    // If current date is same as the last claimed date, you can't use this!
    if (guildMemberModel.dataValues.lastClaimed.toDateString() === new Date().toDateString()) {
      return Kara.emit('error', '', Kara.i18n.error(message.guild.language, 'claimCooldown', message.author), message.channel);
    }


    // If it's a consecutive day, increase the claim streak of user.
    // Otherwise set the streak to 0.
    let nextDay = moment(guildMemberModel.dataValues.lastClaimed).add(1, 'd');
    if (guildMemberModel.dataValues.claimStreak < 7 && moment().isSame(nextDay, 'day')) {
      guildMemberModel.dataValues.claimStreak++;
    }
    else {
      guildMemberModel.dataValues.claimStreak = 0;
    }
  }

  let rewardAmount = Kara.methods.getRandomInt(50, 100);
  let description = `${message.author} You've claimed your daily reward.`;

  if (guildMemberModel.dataValues.claimStreak === 1) {
    description = `${description}\n\nKeep using this command every day and you'll get a bonus reward on completion of your 7 day streak!`;
  }
  else if (guildMemberModel.dataValues.claimStreak > 1 && guildMemberModel.dataValues.claimStreak < 6) {
    description = `${description}\n\n${7 - guildMemberModel.dataValues.claimStreak} days to get your bonus reward! Keep Going!`;
  }
  else if (guildMemberModel.dataValues.claimStreak === 6) {
    description = `${description}\n\nJust one day left for your 7 day streak to complete!`;
  }
  else if (guildMemberModel.dataValues.claimStreak === 7) {
    guildMemberModel.dataValues.claimStreak = 0;
    rewardAmount += Kara.methods.getRandomInt(350, 700);
    description = `${description}\n\nCongratulations! You've completed your 7 day streak! Check for a DM from me for your bonus reward.`;
  }

  if (Kara.user.id === '267035345537728512') {
    if (message.guild.id === specialIDs.bastionGuild) {
      if (message.member && message.member.roles.has(specialIDs.patronsRole)) {
        rewardAmount += 500;
      }
      else if (message.member && message.member.roles.has(specialIDs.donorsRole)) {
        rewardAmount += 100;
      }
    }
  }

  Kara.emit('userDebit', message.member, rewardAmount);

  await Kara.database.models.guildMember.update({
    lastClaimed: Date.now(),
    claimStreak: guildMemberModel.dataValues.claimStreak
  },
  {
    where: {
      userID: message.author.id,
      guildID: message.guild.id
    },
    fields: [ 'lastClaimed', 'claimStreak' ]
  });

  // Send a message in the channel to let the user know that the operation was successful.
  await message.channel.send({
    embed: {
      color: Kara.colors.GREEN,
      description: description
    }
  }).catch(e => {
    Kara.log.error(e);
  });

  // Let the user know by DM that their account has been debited.
  await message.author.send({
    embed: {
      color: Kara.colors.GREEN,
      description: `Your account, in **${message.guild.name}** Server, has been debited with **${rewardAmount}** $.`
    }
  }).catch(e => {
    if (e.code !== 50007) {
      Kara.log.error(e);
    }
  });
};

exports.config = {
  aliases: [ 'daily' ],
  enabled: true
};

exports.help = {
  name: 'claim',
  description: 'Claim your daily rewards.',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'claim',
  example: []
};
