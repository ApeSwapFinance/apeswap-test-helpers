const { BN } = require('./setup');

function ether (value) {
  return new BN(value).mul(new BN('10').pow(new BN('18')));
}

module.exports = {
  ether,
};
