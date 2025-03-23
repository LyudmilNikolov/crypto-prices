export type PriceFetcherResult = Promise<number | null>;

export enum MarketId {
  BTCUSD = 'BTCUSD',
  ETHUSD = 'ETHUSD',
  SOLUSD = 'SOLUSD',
  ARBUSD = 'ARBUSD',
  OPUSD = 'OPUSD',
  AVAXUSD = 'AVAXUSD',
}

export enum SourceId {
  VERTEX = 'VERTEX',
  COINMARKETCAP= 'coinmarketcap',
}