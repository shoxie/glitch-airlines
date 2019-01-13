/**
 * @file listFilesSync
 * @author Kara
 * @license GPL-3.0
 */

const fs = xrequire('fs');

module.exports = dir => {
  // eslint-disable-next-line no-sync
  return fs.readdirSync(`./${dir}`);
};
