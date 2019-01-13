/**
 * @file isSameDomain
 * @author Kara
 * @license GPL-3.0
 */

module.exports = (domain, url) => {
  if (typeof domain !== 'string') return domain;
  let regex = new RegExp(`^(http[s]?://)?${domain.replace(/\*/g, '[\\w\\d.-]*')}`);
  return regex.test(url);
};
