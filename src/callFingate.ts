import BigNumber from "bignumber.js";
import * as callWallet from "jcc_wallet/lib/call";
import IMemo from "./model/memo";
import IPayment from "./model/payment";
import IPrepared from "./model/prepared";
import ISignature from "./model/signature";
import IWallet from "./model/wallet";
import { isValidAmount, isValidMemo, isValidCallAddress, isValidCallSecret, validate } from "./validator";
let call;
/* istanbul ignore if */
if (global["Window"]) { // tslint:disable-line
  // for web browser
  call = require("call-for-browser"); // tslint:disable-line 
} else {
  call = require("call-lib"); // tslint:disable-line 
}
const CallAPI = call.CallAPI;

/**
 * call fingate
 *
 * @export
 * @class CallFingate
 */
export default class CallFingate {

  private _remote = null;

  constructor(node: string) {
    this._remote = new CallAPI({
      server: node
    });
  }

  /**
   * create call wallet
   *
   * @static
   * @returns {IWallet}
   * @memberof CallFingate
   */
  public static createWallet(): IWallet {
    return callWallet.createWallet();
  }

  /**
   * check call address is valid or not
   *
   * @static
   * @param {string} address
   * @returns {boolean} return true if valid
   * @memberof CallFingate
   */
  public static isValidAddress(address: string): boolean {
    return callWallet.isValidAddress(address);
  }

  /**
   * check call secret is valid or not
   *
   * @static
   * @param {string} secret
   * @returns {boolean} return true if valid
   * @memberof CallFingate
   */
  public static isValidSecret(secret: string): boolean {
    return callWallet.isValidSecret(secret);
  }

  /**
   * retrive address with secret
   *
   * @static
   * @param {string} secret
   * @returns {(string | null)} return address if valid, otherwise return null
   * @memberof CallFingate
   */
  public static getAddress(secret: string): string | null {
    return callWallet.getAddress(secret);
  }

  public get remote() {
    return this._remote;
  }

  /**
   * connect to call node server
   *
   * @returns
   * @memberof CallFingate
   */
  public async connect() {
    return new Promise((resolve, reject) => {
      this._remote.connect().then(() => {
        return resolve();
      }).catch((error) => {
        return reject(error);
      });
    });
  }

  /**
   * check if connected to call node server
   *
   * @returns {boolean}
   * @memberof CallFingate return true if connected
   */
  public isConnected(): boolean {
    return this._remote.isConnected();
  }

  /**
   * disconnect from call node server
   *
   * @memberof CallFingate
   */
  public disconnect() {
    if (this._remote) {
      this._remote.disconnect();
    }
  }

  /**
   * get call balance
   *
   * @param {string} address
   * @returns {Promise<string>}
   * @memberof CallFingate
   */
  public async getCallBalance(address: string): Promise<string> {
    try {
      const balances = await this._remote.getBalances(address);
      const balance = balances.find((b) => b.currency.toUpperCase() === "CALL");
      return balance.value;
    } catch (error) {
      throw error;
    }
  }

  /**
   * sign payment data
   *
   * @param {string} txJSON
   * @param {string} secret
   * @returns {ISignature}
   * @memberof CallFingate
   */
  public sign(txJSON: string, secret: string): ISignature {
    try {
      return this._remote.sign(txJSON, secret);
    } catch (error) {
      throw error;
    }
  }

  public preparePayment(address: string, payment: IPayment): Promise<IPrepared> {
    return new Promise((resolve, reject) => {
      this._remote.preparePayment(address, payment).then((prepared) => {
        return resolve(prepared);
      }).catch((error) => {
        return reject(error);
      });
    });
  }

  public submit(signedTransaction: ISignature) {
    return new Promise((resolve, reject) => {
      this._remote.submit(signedTransaction, true).then((result) => {
        return resolve(result);
      }).catch((error) => {
        return reject(error);
      });
    });
  }

  /**
   * format payment data
   *
   * @param {string} from call address
   * @param {string} destination call address
   * @param {number} amount amount
   * @param {string} memo memo
   * @returns {IPayment}
   * @memberof CallFingate
   */
  public formatPayment(from: string, destination: string, amount: string, memo: string): IPayment {
    const payment: IPayment = {
      destination: {
        address: destination,
        amount: {
          currency: "CALL",
          value: amount
        }
      },
      memos: [{
        data: memo,
        format: "plain/text",
        type: "payment"
      }],
      source: {
        address: from,
        maxAmount: {
          currency: "CALL",
          value: amount
        }
      }
    };
    return payment;
  }

  /**
   * transfer CALL
   *
   * @param {string} secret call secret
   * @param {string} destination call destination address
   * @param {string} amount transfer amount
   * @param {IMemo} memo  transfer memo
   * @returns {Promise<string>} return hash if success
   * @memberof CallFingate
   */
  @validate
  public async transfer(@isValidCallSecret secret: string, @isValidCallAddress destination: string, @isValidAmount amount: string, @isValidMemo memo: IMemo): Promise<string> {
    const from = CallFingate.getAddress(secret);
    const payment = this.formatPayment(from, destination, new BigNumber(amount).toString(10), JSON.stringify(memo));
    try {
      const prepared = await this.preparePayment(from, payment);
      const signature = await this.sign(prepared.tx_json, secret);
      const response: any = await this.submit(signature);
      if (response.resultCode === "tesSUCCESS") {
        return signature.id;
      } else {
        throw new Error(response.resultMessage);
      }
    } catch (error) {
      throw error;
    }
  }
}
