const { accounts, contract } = require('@openzeppelin/test-environment');
const { ether } = require('../../src/utils');
const { dex } = require('../../index');
const { assert } = require('chai');

// Setup Token Contracts
const ERC20MockBuild = require('../../build-apeswap/token/contracts/ERC20Mock.json');
const ERC20Mock = contract.fromABI(ERC20MockBuild.abi, ERC20MockBuild.bytecode);

describe('ApeFactory', function () {
  this.timeout(10000);
  const [owner, feeTo, alice, bob, carol] = accounts;

  beforeEach(async () => {
    const {
      dexFactory,
      dexRouter,
      mockWBNB,
      mockTokens,
      dexPairs,
    } = await dex.deployMockDex(accounts, 5); // accounts passed will be used in the deployment
    this.dexFactory = dexFactory;
    this.dexRouter = dexRouter;
    this.mockWBNB = mockWBNB;
    this.mockTokens = mockTokens;
    this.dexPairs = dexPairs;

    this.mockToken0 = await ERC20Mock.new('Mock Token 0', { from: owner });
    await this.mockToken0.mint(ether('100'), { from: owner });
    this.mockToken1 = await ERC20Mock.new('Mock Token 1', { from: owner });
    await this.mockToken1.mint(ether('100'), { from: owner });

  });

  it('should have proper pair length', async () => {
    assert.equal((await this.dexFactory.allPairsLength()).toString(), '5');
  });

  it('should have properly deployed router', async () => {
    assert.equal((await this.dexRouter.factory()), this.dexFactory.address);
  });

  it('should get quote', async () => {
    const quote = await this.dexRouter.quote(ether('1'), ether('100'), ether('100'));
    assert.notEqual(quote.toString(), '0', 'quote is not zero')
  });

  it('should get amount out with values', async () => {
    const getAmountsOut = await this.dexRouter.getAmountOut(ether('1'), ether('100'), ether('100'));
    assert.notEqual(getAmountsOut.toString(), '0', 'getAmountsOut is not zero');
  });

  it('should get amounts out with path', async () => {
    const getAmountsOut = await this.dexRouter.getAmountsOut(ether('.0005'), [this.mockTokens[0].address, this.mockWBNB.address]);
    assert.notEqual(getAmountsOut.toString(), '0', 'getAmountsOut is not zero');
  });

  it('should add liquidity', async () => {
    await this.mockToken0.approve(this.dexRouter.address, ether('1'), { from: owner });
    await this.mockToken1.approve(this.dexRouter.address, ether('1'), { from: owner });

    await this.dexRouter.addLiquidity(
      this.mockToken0.address, // tokenA
      this.mockToken1.address, // tokenB
      ether('1'), // amountADesired
      ether('1'), // amountBDesired
      0, // amountAMin
      0, // amountBMin
      owner, // to
      '9999999999', // deadline
      { from: owner }
    );
  });
});
