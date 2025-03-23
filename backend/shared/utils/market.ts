import { MarketId } from "../../price-fetchers/types";

export const isValidMarketId = (marketId: MarketId): boolean =>
  Object.values(MarketId).includes(marketId);
