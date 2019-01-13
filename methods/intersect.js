/**
 * @file intersect
 * @author Kara
 * @license GPL-3.0
 */

module.exports = function(...a) {
  return [ ...a ].reduce((p, c) => p.filter(e => c.includes(e)));
};
