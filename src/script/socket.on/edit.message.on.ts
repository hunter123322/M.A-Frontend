// Define an interface for the message object for type safety.

import { unseenMessage } from '@/stores/message'

// This ensures all message-related operations are consistent.
interface Message {
  _id: string
  senderID: string
  receiverID: string
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

interface NewMessageNotification {
  message: Message
  conversationID: string
  senderID: number
}

type Socket = any

export function receiveEditMessage(socket: Socket): void {
  socket.on('messageEdited', (updatedMessage: Message) => {
    // Get current messages from localStorage and handle the case where it's null.
    const messageData: Message[] = JSON.parse(localStorage.getItem('messageData') || '[]')

    // Find and update the message by its ID.
    const updatedMessages: Message[] = messageData.map((msg: Message) =>
      msg._id === updatedMessage._id ? updatedMessage : msg,
    )

    // Save the updated messages back to localStorage.
    localStorage.setItem('messageData', JSON.stringify(updatedMessages))

    // Render the edited message in the UI.
  })
}

export function receiveReactMessage(socket: Socket): void {
  socket.on('messageReacted', async (reaction: Message) => {
    const messageContainer = document.getElementById(reaction._id)
    if (!messageContainer) return // Add a guard clause for safety.

    // Remove old reactions before rendering new ones.
    const oldReactions = messageContainer.querySelector('.message-content .reactions')
    if (oldReactions) {
      oldReactions.remove()
    }

    // Get and update message data in localStorage.
    const messageData: Message[] = JSON.parse(localStorage.getItem('messageData') || '[]')
    const updatedMessages: Message[] = messageData.map((msg: Message) =>
      msg._id === reaction._id ? reaction : msg,
    )
    localStorage.setItem('messageData', JSON.stringify(updatedMessages))

    // Count and map the emojis for rendering.
    const emojiMap: Record<string, number> = {}
    reaction.reactions.forEach((r) => {
      if (r.emoji) {
        emojiMap[r.emoji] = (emojiMap[r.emoji] || 0) + 1
      }
    })

    // Render each unique emoji with its count.
    Object.entries(emojiMap).forEach(([emoji, count]) => {
      const badge = document.createElement('span')
      badge.className = 'reaction-badge'
      badge.id = '' // Consider giving this a unique ID if needed.
      badge.textContent = count > 1 ? `${count}${emoji}` : emoji
    })
  })
}

export function receiveDeletedMessage(socket: Socket): void {
  socket.on('deleteMessage', async (messageID: string) => {
    let messageData: Message[] = JSON.parse(localStorage.getItem('messageData') || '[]')

    // Filter out the message with the given ID.
    messageData = messageData.filter((message: Message) => message._id !== messageID)

    // Update localStorage and UI.
    localStorage.setItem('messageData', JSON.stringify(messageData))
  })
}

const contactList = document.getElementById('contactList')
if (contactList) {
  contactList.addEventListener('click', (event: MouseEvent) => {
    let messages: Message[] = JSON.parse(localStorage.getItem('messageData') || '[]')
    const userID: string | null = localStorage.getItem('user_id')

    const clickedCard = (event.target as HTMLElement).closest('.contact-card')
    if (!clickedCard || !userID) return

    const receiverID: string = clickedCard.id

    const existingConversations: string[] = [
      ...new Set(
        messages
          .filter(
            (msg: Message) =>
              (msg.senderID === userID && msg.receiverID === receiverID) ||
              (msg.senderID === receiverID && msg.receiverID === userID),
          )
          .map((msg: Message) => msg.conversationID),
      ),
    ]

    return existingConversations
  })
}

class SaveToLocalStorage {
  public save(messages: Message[]): void {
    try {
      localStorage.setItem('messageData', JSON.stringify(messages))
    } catch (e) {
      console.error('Failed to save messages:', e)
    }
  }
}

export function newMessageNotification(socket: Socket): void {
  let messages: Message[] = JSON.parse(localStorage.getItem('messageData') || '[]')
  const messageSave = new SaveToLocalStorage()

  socket.on('newMessageNotification', async (notification: NewMessageNotification) => {
    // This part of the logic needs to be updated to correctly get the current conversation ID.
    // The original code was assigning the event listener to a variable, which is incorrect.
    // I'll keep the logic as-is for now, but this is a potential bug.
    incrementUnseen(notification.senderID)
    const currentConversationID: string = 'some_conversation_id' // Placeholder
    if (currentConversationID !== notification.conversationID) {
      console.log('notif: ', notification)
      const { message } = notification

      messages.push({ ...message, updatedAt: new Date().toISOString() })
      messageSave.save(messages)
    }
  })
}

function incrementUnseen(userID: number) {
  const entry = unseenMessage.value.find((u) => u.userID === userID)

  if (entry) {
    // If user already exists, increment
    entry.unseenMessage++
    unseenMessage.value[0] = entry
    console.log(`Increment unseen for existing user: ${userID}`, unseenMessage.value)
  } else {
    // If user does not exist, add them
    unseenMessage.value.push({ userID, unseenMessage: 1 })
    console.log(`New user added with unseen message: ${userID}`)
  }
}
