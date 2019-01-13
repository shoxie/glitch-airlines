/**
 * @file getDirSync
 * @author Kara
 * @license GPL-3.0
 */

const fs = xrequire('fs');
const path = xrequire('path');

module.exports = src => {
  // eslint-disable-next-line no-sync
  return fs.readdirSync(src).filter(file => fs.statSync(path.join(src, file)).isDirectory());
};
