const { contract } = require('@openzeppelin/test-environment');
const { ether } = require('./utils');

// Setup DEX Contracts
const ApeFactoryBuild = require('../build-apeswap/dex/contracts/ApeFactory.json');
const ApeFactory = contract.fromABI(ApeFactoryBuild.abi, ApeFactoryBuild.bytecode);
const ApeRouterBuild = require('../build-apeswap/dex/contracts/ApeRouter.json');
const ApeRouter = contract.fromABI(ApeRouterBuild.abi, ApeRouterBuild.bytecode);
// const ApePairBuild = require('../build-apeswap/dex/contracts/ApePair.json');
// const ApePair = contract.fromABI(ApePairBuild.abi, ApePairBuild.bytecode);

// Setup Token Contracts
const ERC20MockBuild = require('../build-apeswap/token/contracts/ERC20Mock.json');
const ERC20Mock = contract.fromABI(ERC20MockBuild.abi, ERC20MockBuild.bytecode);
const WNativeBuild = require('../build-apeswap/token/contracts/WNative.json');
const WNative = contract.fromABI(WNativeBuild.abi, WNativeBuild.bytecode);

/**
 * @typedef {Object} DexDetails
 * @property {Contract} dexFactory The deployed ApeFactory contract.
 * @property {Contract} mockWBNB The deployed MockWBNB contract.
 * @property {Array(Contract)} mockTokens Array of deployed mock token contracts.
 * @property {Array(Contract)} dexPairs Array of deployed pair token contracts.
 */

/**
 * Deploy a mock dex.
 *
 * @param {Array(string)} accounts Pass in the accounts array provided from @openzeppelin/test-environment
 * @param {number} numPairs Number of pairs to create
 * @returns {DexDetails}
 */
// NOTE: Currently does not create a BANANA/WBNB pair
// eslint-disable-next-line space-before-function-paren
async function deployMockDex([owner, feeTo, alice], numPairs = 2) {
  const TOKEN_BASE_BALANCE = ether('1000');
  const WBNB_BASE_BALANCE = ether('1');
  // Setup DEX factory
  const dexFactory = await ApeFactory.new(feeTo, { from: owner });

  // Setup pairs
  const mockWBNB = await WNative.new('Wrapped Native', 'WNative', { from: owner });
  const dexRouter = await ApeRouter.new(dexFactory.address, mockWBNB.address);
  const mockTokens = [];
  const dexPairs = [];
  for (let index = 0; index < numPairs; index++) {
    // Mint pair token
    const mockToken = await ERC20Mock.new(`Mock Token ${index}`, `MOCK${index}`, { from: owner });
    await mockToken.mint(TOKEN_BASE_BALANCE, { from: owner });
    await mockToken.approve(dexRouter.address, TOKEN_BASE_BALANCE, { from: owner });

    await dexRouter.addLiquidityETH(
      mockToken.address, // token
      TOKEN_BASE_BALANCE, // amountTokenDesired
      0, // amountTokenMin
      0, // amountETHMin
      owner, // to
      '9999999999', // deadline
      {
        from: owner,
        value: WBNB_BASE_BALANCE, // Adding ETH liquidity which gets exchanged for WETH
      }
    );

    const pairCreated = await dexFactory.getPair(mockToken.address, mockWBNB.address);

    // NOTE: Alternative way to create pairs directly through ApeFactory
    // Create an initial pair
    // await dexFactory.createPair(mockWBNB.address, mockToken.address);
    // const pairCreated = await ApePair.at(await dexFactory.allPairs(index));

    // // Obtain LP Tokens
    // await mockWBNB.transfer(pairCreated.address, WBNB_BASE_BALANCE, { from: owner });
    // await mockToken.transfer(pairCreated.address, TOKEN_BASE_BALANCE, { from: owner });
    // await pairCreated.mint(alice);

    dexPairs.push(pairCreated);
    mockTokens.push(mockToken);
  }

  return {
    dexFactory,
    dexRouter,
    mockWBNB,
    mockTokens,
    dexPairs,
  };
}

module.exports = { deployMockDex };
