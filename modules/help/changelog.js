/**
 * @file changelog command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.exec = (Bastion, message) => {
  message.channel.send({
    embed: {
      color: 3447003,
      title: 'Changelog',
      fields: [{
          name: "Version",
          value: "2.0 alpha rc-5"
      },
        {
          name: "Up-to-date version",
          value: "2.0 alpha rc-5"
      },
        {
          name: 'Changes',
          value: 'Removed thesaurus command.'
        },

        {
          name: "Developer",
          value: "whiterose"
      },
        {
          name: 'New features upcoming',
          value: 'AFK, book, membersOnly, mentionRole, moveMembers, music, reactionAnnouncements, reactionPinning, relayDirectMessages, roleDescription, roleEmoji'
      }
    ]
    }
  });


};

exports.config = {
  aliases: ['clog', 'changes'],
  enabled: false
};

exports.help = {
  name: 'changelog',
  botPermission: '',
  userTextPermission: '',
  userVoicePermission: '',
  usage: 'changelog',
  example: []
};
