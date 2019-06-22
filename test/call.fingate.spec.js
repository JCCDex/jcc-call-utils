const CallFingate = require("../lib").default;
const chai = require("chai");
const expect = chai.expect;
const sinon = require("sinon");
const sandbox = sinon.createSandbox();

const testAddress = "cHwjX2t16UvZxyQmczBFaawwWnaaJbnA8h";
const testSecret = "sp66zf6eSUmUF2EpYgm5vyrPKEyGU";
const testServer = "wss://s1.callchain.live:5020";
const testDestination = "cs9AWskwRmJrcMsszqC4hWeedCL5vSpexv";
const testPaymentData = {
  source: {
    address: 'cHwjX2t16UvZxyQmczBFaawwWnaaJbnA8h',
    maxAmount: { value: '1', currency: 'CALL' }
  },
  destination: {
    address: 'cs9AWskwRmJrcMsszqC4hWeedCL5vSpexv',
    amount: { value: '1', currency: 'CALL' }
  },
  memos: [{
    type: 'payment',
    format: 'plain/text',
    data: '{"jtaddress":"jURJTtmfYWuSzGRxJHYxxw3ijd4DTpe3it"}'
  }]
}
const testMemo = {
  jtaddress: "jURJTtmfYWuSzGRxJHYxxw3ijd4DTpe3it"
}
const testTxJSON = {
  tx_json: '{"TransactionType":"Payment","Account":"cHwjX2t16UvZxyQmczBFaawwWnaaJbnA8h","Destination":"cs9AWskwRmJrcMsszqC4hWeedCL5vSpexv","Amount":"1000000","Flags":2147483648,"Memos":[{"Memo":{"MemoData":"7B226A7461646472657373223A226A706757477066487A38477871556A7A356E6236656A38655A4A51746946364B6848227D","MemoType":"7061796D656E74","MemoFormat":"706C61696E2F74657874"}}],"LastLedgerSequence":13176992,"Fee":"12","Sequence":20}'
}

const testSignature = {
  signedTransaction: '12000022800000002400000014201B00C910A06140000000000F424068400000000000000C7321023645075C1F31263F0D1ABE6BAD9F87433E1CFB9C2B1BA7226AB861609B4C37C7744730450221009DD716EBD26DD0FB2BF47E04D50E7F8AF9EAD6F7B403A44780AADD480F331EDD022002E3C02959EC0F753F59ADD84DD392AB1A70C23F43D5E89712FB8C49E46D2E238114B15941972CF408F79F1612EEC4000C721C6C77D8831417A113022992BB4153A0E27D096B389F39F9C7DFF9EA7C077061796D656E747D327B226A7461646472657373223A226A706757477066487A38477871556A7A356E6236656A38655A4A51746946364B6848227D7E0A706C61696E2F74657874E1F1',
  id: '4FEA4EB0A8B8CB8841BBCF24F6F655F72C7A1B1CABF3A79DF77C54FC982DBD34'
}

describe("test call fingate", function() {
  describe("test createWallet api", function() {
    it("create valid wallet", function() {
      const wallet = CallFingate.createWallet();
      expect(CallFingate.isValidAddress(wallet.address)).to.true;
      expect(CallFingate.isValidSecret(wallet.secret)).to.true;
    });
  })

  describe("test isValidAddress api", function() {
    it("return true if the address is valid", function() {
      expect(CallFingate.isValidAddress(testAddress)).to.true;
    });

    it("return false if the address is invalid", function() {
      expect(CallFingate.isValidAddress(testAddress.substring(1))).to.false;
    });
  });

  describe("test isValidSecret api", function() {
    it("return true if the secret is valid", function() {
      expect(CallFingate.isValidSecret(testSecret)).to.true;
    });

    it("return false if the address is invalid", function() {
      expect(CallFingate.isValidSecret(testSecret.substring(1))).to.false;
    });
  })

  describe("test getAddress api", function() {
    it("return correct address if the secret is valid", function() {
      expect(CallFingate.getAddress(testSecret)).to.equal(testAddress);
    });

    it("return null if the secret is invalid", function() {
      expect(CallFingate.getAddress(testSecret.substring(1))).to.null;
    });
  })

  describe("test connect api", function() {
    let instance;
    afterEach(() => {
      sandbox.restore();
    })

    it("connect success", async function() {
      this.timeout(0);
      instance = new CallFingate(testServer);
      const stub = sandbox.spy(instance._remote, "connect");
      await instance.connect();
      expect(instance.isConnected()).to.true;
      expect(stub.calledOnce).to.true;
      instance.disconnect();
    })

    it("reject error if connect failed", async function() {
      try {
        this.timeout(0);
        instance = new CallFingate("wss://test.com");
        await instance.connect();
      } catch (error) {
        expect(error).to.throw;
      } finally {
        instance.disconnect();
      }
    })
  })

  describe("test instance", function() {
    let inst
    before(() => {
      inst = new CallFingate(testServer);
    })

    after(() => {
      inst.disconnect();
    })

    it("test remote", function() {
      expect(inst.remote).to.deep.equal(inst._remote);
    })

    it("resolve number if get call balance success", function(done) {
      this.timeout(0);
      inst.connect().then(() => {
        inst.getCallBalance(testAddress).then((balance) => {
          expect(parseFloat(balance)).to.be.a("number");
          done()
        })
      })
    })

    it("throw error if get error", async function() {
      this.timeout(0);
      try {
        await inst.getCallBalance("")
      } catch (error) {
        expect(error).to.be.an('error');
      }
    })

    it("throw error if transfer error", async function() {
      this.timeout(0);
      const stub = sandbox.stub(inst._remote, "preparePayment");
      stub.resolves(testTxJSON);
      const spy1 = sandbox.spy(inst._remote, "sign");
      const spy2 = sandbox.spy(inst._remote, "submit");
      try {
        await inst.transfer(testSecret, testDestination, 1, testMemo);
      } catch (error) {
        expect(stub.calledOnce).to.true;
        expect(spy1.calledOnce).to.true;
        expect(spy2.calledOnce).to.true;
        expect(stub.calledOnceWith(testAddress, testPaymentData)).to.true;
        expect(spy1.calledOnceWith(testTxJSON.tx_json, testSecret)).to.true;
        expect(error).to.be.an('error');
      } finally {
        sandbox.restore();
      }
    })

    it("transfer success", async function() {
      this.timeout(0);
      const stub = sandbox.stub(inst._remote, "preparePayment");
      stub.resolves(testTxJSON);
      const stub1 = sandbox.stub(inst._remote, "submit");
      stub1.resolves({
        resultCode: "tesSUCCESS"
      });
      try {
        const hash = await inst.transfer(testSecret, testDestination, 1, testMemo);
        expect(stub1.calledOnceWith(testSignature, true)).to.true;
        expect(hash).to.equal(testSignature.id);
      } finally {
        sandbox.restore();
      }
    })

    it("transfer failed", async function() {
      this.timeout(0);
      const stub = sandbox.stub(inst._remote, "preparePayment");
      stub.resolves(testTxJSON);
      const stub1 = sandbox.stub(inst._remote, "submit");
      stub1.resolves({
        resultCode: "tesFailed",
        resultMessage: "net work error"
      });
      try {
        await inst.transfer(testSecret, testDestination, 1, testMemo);
      } catch (error) {
        expect(error.message).to.equal("net work error");
      } finally {
        sandbox.restore();
      }
    })

    it("throw error if sign failed", function() {
      expect(() => inst.sign("", testSecret)).to.throw();
    })

    it("reject error if submit failed", function(done) {
      const stub = sandbox.stub(inst._remote, "submit");
      stub.rejects();
      inst.submit("").catch(error => {
        expect(error).to.be.an("error");
        sandbox.restore();
        done();
      })
    })

    it("reject error if preparePayment failed", function(done) {
      const stub = sandbox.stub(inst._remote, "preparePayment");
      stub.rejects();
      inst.preparePayment("", null).catch(error => {
        expect(error).to.be.an("error");
        done();
        sandbox.restore();
      })
    })

    it("throw error if the secret is invalid when transfer", function() {
      expect(() => inst.transfer("a", "", 1, "")).to.throw("a is invalid call secret.");
    })

    it("throw error if the address is invalid when transfer", function() {
      expect(() => inst.transfer(testSecret, "a", 1, "")).to.throw("a is invalid call address.");
    })

    it("throw error if the amount is invalid when transfer", function() {
      expect(() => inst.transfer(testSecret, testDestination, 0, "")).to.throw("0 is invalid amount.");
    })

    it("throw error if the amount is invalid when transfer", function() {
      expect(() => inst.transfer(testSecret, testDestination, 1, {
        jtaddress: "a"
      })).to.throw("a is invalid jingtum address in memo.");
    })
  })
})