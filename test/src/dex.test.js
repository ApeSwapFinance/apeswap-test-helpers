const { accounts } = require('@openzeppelin/test-environment');
const { dex } = require('../../index');
const { assert } = require('chai');

describe('ApeFactory', function () {
  this.timeout(10000);
  // const [owner, feeTo, alice, bob, carol] = accounts;

  beforeEach(async () => {
    const {
      dexFactory,
      dexRouter,
      // mockWBNB,
      // mockTokens,
      // dexPairs,
    } = await dex.deployMockDex(accounts, 5); // accounts passed will be used in the deployment
    this.dexFactory = dexFactory;
    this.dexRouter = dexRouter;
  });

  it('should have proper pair length', async () => {
    assert.equal((await this.dexFactory.allPairsLength()).toString(), '5');
  });

  it('should have properly deployed router', async () => {
    assert.equal((await this.dexRouter.factory()), this.dexFactory.address);
  });
});
