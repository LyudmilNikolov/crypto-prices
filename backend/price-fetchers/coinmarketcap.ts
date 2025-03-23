import dotenv from "dotenv";
dotenv.config();
import { MarketId, PriceFetcherResult } from "./types";
import axios from "axios";

const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY!;
const COINMARKETCAP_URL = process.env.COINMARKETCAP_URL!;

const extractSymbolFromMarketId = (marketId: MarketId): string | null => {
  if (marketId.endsWith("USD")) {
    return marketId.replace("USD", "");
  }
  return null;
};

const fetchCoinMarketCapPrice = async (symbol: string): Promise<number> => {
  try {
    const response = await axios.get(COINMARKETCAP_URL, {
      headers: { "X-CMC_PRO_API_KEY": COINMARKETCAP_API_KEY },
      params: { symbol },
    });

    return response.data.data[symbol]?.quote?.USD?.price ?? 0;
  } catch (error) {
    console.error("Error fetching CoinMarketCap price:", error);
    return 0;
  }
};

export const getCoinMarketCapPrice = async (
  marketId: MarketId,
): PriceFetcherResult => {
  const symbol = extractSymbolFromMarketId(marketId);

  if (!symbol) {
    console.warn(`Invalid marketId format: ${marketId}`);
    return null;
  }

  return await fetchCoinMarketCapPrice(symbol);
};
