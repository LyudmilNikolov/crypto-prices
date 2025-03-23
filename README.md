# 🪙 Crypto Prices Comparator

This full-stack application compares live cryptocurrency prices between **CoinMarketCap** (via API) and **Vertex Protocol** (via WebSocket). It demonstrates how to handle multiple data sources, unify them in a backend, and deliver real-time pricing data to a React-based frontend via WebSockets.

## 🧠 Architecture

- **Backend** (Node.js):
    - WebSocket server for real-time broadcasting
    - Price fetching from:
        - Vertex Protocol (WebSocket client)
        - CoinMarketCap (REST API)
- **Frontend** (React):
    - User selects a crypto pair (e.g., `BTCUSD`)
    - Live prices from both sources are displayed side-by-side

---

## ⚙️ Requirements

- Node.js >= 18.x
- Yarn >= 4.x
- CoinMarketCap API key

---

## 🔐 Environment Variables

You’ll need to set your **CoinMarketCap API key and endpoint** for the backend.

Create a `.env` file **inside the `backend/` folder**:

```env
COINMARKETCAP_API_KEY=your_cmc_api_key_here
COINMARKETCAP_URL=https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest