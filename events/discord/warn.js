/**
 * @file warn event
 * @author Kara
 * @license GPL-3.0
 */

const COLOR = xrequire('chalk');

module.exports = info => {
  /* eslint-disable no-console */
  console.log(COLOR.yellow('[WARNING EVENT]'));
  console.log(info);
  console.log(COLOR.yellow('[/WARNING EVENT]'));
  /* eslint-enable no-console */
};
