const guildCount = require('./modules/guildCount');

module.exports = async (Kara) => {
  try {
    await guildCount(Kara);
  }
  catch (e) {
    Kara.log.error(e);
  }
};
