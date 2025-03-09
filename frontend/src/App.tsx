import { useEffect, useState } from "react";

const SOCKET_URL = "ws://localhost:4350";

const coins = ["BTC", "ETH", "SOL", "ADA"];

function App() {
  const [selectedCoin, setSelectedCoin] = useState<string>("BTC");
  const [prices, setPrices] = useState<{ [key: string]: number }>({
    coinMarketCap: 0,
    vertex: 0,
  });

  useEffect(() => {
    const socket = new WebSocket(SOCKET_URL);

    socket.onopen = () => {
      console.log("Connected to WebSocket");
      socket.send(JSON.stringify({ type: "subscribe", coin: selectedCoin }));
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log(data);
      setPrices({
        coinMarketCap: data.coinMarketCap || 0,
        vertex: data.vertex || 0,
      });
    };

    return () => {
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
        <p>CoinMarketCap: ${prices.coinMarketCap.toFixed(2)}</p>
        <p>Vertex Protocol: ${prices.vertex.toFixed(2)}</p>
      </div>
    </div>
  );
}

export default App;