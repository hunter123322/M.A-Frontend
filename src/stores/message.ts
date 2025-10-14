// src/store/messages.ts
import { ref, computed } from 'vue'

// Use a type for better type safety, like you prefer.
type TestMessage = {
  _id: string
  senderID: number
  receiverID: number
  conversationID: string
  content: string
  contentType: string
  reactions: {
    userID: string
    emoji: string
  }[]
  status: string
  hide: boolean
  createdAt: string
  updatedAt: string
}

type UnseenMessage = {
  userID: number
  unseenMessage: number
}

type Summary = {
  userID: number
  unseen: number
  sent: number
  sending: number
  delivered: number
  seen: number
  invalid: number
}

export const unseenMessage = ref<UnseenMessage[]>([])
export const isMessageEvent = ref(false)
export const messageNotif = computed(() =>
  unseenMessage.value.reduce((total, entry) => total + entry.unseenMessage, 0),
)
const messageData = ref<TestMessage[]>([])

export function useMessages() {
  const addMessage = (message: Omit<TestMessage, '_id'>) => {
    // Add a unique ID to the message before pushing
    const newMessage = { ...message, _id: Date.now().toString() }
    messageData.value.push(newMessage)
  }

  const removeMessage = (id: string) => {
    messageData.value = messageData.value.filter((msg) => msg._id !== id)
  }

  // Expose messages as a readonly property to prevent direct modification
  const currentMessages = messageData

  return {
    messages: currentMessages,
    addMessage,
    removeMessage,
  }
}

const currentUser = ref(1)
currentUser.value = + (localStorage.getItem("user_id") || "0")

export const messageSummary = computed<Summary[]>(() => {
  const summary: Record<string, Summary> = {}

  for (const msg of messageData.value) {
    const contactID =
      msg.senderID === currentUser.value ? msg.receiverID : msg.senderID

    if (!summary[contactID]) {
      summary[contactID] = {
        userID: contactID,
        unseen: 0,
        sent: 0,
        sending: 0,
        delivered: 0,
        seen: 0,
        invalid: 0
      }
    }

    if (msg.receiverID === currentUser.value && msg.status !== "seen") {
      summary[contactID].unseen++
    }

    // Only increment if msg.status is a valid key of Summary
    const validStatuses: Array<keyof Summary> = ['unseen', 'sent', 'sending', 'delivered', 'seen', 'invalid'];
    if (validStatuses.includes(msg.status as keyof Summary)) {
      summary[contactID][msg.status as keyof Summary]++;
    }
  }

  return Object.values(summary)
})
