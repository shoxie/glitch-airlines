/**
 * @file Method Handler
 * @author Kara
 * @license GPL-3.0
 */

const fs = xrequire('fs');

let methodDir = './methods/';
// eslint-disable-next-line no-sync
let methods = fs.readdirSync(methodDir);
for (let method of methods) {
  exports[method.replace('.js', '')] = xrequire(methodDir, method);
}
