import { MarketId, type PriceFetcherResult, SourceId } from "./types";
import { getVertexPrice } from "./vertex";
import { getCoinMarketCapPrice } from "./coinmarketcap";

const sourceIdToPriceFetcherMap = new Map<
  SourceId,
  (marketId: MarketId) => PriceFetcherResult
>([
  [SourceId.COINMARKETCAP, getCoinMarketCapPrice],
  [SourceId.VERTEX, getVertexPrice],
]);

export const getPriceBySourceId = async (
  marketId: MarketId,
  sourceId: SourceId,
): PriceFetcherResult => {
  const priceFetcher = sourceIdToPriceFetcherMap.get(sourceId);

  if (!priceFetcher) {
    return null;
  }

  return priceFetcher(marketId);
};
