# ApeSwap Test Helpers

A suite of Solidity smart contract test helpers. Use to easily test contracts against popular ApeSwap features.
### _**NOTICE**_: 
This project uses [@openzeppelin/test-environment](https://github.com/OpenZeppelin/openzeppelin-test-environment) under the hood to deploy contracts to the development. Using this helper module assumes you are using `@openzeppelin/test-environment` for testing as well.

## Overview

### Installation

```bash
yarn add -D @apeswapfinance/test-helpers
```
OR 
```bash
npm install --save-dev @apeswapfinance/test-helpers
```

### Configruation
As this module is hosted as a GitHub package, create a `.npmrc` file in the root of your project with these details: 

```
@apeswapfinance:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${NPM_TOKEN}
```

In your environment, set `NPM_TOKEN` to your [github access token](https://docs.github.com/en/packages/learn-github-packages/introduction-to-github-packages#authenticating-to-github-packages). 
```bash
export NPM_TOKEN=<github-access-token>
```

#### Hardhat (formerly Buidler)
Install `web3` and the `hardhat-web3` plugin.

```
npm install --save-dev @nomiclabs/hardhat-web3 web3
```

Remember to include the plugin in your configuration as explained in the [installation instructions](https://hardhat.org/plugins/nomiclabs-hardhat-web3.html#installation).

### Usage

Import `@apeswapfinance/test-helpers` in your test files to access helper deploy functions.


**Mock Farm**
```javascript
const {
  dex,  // Deploy/manage a test dex
  farm, // Deploy/manage a test farm
} = require('@apeswapfinance/test-helpers');
const { accounts, contract } = require('@openzeppelin/test-environment');
const { assert } = require('chai');

describe('MasterApe', function () {
    const [owner, feeTo, alice, bob, carol] = accounts;

    beforeEach(async () => {
        const {
            bananaToken,
            bananaSplitBar,
            masterApe,
        } = await farm.deployMockFarm(accounts); // accounts passed will be used in the deployment
        this.masterApe = masterApe;
    });

    it('should have proper pool length', async () => {
        assert.equal((await this.masterApe.poolLength()).toString(), '1');
    });
});
```

**Mock Dex**
```javascript
const {
  dex,  // Deploy/manage a test dex
  farm, // Deploy/manage a test farm
} = require('@apeswapfinance/test-helpers');
const { accounts, contract } = require('@openzeppelin/test-environment');
const { assert } = require('chai');

describe('ApeFactory', function () {
    this.timeout(10000);
    const [owner, feeTo, alice, bob, carol] = accounts;

    beforeEach(async () => {
        const {
            dexFactory,
            mockWBNB,
            mockTokens,
            dexPairs
        } = await dex.deployMockDex(accounts, 5); // accounts passed will be used in the deployment
        this.dexFactory = dexFactory;
    });

    it('should have proper pair length', async () => {
        assert.equal((await this.dexFactory.allPairsLength()).toString(), '5');
    });
});
```

## License

[MIT](LICENSE)
