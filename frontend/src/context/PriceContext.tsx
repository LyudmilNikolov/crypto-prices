import {
  createContext,
  FC,
  PropsWithChildren,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { MarketId, SourceId } from "backend/price-fetchers/types.ts";
import {
  getParsedMessage,
  getStringifyMessage,
} from "backend/shared/utils/message";
import { SERVER_URL } from "../constants/serverUrl";
import { Message, MessageType } from "backend/shared/massage.types.ts";

interface PriceContextType {
  selectedMarket: MarketId;
  setSelectedMarket: (marketId: MarketId) => void;
  prices: PricesState;
}

interface PricesState {
  [marketId: string]: {
    coinMarketCap: number;
    vertex: number;
  };
}

export const PriceContext = createContext<PriceContextType>({
  selectedMarket: MarketId.BTCUSD,
  setSelectedMarket: () => {},
  prices: {},
});

export const PriceProvider: FC<PropsWithChildren> = ({ children }) => {
  const wsRef = useRef<WebSocket | null>(null);

  const [selectedMarket, setSelectedMarket] = useState<MarketId>(
    MarketId.BTCUSD,
  );
  const [prices, setPrices] = useState<PricesState>({});

  useEffect(() => {
    const socket = new WebSocket(SERVER_URL);
    wsRef.current = socket;

    socket.onopen = () => {
      console.log("Connected to WebSocket");

      const subscribeMessage: Message = {
        type: MessageType.SUBSCRIBE,
        data: { marketIds: [selectedMarket] },
      };

      socket.send(getStringifyMessage(subscribeMessage));
    };

    socket.onmessage = (event) => {
      const parsed = getParsedMessage(event.data);
      if (parsed?.type === MessageType.PRICE) {
        const { marketId, sourceId, price } = parsed.data;

        setPrices((prev) => ({
          ...prev,
          [marketId]: {
            ...(prev[marketId] || { coinMarketCap: 0, vertex: 0 }),
            [sourceId === SourceId.COINMARKETCAP ? "coinMarketCap" : "vertex"]:
              price,
          },
        }));
      }
    };

    return () => {
      const unsubscribeMessage: Message = {
        type: MessageType.UNSUBSCRIBE,
        data: { marketIds: [selectedMarket] },
      };

      if (socket.readyState === WebSocket.OPEN) {
        socket.send(getStringifyMessage(unsubscribeMessage));
      }

      socket.close();
    };
  }, [selectedMarket]);

  const contextValue = useMemo(
    () => ({
      selectedMarket,
      setSelectedMarket,
      prices,
    }),
    [selectedMarket, setSelectedMarket, prices],
  );

  return (
    <PriceContext.Provider value={contextValue}>
      {children}
    </PriceContext.Provider>
  );
};
