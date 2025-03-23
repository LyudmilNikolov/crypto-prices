import crypto from 'node:crypto';
import { WebSocketServer } from 'ws';
import { processMessage } from './messages';
import { initPricesUpdater } from './prices';
import {getParsedMessage} from "./shared/utils/message";
import {unsubscribeUserFromMarkets} from "./database/markets";
import {addSocketByUser, deleteSocketByUser} from "./database/sockets";

const port = 4350;

const server = new WebSocketServer({
  port,
});

server.on('connection', (socket) => {
  const userId = crypto.randomUUID();

  addSocketByUser(userId, socket);

  socket.on('message', (rawData) => {
    const stringifyRawData = rawData.toString();
    const message = getParsedMessage(stringifyRawData);

    if (message) {
      processMessage(userId, message);
    }
  });

  socket.on('close', () => {
    unsubscribeUserFromMarkets(userId);
    deleteSocketByUser(userId);
  });
});

initPricesUpdater();

console.log(`Server started on ${port.toString()}`);