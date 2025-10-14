import { io } from 'socket.io-client'
import { deleteMessage } from './socket.emit/delete.message.emit'
import { editMessage } from './socket.emit/edit.message.emit.js'
import { reactMessage } from './socket.emit/react.message.emit.js'
import type { TestMessage } from '@/views/Home.vue'
import {
  newMessageNotification,
  receiveDeletedMessage,
  receiveEditMessage,
  receiveReactMessage,
} from './socket.on.js/edit.message.on.js'
import { user } from '@/stores/user.js'
import { newContact } from '@/stores/contact.js'
import { useReceiver } from '@/stores/receiver.js'
const { currentReceiverID } = useReceiver();
import { useConversation } from '@/stores/conversation.js'
const { currentConversationID, conversationData } = useConversation();
import axios from 'axios'


type Participant = {
  userID: string | number
  firstName: string
  lastName: string
  nickname: string
  mute: boolean
  createdAt?: string
  updatedAt?: string
}

const user_id = localStorage.getItem('user_id')
const token = localStorage.getItem('jwt_token')

export const socket = io('http://localhost:3000', {
  auth: { token }, // ✅ sends token in handshake
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

  static async messageSend(messageData: TestMessage) {
    if (!messageData.conversationID) {
      const a: any = await this.createConversation()
      messageData.conversationID = a.conversation.contactID;
      currentReceiverID.value = a.conversation.contactID
      socket.emit("joinConversation", a.conversation.contactID);
      let localStorageContact: Array<any> = JSON.parse(localStorage.getItem('contact') || "[]");
      localStorageContact.push(a.conversation.contactID);
      conversationData.value = localStorageContact;
      localStorage.setItem('contact', JSON.stringify(localStorageContact))
    }

    if (!messageData.conversationID) return;

    socket.emit('chatMessage', messageData)
    console.log(messageData)
  }

  static async createConversation() {
    const currID = Number(user.value?.user_id)
    const contactID = Number(newContact.value?.user_id)

    const contactUser: Participant = {
      userID: contactID,
      firstName: newContact.value?.firstName as string,
      lastName: newContact.value?.lastName as string,
      nickname: '',
      mute: false
    }

    const participant: Participant = contactUser
    const sort = currID > contactID ? [currID, contactID] : [contactID, currID]
    const newContactID = `conv${sort[0]}${sort[1]}`

    const token = localStorage.getItem('jwt_token')
    if (!token) throw new Error("No token found")

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
    console.log({ participant, contactID: newContactID });


    try {
      const { data } = await axios.post(
        'http://localhost:3000/contact/create',
        { participant, contactID: newContactID },
        { headers },
      )

      return data
    } catch (error) {
      console.error("Create conversation failed:", error);
      throw error;
    }
  }

}

receiveEditMessage(socket)
receiveReactMessage(socket)
receiveDeletedMessage(socket)
newMessageNotification(socket)
