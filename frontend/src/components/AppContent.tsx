import { usePriceState } from "../hooks/usePriceState.ts";
import { MarketId } from "backend/price-fetchers/types.ts";
import PriceDisplay from "./PriceDisplay";

const coins = [
  MarketId.BTCUSD,
  MarketId.ETHUSD,
  MarketId.SOLUSD,
  MarketId.AVAXUSD,
];

const AppContent = () => {
  const context = usePriceState();

  if (!context) return null;

  const { selectedMarket, setSelectedMarket } = context;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-6">Crypto Price Comparison</h1>

      <select
        value={selectedMarket}
        onChange={(e) => setSelectedMarket(e.target.value as MarketId)}
        className="p-2 rounded bg-gray-800 text-white"
      >
        {coins.map((coin) => (
          <option key={coin} value={coin}>
            {coin}
          </option>
        ))}
      </select>

      <PriceDisplay />
    </div>
  );
};

export default AppContent;
