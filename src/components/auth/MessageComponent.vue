<script setup lang="ts">
import {
    Aperture, SendHorizontal,
    CircleEllipsis, EllipsisVertical
} from 'lucide-vue-next';
import { ref, onMounted, nextTick, watch, reactive } from 'vue';
import { EmitMenuAction } from '@/script/socket.event';
import { socket } from '@/script/socket.event';
import { useTheme } from '@/stores/theme';
import { useMessages } from '@/stores/message';
import { useReceiver } from '@/stores/receiver';
import { useConversation } from '@/stores/conversation';
import { useReqData } from '@/stores/getMessageData';
import Streaming from '@/components/homeComponents/Streaming.vue';
import MessageEvent from '@/components/homeComponents/MessageEvent.vue';
import { endCall } from '@/stores/streaming';

const { messages } = useMessages();
const { currentReceiverID } = useReceiver();
const { currentConversationID, conversationData } = useConversation();
const { getMessageReqData, returnMessageData } = useReqData();
const currentUser = Number(localStorage.getItem("user_id"));

const isDark = ref(true)
const props = defineProps(['msg', 'currentUser', 'isDark']);

// A reactive object to store the `isMessageEvent` state for each message ID.
const isMessageEventMap = reactive<Record<string, boolean>>({});

let lastMessageID: string = ''

// Function to toggle the state for a specific message ID.
const toggleMessageEvent = (messageId: string) => {
  // If the same message is clicked again → close it
  if (messageId === lastMessageID) {
    isMessageEventMap[messageId] = false
    lastMessageID = ''
    return
  }

  // If there was a previously active message → close it
  if (lastMessageID) {
    isMessageEventMap[lastMessageID] = false
  }

  // Open the new one
  isMessageEventMap[messageId] = true
  lastMessageID = messageId
}


// let currentReceiverID: string | null = null;
type Participant = {
    userID: number,
    firstName: string,
    lastName: string,
    nickname: string,
    mute: { muteStatus: false, timeFrame: "" },
    createdAt?: string,
    updatedAt?: string
}

type Contacts = {
    contactID: string,
    _id?: number,
    createdAt?: string,
    updatedAt?: string,
    participant: Participant[]
}

type ContactVal = {
    success: boolean,
    contacts: Contacts[]
}

const initialLoad = ref(false)

socket.emit("initContact", currentUser, async (val: ContactVal) => {
    conversationData.value = val.contacts
    initialLoad.value = true
})
socket.emit("joinConversation", currentConversationID.value);

export type TestMessage = {
    _id: string;
    senderID: number;
    receiverID: number;
    conversationID: string;
    content: string;
    contentType: string;
    reactions: {
        userID: string;
        emoji: string;
    }[];
    status: string;
    hide: boolean;
    createdAt: string;
    updatedAt: string;
}

type Val = {
    messages: TestMessage[],
    success: boolean,
}

// socket.emit("getMessage", getMessageReqData.value, (val: Val) => {
//     returnMessageData.value = val.messages;
// });

const messageContainer = ref<HTMLElement | null>(null);
const messageStates = ref<{ [key: string]: boolean }>({})
const inputRef = ref<HTMLInputElement | null>(null); // input field reference


function scrollToBottom() {
    if (messageContainer.value) {
        messageContainer.value.scrollTop = messageContainer.value.scrollHeight;
    }
}

function handleScroll() {
    // const el = messageContainer.value
    // if (!el) return

    // // At the very top
    // if (el.scrollTop === 0) {
    //     const lastMessage = messages.value[0]
    //     getMessageReqData.value.createdAt = lastMessage.createdAt;
    //     socket.emit("getMessage", getMessageReqData.value, (val: Val) => {
    //         returnMessageData.value = val.messages;
    //     });
    // }
}

// Scroll on initial mount
onMounted(() => {
    nextTick(() => {
        scrollToBottom();
    });
});

// Scroll whenever messages change
watch((messages), () => {
    nextTick(() => {
        scrollToBottom();
    });
}, { deep: true });

function formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    });
}

function toggleStatus(id: string) {
    messageStates.value[id] = !messageStates.value[id];
}


// Send message function
async function sendMessage() {
    const text = inputRef.value?.value.trim();
    if (!text) return;

    if (currentUser === null) return

    // 1. Display instantly
    const tempMsg: TestMessage = {
        _id: Date.now().toString(),
        senderID: currentUser,
        receiverID: currentReceiverID.value as number, // set your receiver dynamically
        conversationID: currentConversationID.value as string, // set your conversation dynamically
        content: text,
        contentType: "text",
        reactions: [],
        status: "send",
        hide: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    // 2. Clear input
    if (inputRef.value) inputRef.value.value = "";

    try {
        // 3. Send to backend
        EmitMenuAction.messageSend(tempMsg)
    } catch (err) {
        console.error("Send failed:", err);
    }
}

function handleKeyDown(e: KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
}

type Message =  {
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

socket.on("receiveMessage", (receivedMessage: TestMessage) => {    
    console.log(receivedMessage, "receive message");
    
    messages.value.push(receivedMessage);
    // returnMessageData.value.push(receivedMessage);
    let messageData: Message[] = JSON.parse(localStorage.getItem('messageData') || '[]')
    messageData.push(receivedMessage);
    localStorage.setItem('messageData', JSON.stringify(messageData))

    
});
</script>

<template>
    <div class="flex flex-row w-full text-xs" :class="isDark ? 'bg-black' : 'bg-white'">
        <div :class="isDark ? 'bg-blue-300/30' : 'bg-blue-400'" class="w-full h-full flex flex-col">
            <Streaming />
            <template ref="messageContainer" @scroll="handleScroll" :class="!endCall ? 'hidden' : 'flex'"
                class="flex-col h-screen overflow-y-auto">
                <div v-for="msg in messages" :key="msg._id" :id="msg._id" class="flex flex-col space-y-2"
                    :class="msg.senderID === currentUser ? 'self-end' : 'self-start'">

                    <div class="relative flex flex-row my-1 mx-1">
                        <template v-if="msg.senderID === currentUser">
                            <MessageEvent v-if="isMessageEventMap[msg._id as any]" class="right-full -translate-y-35" />
                            <EllipsisVertical :size="15" @click="toggleMessageEvent(msg._id)" color="black"
                                class="flex self-center cursor-pointer" />
                            <div @click="toggleStatus(msg._id)"
                                class="self-start max-w-3x rounded-2xl p-2 inline-block cursor-pointer hover:bg-black/50"
                                :class="isDark ? 'bg-black text-white' : 'bg-sky-200 text-black'">
                                <span class="whitespace-pre-line">
                                    {{ msg.content }}
                                </span>
                            </div>
                        </template>
                        <template v-else>
                            <div @click="toggleStatus(msg._id)"
                                class="self-start max-w-3x rounded-2xl p-2 inline-block cursor-pointer hover:bg-black/50"
                                :class="isDark ? 'bg-black text-white' : 'bg-sky-200 text-black'">
                                <span class="whitespace-pre-line">
                                    {{ msg.content }}
                                </span>
                            </div>
                            <EllipsisVertical :size="15" @click="toggleMessageEvent(msg._id)" color="black"
                                class="flex self-center cursor-pointer" />
                            <MessageEvent v-if="isMessageEventMap[msg._id as any]" class="left-full -translate-y-35" />
                        </template>
                    </div>

                    <!-- Message Status -->
                    <div class="justify-center text-xs space-x-5 text-black"
                        :class="messageStates[msg._id] ? 'flex' : 'hidden'">
                        <span>{{ formatDate(msg.createdAt) }}</span>
                        <span class="font-bold">{{ msg.status }}</span>
                    </div>
                </div>
            </template>

            <div class="p-2 cursor-pointe bottom-0 items-center space-x-3" :class="[isDark ? 'text-gray-200 bg-gray-800' : 'text-black bg-blue-400',
            !endCall ? 'hidden' : 'flex']">
                <CircleEllipsis :size="20" />
                <div class="w-full h-5 flex items-end mt-2">
                    <input id="message-input" ref="inputRef" type="text" placeholder="TEXT" @keydown="handleKeyDown"
                        class="w-full h-7 px-4 text-black text-base rounded-lg leading-tight"
                        :class="isDark ? 'bg-blue-600 text-white' : 'bg-blue-200'" />
                </div>
                <SendHorizontal :size="20" class="cursor-pointer" @click="sendMessage" />
            </div>
        </div>
    </div>
</template>

<style scoped>
.overflow-y-auto::-webkit-scrollbar {
    display: none;
}

.overflow-y-auto {
    -ms-overflow-style: none;
    scrollbar-width: none;
}
</style>
