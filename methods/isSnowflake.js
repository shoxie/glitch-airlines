/**
 * @file isSnowflake
 * @author Kara
 * @license GPL-3.0
 */

const { Snowflake } = xrequire('discord.js');

module.exports = (snowflake) => {
  snowflake = Snowflake.deconstruct(snowflake);
  let timestamp = snowflake.timestamp;
  if (timestamp > 1420070400000 && timestamp <= 3619093655551) {
    return true;
  }
  return false;
};
