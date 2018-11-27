/**
 * @file changelog command
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */

exports.exec = (Bastion, message) => {
  const CHANGES = require('../../changes.json');

  let changes = [];
  for (let section in CHANGES) {
    if (CHANGES.hasOwnProperty(section)) {
      if (section === 'date' || section === 'image' || !CHANGES[section].length) continue;

      changes.push({
        name: section,
        value: `- ${CHANGES[section].join('\n- ')}`
      });
    }
  }

  changes.push(
    {
      name: '\u200B',
      value: '\u200B'
    },
    {
      name: 'Missed an update?',
      value: '[Check out our previous change logs](https://github.com/TheBastionBot/Bastion/releases).'
        + '\nJoin **Time Bureau Council** and never miss an update: https://discord.gg/YDsHng6'
    },
    {
      name: 'Support Kara\'s Development',
      value: '[Support the development of Kara] to keep it running forever and get cool rewards!'
    }
  );

 
};

exports.config = {
  aliases: [ 'clog', 'changes' ],
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
