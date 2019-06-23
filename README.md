# jcc-call-utils

Toolkit of crossing chain from [Call](http://www.callchain.live/) to [SWTC chain](http://www.swtc.top/#/)

![npm](https://img.shields.io/npm/v/jcc-call-utils.svg)
[![Build Status](https://travis-ci.com/JCCDex/jcc-call-utils.svg?branch=master)](https://travis-ci.com/JCCDex/jcc-call-utils)
[![Coverage Status](https://coveralls.io/repos/github/JCCDex/jcc-call-utils/badge.svg?branch=master)](https://coveralls.io/github/JCCDex/jcc-call-utils?branch=master)
[![Dependencies](https://img.shields.io/david/JCCDex/jcc-call-utils.svg?style=flat-square)](https://david-dm.org/JCCDex/jcc-call-utils)
[![DevDependencies](https://img.shields.io/david/dev/JCCDex/jcc-call-utils.svg?style=flat-square)](https://david-dm.org/JCCDex/jcc-call-utils?type=dev)
[![npm downloads](https://img.shields.io/npm/dm/jcc-call-utils.svg)](http://npm-stat.com/charts.html?package=jcc-call-utils)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

## Description

Transfer token automatically from [Call](http://www.callchain.live/) to [SWTC](http://www.swtc.top/#/) chain. Support CALL token.

e.g. you transfer 1 `CALL` to [Call Fingate](http://block.callchain.live/#/account/cs9AWskwRmJrcMsszqC4hWeedCL5vSpexv) from your call address if success, the contract will automatically transfer 1 `JCALL` to your swtc address from [Jingtum Fingate](https://explorec9d536e.jccdex.cn/#/wallet/?wallet=jMCJrXRmycsT5tsVuge7Y65v9MrQi9r11E) in a few minutes.

## Installtion

```shell
npm install jcc-call-utils
```

## CDN

`jcc_call_utils` as a global variable.

```javascript
<script src="https://unpkg.com/jcc-call-utils/dist/jcc-call-utils.min.js"></script>
```

## Usage

```javascript
// demo
import CallFingate from "jcc-call-utils";

// websocket server
const server = "";

const instance = new CallFingate(server);

const testSecret = "shaXxkbcS8NoHrL1TzTfWBRCbsD2K";

const testAddress = "c3oPNfL3k3EUTBQMFQ2LTZM5W5TUM7Qq5N";

// Don't change it. The fingate address is it for now.
const destination = "cs9AWskwRmJrcMsszqC4hWeedCL5vSpexv";

const testMemo = {
    jtaddress: "jpgWGpfHz8GxqUjz5nb6ej8eZJQtiF6KhH"
}

const amount = "1";

try {
    // transfer 1 CALL
    await instance.connect();
    const hash = await inst.transfer(testSecret, destination, amount, testMemo);
    console.log(hash);
} catch (error) {
    console.log(error);
} finally {
    instance.disconnect();
}
```
