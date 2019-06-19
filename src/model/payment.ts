interface IAmount {
  currency: string,
  value: string
}

interface IMemo {
  type: "payment",
  format: "plain/text",
  data: string
}

interface ISource {
  address: string,
  maxAmount: IAmount
}

interface IDestination {
  address: string,
  amount: IAmount
}

export default interface IPayment {
  source: ISource,
  destination: IDestination,
  memos: IMemo[]
}
