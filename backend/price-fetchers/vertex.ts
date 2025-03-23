import { createVertexClient } from '@vertex-protocol/client';
import {MarketId, type PriceFetcherResult} from './types';
import {ethers} from "ethers";

const marketIdToVertexProductIdMap = new Map<MarketId, number>([
  [MarketId.BTCUSD, 2],
  [MarketId.ETHUSD, 4],
  [MarketId.SOLUSD, 12],
  [MarketId.ARBUSD, 6],
  [MarketId.OPUSD, 18],
  [MarketId.AVAXUSD, 52],
]);

const provider = new ethers.JsonRpcProvider('https://arb1.arbitrum.io/rpc');

export const getVertexPrice = async (
  marketId: MarketId,
): PriceFetcherResult => {
  const vertexProductId = marketIdToVertexProductIdMap.get(marketId);

  if (typeof vertexProductId === 'undefined') {
    return null;
  }

  try {
    const vertexClient = createVertexClient('arbitrum', {
      // @ts-ignore
      signerOrProvider: provider,
    });

    const { markPrice } = await vertexClient.perp.getPerpPrices({
      productId: vertexProductId,
    });

    return markPrice.toNumber();
  } catch (error) {
    console.error(error);

    return null;
  }
};