import { Socket, io } from 'socket.io-client'
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

const userID = localStorage.getItem('user_id')

export const socket = io('http://localhost:3000', {
  auth: { user_id: userID },
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
})

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
    console.log(messageData)
  }
}

receiveEditMessage(socket)
receiveReactMessage(socket)
receiveDeletedMessage(socket)
newMessageNotification(socket)
