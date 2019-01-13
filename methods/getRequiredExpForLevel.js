/**
 * @file getRequiredExpForLevel
 * @author Kara
 * @license GPL-3.0
 */

module.exports = (level = 0) => {
  level = parseInt(level, 10);

  if (level >= 0) {
    // Why's 0.15 used? Magic number, mate! MAGIC NUMBER!
    return Math.floor((level / 0.15) * (level / 0.15));
  }

  return null;
};
