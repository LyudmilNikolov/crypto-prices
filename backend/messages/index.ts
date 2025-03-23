import {
  getSubscribersByMarketId,
  subscribeUserToMarket,
  unsubscribeUserFromMarket,
} from "../database/markets";
import { Message, MessageType } from "../shared/massage.types";
import { MarketId, SourceId } from "../price-fetchers/types";
import { getStringifyMessage } from "../shared/utils/message";
import { getSocketByUser } from "../database/sockets";

export const processMessage = (userId: string, message: Message): void => {
  const { type, data } = message;
  switch (type) {
    case MessageType.SUBSCRIBE:
      data.marketIds.forEach((marketId) => {
        subscribeUserToMarket(userId, marketId);
      });

      break;

    case MessageType.UNSUBSCRIBE:
      data.marketIds.forEach((marketId) => {
        unsubscribeUserFromMarket(userId, marketId);
      });

      break;

    default:
      break;
  }
};

export const sendMessageToUser = (userId: string, message: Message): void => {
  const socket = getSocketByUser(userId);
  const stringifyMessage = getStringifyMessage(message);

  if (socket && socket.readyState === socket.OPEN) {
    socket.send(stringifyMessage);
  }
};

export const sendMessageToMarketSubscribers = (
  marketId: MarketId,
  message: Message,
): void => {
  const subscribers = getSubscribersByMarketId(marketId);

  if (subscribers) {
    for (const userId of subscribers) {
      sendMessageToUser(userId, message);
    }
  }
};

export const getPriceMessage = (
  marketId: MarketId,
  sourceId: SourceId,

  price: number,
): Message => ({
  type: MessageType.PRICE,
  data: {
    marketId,
    sourceId,
    timestamp: Date.now(),
    price,
  },
});
