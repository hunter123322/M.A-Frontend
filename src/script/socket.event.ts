import { io } from 'socket.io-client'
import { deleteMessage } from "./socket.emit/delete.message.emit"
import { editMessage } from './socket.emit/edit.message.emit.js'
import { reactMessage } from './socket.emit/react.message.emit.js'
import type { TestMessage } from '@/views/Home.vue'
import {
  newMessageNotification,
  receiveDeletedMessage,
  receiveEditMessage,
  receiveReactMessage,
} from './socket.on.js/edit.message.on.js'

export const socket = io("http://localhost:3000", {
  withCredentials: true,
  transports: ["websocket"] // skip polling if you want
});

export class EmitMenuAction {
  static editMessage(messageId: string, editedMessage: string) {
    const data = editMessage(messageId, editedMessage)
    socket.emit('editMessage', data)
  }

  static messageReaction(messageId: string, reaction: string, userID: string) {
    const data = reactMessage(messageId, reaction, userID)
    console.log(data)

    socket.emit('messageReaction', data)
  }

  static deleteMessage(messageID: string) {
    socket.emit('deleteMessage', deleteMessage(messageID))
    console.log(messageID)
  }

  static messageSend(messageData: TestMessage) {
    socket.emit('chatMessage', messageData)
  }
}

receiveEditMessage(socket)
receiveReactMessage(socket)
receiveDeletedMessage(socket)
newMessageNotification(socket)
