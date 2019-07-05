# API of CallFingate

```javascript
/**
 * instance of CallAPI
 *
 * @private
 * @memberof CallFingate
 */
private _remote;

/**
 * create call wallet
 *
 * @static
 * @returns {IWallet}
 * @memberof CallFingate
 */
static createWallet(): IWallet;

/**
 * check call address is valid or not
 *
 * @static
 * @param {string} address
 * @returns {boolean} return true if valid
 * @memberof CallFingate
 */
static isValidAddress(address: string): boolean;

/**
 * check call secret is valid or not
 *
 * @static
 * @param {string} secret
 * @returns {boolean} return true if valid
 * @memberof CallFingate
 */
static isValidSecret(secret: string): boolean;

/**
 * retrive address with secret
 *
 * @static
 * @param {string} secret
 * @returns {(string | null)} return address if valid, otherwise return null
 * @memberof CallFingate
 */
static getAddress(secret: string): string | null;

readonly remote: any;

/**
 * connect to call node server
 *
 * @returns
 * @memberof CallFingate
 */
connect(): Promise<>;

/**
 * check if connected to call node server
 *
 * @returns {boolean}
 * @memberof CallFingate return true if connected
 */
isConnected(): boolean;

/**
 * disconnect from call node server
 *
 * @memberof CallFingate
 */
disconnect(): void;

/**
 * get call balance
 *
 * @param {string} address
 * @returns {Promise<string>}
 * @memberof CallFingate
 */
getCallBalance(address: string): Promise<string>;

/**
 * sign transaction
 *
 * @param {string} txJSON
 * @param {string} secret
 * @returns {ISignature}
 * @memberof CallFingate
 */
sign(txJSON: string, secret: string): ISignature;

/**
 * prepare payment
 *
 * @param {string} address
 * @param {IPayment} payment
 * @returns {Promise<IPrepared>}
 * @memberof CallFingate
 */
preparePayment(address: string, payment: IPayment): Promise<IPrepared>;

/**
 * submit transaction
 *
 * @param {ISignature} signedTransaction
 * @returns
 * @memberof CallFingate
 */
submit(signedTransaction: ISignature): Promise<any>;

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
formatPayment(from: string, destination: string, amount: string, memo: string): IPayment;

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
transfer(secret: string, destination: string, amount: string, memo: IMemo): Promise<string>;
```
