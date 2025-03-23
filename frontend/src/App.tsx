import { useEffect, useRef, useState } from "react";
import { MessageType } from "backend/shared/massage.types.ts";
import { MarketId, SourceId } from "backend/price-fetchers/types.ts";

const SOCKET_URL = "ws://localhost:4350";
const coins = [
  MarketId.BTCUSD,
  MarketId.ETHUSD,
  MarketId.SOLUSD,
  MarketId.AVAXUSD,
];

const App = () => {
  const [selectedCoin, setSelectedCoin] = useState<string>("BTC");
  const [prices, setPrices] = useState<{ [key: string]: number }>({
    coinMarketCap: 0,
    vertex: 0,
  });

  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const socket = new WebSocket(SOCKET_URL);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("Connected to WebSocket");

      const subscribeMessage = {
        type: MessageType.SUBSCRIBE,
        data: { marketIds: [selectedCoin] },
      };

      socket.send(JSON.stringify(subscribeMessage));
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === MessageType.PRICE) {
        const { sourceId, price } = data.data;

        setPrices((prev) => {
          const updated = { ...prev };

          if (sourceId === SourceId.COINMARKETCAP) {
            updated.coinMarketCap = price;
          }

          if (sourceId === SourceId.VERTEX) {
            updated.vertex = price;
          }

          return updated;
        });
      }
    };

    return () => {
      const unsubscribeMessage = {
        type: "unsubscribe",
        coin: selectedCoin,
      };

      if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify(unsubscribeMessage));
      }

      socket.close();
    };
  }, [selectedCoin]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-6">Crypto Price Comparison</h1>

      <select
        value={selectedCoin}
        onChange={(e) => setSelectedCoin(e.target.value)}
        className="p-2 rounded bg-gray-800 text-white"
      >
        {coins.map((coin) => (
          <option key={coin} value={coin}>
            {coin}
          </option>
        ))}
      </select>

      <div className="mt-4 p-4 bg-gray-800 rounded shadow-md text-center">
        <h2 className="text-xl font-semibold">{selectedCoin} Prices</h2>
        <p>Coin Market Cap: ${prices.coinMarketCap.toFixed(2)}</p>
        <p>Vertex Protocol: ${prices.vertex.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default App;
