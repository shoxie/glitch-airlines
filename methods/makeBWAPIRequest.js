/**
 * @file makeBWAPIRequest
 * @author Kara
 * @license GPL-3.0
 */

const KaraWebAPI = xrequire('bwapi');
const BWAPI = new KaraWebAPI({
  headers: {
    'User-Agent': 'Kara Discord Bot (https://bastionbot.org)'
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
