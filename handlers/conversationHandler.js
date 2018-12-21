/**
 * @file conversationHandler
 * @author Sankarsan Kampa (a.k.a k3rn31p4nic)
 * @license MIT
 */


const CREDENTIALS = require('../settings/credentials.json');


/**
 * Handles conversations with Bastion
 * @param {Message} message Discord.js message object
 * @returns {void}
 */
module.exports = async message => {
  try {

  }
  catch (e) {
    message.client.log.error(e);
  }
};
