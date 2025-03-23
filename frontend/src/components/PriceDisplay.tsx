import { usePriceState } from "../hooks/usePriceState.ts";

const PriceDisplay = () => {
  const context = usePriceState();

  if (!context) return null;

  const { prices, selectedMarket } = context;
  const marketPrices = prices[selectedMarket] || {
    coinMarketCap: 0,
    vertex: 0,
  };

  return (
    <div className="mt-4 p-4 bg-gray-800 rounded shadow-md text-center">
      <h2 className="text-xl font-semibold">{selectedMarket} Prices</h2>
      <p>
        Coin Market Cap: ${marketPrices.coinMarketCap?.toFixed(2) ?? "0.00"}
      </p>
      <p>Vertex Protocol: ${marketPrices.vertex?.toFixed(2) ?? "0.00"}</p>
    </div>
  );
};

export default PriceDisplay;
