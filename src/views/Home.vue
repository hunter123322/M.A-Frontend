<script setup lang="ts">
import {
    Aperture,
    Settings,
    User,
    Palette,
    VolumeX,
    UserCircle2,
    Video,
    Phone,
    Pin,
    Ban,
    DeleteIcon,
    BadgeAlert,
    AtSign,
    SendHorizontal,
    CircleEllipsis,
    Sun,
    Moon,
    EllipsisVertical,
    BellOff
} from 'lucide-vue-next';
import { ref, onMounted, nextTick, watch } from 'vue';
import testMessages from '@/testData/messageData';
import { EmitMenuAction } from '@/script/socket.event';
import { socket } from '@/script/socket.event';
import conversationData from '@/testData/conversationData';

let crurentConversationID: string | null;

socket.emit("joinConversation", "convAB");

export type TestMessage = {
    _id: string;
    senderID: string;
    receiverID: string;
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

let socketMessage: TestMessage[] = []

socket.emit("getMessage", { conversationID: 1, latestMessage: 1 }, (val: Val) => {
    console.log(val);
    socketMessage = val.messages;
});

const messageContainer = ref<HTMLElement | null>(null);
const textareaRef = ref<HTMLTextAreaElement | null>(null);
const isDarkMode = ref(true);
const messageStates = ref<{ [key: string]: boolean }>({})
const currentUser = localStorage.getItem("user_id");
const messages = ref<TestMessage[]>([]);
const inputRef = ref<HTMLInputElement | null>(null); // input field reference

function scrollToBottom() {
    if (messageContainer.value) {
        messageContainer.value.scrollTop = messageContainer.value.scrollHeight;
    }
}

// Scroll on initial mount
onMounted(() => {
    nextTick(() => {
        scrollToBottom();
    });
});

// Scroll whenever messages change
watch(messages, () => {
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

    if(currentUser === null) return

    // 1. Display instantly
    const tempMsg: TestMessage = {
        _id: Date.now().toString(),
        senderID: currentUser,
        receiverID: "userB", // set your receiver dynamically
        conversationID: crurentConversationID as string, // set your conversation dynamically
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
        // const idx = messages.value.findIndex(m => m._id === tempMsg._id);
        // if (idx !== -1) messages.value[idx].status = "failed";
    }
}

function handleKeyDown(e: KeyboardEvent) {
    const target = e.target as HTMLInputElement;
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
}

socket.on("receiveMessage", (receivedMessage: TestMessage) => {
    messages.value.push(receivedMessage);
    console.log(receivedMessage, "receiveMessage");
});

onMounted(() => {
    if (textareaRef.value) {
        const el = textareaRef.value;
        const maxHeight = 200;
        el.style.height = 'auto';
        if (el.scrollHeight <= maxHeight) {
            el.style.overflowY = 'hidden';
            el.style.height = `${el.scrollHeight}px`;
        } else {
            el.style.overflowY = 'auto';
            el.style.height = `${maxHeight}px`;
        }
    }
});

function handleClick(event: MouseEvent, conversationID: string) {
    const div = event.currentTarget as HTMLElement;
    const span = div.querySelector("span");
    const spanText = span?.textContent ?? "";

    const contactPerson = document.getElementById("contact-person");
    if (!contactPerson) return;
    const targetSpan = contactPerson.querySelector("span");
    const sideBar = document.getElementById("side-bar") as HTMLElement;

    if (!targetSpan) return;
    targetSpan.textContent = spanText;
    sideBar.classList.remove("hidden");

    messages.value = socketMessage.filter(
        msg => msg.conversationID === conversationID
    );
    crurentConversationID = conversationID;
}
</script>


<template>
    <section :class="isDarkMode ? 'bg-black text-white' : 'bg-white text-black'" class="flex flex-row">
        <div :class="isDarkMode ? 'bg-black' : 'bg-white'" class="flex flex-col h-screen w-1/4 pr-3">
            <div :class="isDarkMode ? 'bg-blue-400/40' : 'bg-blue-300'" class="h-1/4 w-full rounded-lg mb-2 p-1">
                <div id="profile-section" class="m-1 p-2 flex flex-row items-center">
                    <Aperture :size="50" :color="isDarkMode ? 'white' : 'black'" />
                    <h1 class="font-semibold text-xl px-2">Aldrin Belardo</h1>
                    <button class="ml-20 cursor-pointer w-auto h-auto" @click="isDarkMode = !isDarkMode">
                        <Settings :size="35" :color="isDarkMode ? 'white' : 'black'" />
                    </button>
                </div>
                <div class="flex ml-3 align-bottom items-center ">
                    <input type="text" placeholder="Search Contact"
                        class="w-auto h-10 px-4 bg-gray-400 rounded-lg text-black" />
                    <label class="relative inline-block w-14 h-8 ml-6 cursor-pointer">
                        <input type="checkbox" v-model="isDarkMode" class="sr-only peer">
                        <span :class="isDarkMode ? 'hidden' : 'flex'">
                            <Sun :size="30" />
                        </span>
                        <span :class="isDarkMode ? 'flex' : 'hidden'">
                            <Moon :size="30" />
                        </span>
                    </label>
                </div>
                <span class="flex mt-2 ml-4">Active</span>
            </div>

            <div :class="isDarkMode ? 'bg-blue-400/40' : 'bg-blue-300'"
                class="h-full w-full rounded-lg mt-2 px-2 py-1 overflow-y-auto">

                <div v-for="conversation in conversationData" :key="conversation._id" :id="conversation._id"
                    class="flex w-full h-15 bg-gray-900/50 rounded-lg my-1 mb-2 hover:bg-gray-900 duration-150 items-center pl-2"
                    @click="handleClick($event, conversation._id)">
                    <div v-if="conversation.participant[0].userID !== currentUser"
                        class="relative flex justify-between w-full">
                        <span>{{ conversation.participant[0].name }}</span>
                        <span v-if="false"
                            class="absolute right-1 -top-4 h-1 w-1 animate-ping rounded-full bg-red-500"></span>
                        <span v-if="false" class="absolute right-1 -top-4 h-2 w-2 rounded-full bg-red-400"></span>
                        <BellOff v-if="conversation.participant[0].mute.muteStatus" :size="20"
                            class="flex items-center mr-2" />
                    </div>

                    <div v-else class="relative flex justify-between w-full">
                        <span>
                            {{ conversation.participant[1].name }} </span>
                        <span class="absolute right-1 -top-4 h-2 w-2 animate-ping rounded-full bg-red-500"></span>
                        <span class="absolute right-1 -top-4 h-2 w-2 rounded-full bg-red-400"></span>
                        <BellOff v-if="conversation.participant[1].mute.muteStatus" :size="20"
                            class="flex items-center mr-2" />
                    </div>
                </div>
            </div>
        </div>

        <div class="flex flex-row h-screen w-full ml-1" :class="isDarkMode ? 'bg-black' : 'bg-white'">

            <div :class="isDarkMode ? 'bg-blue-300/30' : 'bg-blue-400'"
                class="w-full h-full rounded-lg mr-2 flex flex-col">

                <div ref="messageContainer" class="flex flex-col rounded-lg h-screen overflow-y-auto">
                    <div v-for="msg in messages" :key="msg._id" :id="msg._id" class="flex flex-col space-y-2"
                        :class="msg.senderID === currentUser ? 'self-end' : 'self-start'">
                        <div class="flex flex-row my-0">
                            <template v-if="msg.senderID === currentUser">
                                <EllipsisVertical :size="25" color="black" class=" flex self-center" />
                                <div @click="toggleStatus(msg._id)"
                                    class="self-start max-w-3x rounded-2xl p-2 inline-block cursor-pointer hover:bg-black/50"
                                    :class="isDarkMode ? 'bg-black text-white' : 'bg-sky-200 text-black'">
                                    <span class="whitespace-pre-line">
                                        {{ msg.content }}
                                    </span>
                                </div>
                                <Aperture :size="30" color="black" class="flex self-end m-2" />
                            </template>
                            <template v-else>
                                <Aperture :size="30" color="black" class="flex self-end m-2" />
                                <div @click="toggleStatus(msg._id)"
                                    class="self-start max-w-3xl bg-black/75 text-white rounded-2xl p-2 inline-block cursor-pointer hover:bg-black/50">
                                    <span class="whitespace-pre-line">
                                        {{ msg.content }}
                                    </span>
                                </div>
                                <EllipsisVertical :size="25" color="black" class=" flex self-center" />
                            </template>
                        </div>

                        <div class="justify-center space-x-5 text-black"
                            :class="messageStates[msg._id] ? 'flex' : 'hidden'">
                            <span>{{ formatDate(msg.createdAt) }}</span>
                            <span class="font-bold">{{ msg.status }}</span>
                        </div>
                    </div>
                </div>

                <div class="p-4 cursor-pointe bottom-0 flex items-center space-x-3"
                    :class="isDarkMode ? 'text-gray-200 bg-gray-800' : 'text-black bg-blue-400'">
                    <CircleEllipsis :size="40" />
                    <div class="w-full h-5 flex items-end mt-5">
                        <input id="message-input" ref="inputRef" type="text" placeholder="TEXT" @keydown="handleKeyDown"
                            class="w-full h-10 px-4 text-black text-base rounded-lg leading-tight"
                            :class="isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-200'" />


                    </div>
                    <SendHorizontal :size="40" class="cursor-pointer" @click="sendMessage" />
                </div>
            </div>

            <div id="side-bar" :class="isDarkMode ? 'bg-blue-300/30' : 'bg-blue-400'"
                class="w-1/3 h-full rounded-lg ml-2 p-2 hidden">
                <div id="contact-person" class="flex flex-col items-center justify-center mt-4 h-auto">
                    <Aperture :size="100" :color="isDarkMode ? 'white' : 'black'" />
                    <span class="mt-4 font-bold text-2xl mx-1 text-center"></span>
                    <span id="status" class="font-semibold text-xl">Active</span>
                </div>

                <div class="w-auto h-0.5 my-4" :class="isDarkMode ? 'bg-blue-300/20' : 'bg-black/20'"></div>

                <div class="flex flex-col space-y-2 ml-3">
                    <div class="flex items-center space-x-2 cursor-pointer text-xl font-semibold">
                        <User :size="20" />
                        <span>Nickname</span>
                    </div>
                    <div class="flex items-center space-x-2 cursor-pointer text-xl font-semibold">
                        <Palette :size="20" />
                        <span>Theme</span>
                    </div>
                    <div class="flex items-center space-x-2 cursor-pointer text-xl font-semibold">
                        <VolumeX :size="20" />
                        <span>Mute</span>
                    </div>
                    <div class="flex items-center space-x-2 cursor-pointer text-xl font-semibold">
                        <UserCircle2 :size="20" />
                        <span>Profile</span>
                    </div>
                    <div class="flex items-center space-x-2 cursor-pointer text-xl font-semibold">
                        <Video :size="20" />
                        <span>Video</span>
                    </div>
                    <div class="flex items-center space-x-2 cursor-pointer text-xl font-semibold">
                        <Phone :size="20" />
                        <span>Call</span>
                    </div>
                    <div class="flex items-center space-x-2 cursor-pointer text-xl font-semibold">
                        <Pin :size="20" />
                        <span>Pin</span>
                    </div>
                </div>

                <div class="w-auto h-0.5 my-4" :class="isDarkMode ? 'bg-blue-300/20' : 'bg-black/20'"></div>

                <div class="flex flex-col space-y-2 ml-3">
                    <div class="flex items-center space-x-2 cursor-pointer text-orange-400 text-xl font-semibold">
                        <Ban :size="20" />
                        <span>Block</span>
                    </div>
                    <div class="flex items-center space-x-2 cursor-pointer text-yellow-400 text-xl font-semibold">
                        <BadgeAlert :size="20" />
                        <span>Report</span>
                    </div>
                    <div class="flex items-center space-x-2 cursor-pointer text-red-400 text-xl font-semibold">
                        <DeleteIcon :size="20" />
                        <span>Delete</span>
                    </div>
                </div>

                <div class="w-auto h-0.5 my-4" :class="isDarkMode ? 'bg-blue-300/20' : 'bg-black/20'"></div>

                <div class="flex justify-center items-center space-x-2 cursor-pointer text-2xl font-semibold">
                    <AtSign :size="30" />
                    <span href="#">Aldrin Belardo</span>
                </div>
            </div>
        </div>
    </section>
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
