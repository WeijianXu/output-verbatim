const path = require('path');

function pathJoin(dir) {
  return path.join(__dirname, '..', dir);
}

module.exports.pathJoin = pathJoin;
