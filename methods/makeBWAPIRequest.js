/**
 * @file makeBWAPIRequest
 * @author Kara
 * @license GPL-3.0
 */

const BastionWebAPI = xrequire('bwapi');
const BWAPI = new BastionWebAPI({
  headers: {
    'User-Agent': 'Bastion Discord Bot (https://bastionbot.org)'
  }
});

module.exports = (path, options) => {
  return new Promise(async (resolve, reject) => {
    try {
      let response = await BWAPI.request(path, options);

      resolve(response);
    }
    catch (e) {
      reject(e);
    }
  });
};
