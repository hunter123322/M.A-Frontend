<script setup lang="ts">
import {
    Aperture, Settings, User,
    Palette, VolumeX, UserCircle2,
    Video, Phone, Pin,
    DeleteIcon, BadgeAlert, AtSign,
    SendHorizontal, Ban, CircleEllipsis,
    Sun, Moon, EllipsisVertical,
    BellOff, X
} from 'lucide-vue-next';
import { ref, onMounted, nextTick, watch } from 'vue';
import { EmitMenuAction } from '@/script/socket.event';
import { socket } from '@/script/socket.event';
import LoadingIcon from '@/components/homeComponents/LoadingIcon.vue';
import axios from 'axios';
const currentUser = localStorage.getItem("user_id");

let crurentConversationID: string | null = null;
let currentReceiverID: string | null = null;

type Participant = {
    userID: string,
    firstName: string,
    lastName: string,
    nickname: string,
    mute: { muteStatus: false, timeFrame: "" },
    createdAt?: string,
    updatedAt?: string
}

type Contacts = {
    contactID: string,
    _id?: string,
    createdAt?: string,
    updatedAt?: string,
    participant: Participant[]
}

type ContactVal = {
    success: boolean,
    contacts: Contacts[]
}

type SearchContact = {
    user_id: string,
    firstName: string,
    lastName: string,
    middleName?: string,
    age?: string
}
let conversationData: Contacts[] = []
const searchContact = ref<SearchContact[] | null>(null);


const initialLoad = ref(false)

socket.emit("initContact", currentUser, async (val: ContactVal) => {
    conversationData = val.contacts
    initialLoad.value = true
})
socket.emit("joinConversation", crurentConversationID);

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

const dataTobeSent = {
    conversationID: "convAB",
    createdAt: ""
}

socket.emit("getMessage", dataTobeSent, (val: Val) => {
    socketMessage = val.messages;
});

const messageContainer = ref<HTMLElement | null>(null);
const isDarkMode = ref(true);
const messageStates = ref<{ [key: string]: boolean }>({})
const messages = ref<TestMessage[]>([]);
const inputRef = ref<HTMLInputElement | null>(null); // input field reference


function scrollToBottom() {
    if (messageContainer.value) {
        messageContainer.value.scrollTop = messageContainer.value.scrollHeight;
    }
}

function handleScroll() {
    const el = messageContainer.value
    if (!el) return

    // At the very top
    if (el.scrollTop === 0) {
        const lastMessage = messages.value[0]
        dataTobeSent.createdAt = lastMessage.createdAt;
        socket.emit("getMessage", dataTobeSent, (val: Val) => {
            socketMessage = val.messages;
        });
    }
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
        receiverID: currentReceiverID as string, // set your receiver dynamically
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
    socketMessage.push(receivedMessage);
});

function handleClick(event: MouseEvent, conversationID: string, receiverID: string) {
    console.log(receiverID, messages.value);

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

    // Assign the receiverID
    // Prevent to load the same ID
    if (currentReceiverID === receiverID) return;

    // Assign the new receiverID
    currentReceiverID = receiverID;

    // Preventing to join in the same room
    if (crurentConversationID === conversationID) return;

    // Prevent from joining multiple rooms at once by leaving the room
    socket.emit("leaveRoom", crurentConversationID);

    // Assign the new conversationID
    crurentConversationID = conversationID;

    // Join in new conversationID
    socket.emit("joinConversation", crurentConversationID);
}

const contactSearchRef = ref<HTMLInputElement | null>(null)

// Contact Search
async function fetchContact() {
    try {
        const text = contactSearchRef.value?.value.trim();
        if (!text) return;

        // Send request to server 
        const response = await axios.get<SearchContact[]>('http://localhost:3000/contact/search', {
            params: { contactSearch: text },
            withCredentials: true
        });


        if (response.status !== 200) return;
        const responseData = response.data as SearchContact[];

        console.log(responseData);
        searchContact.value = responseData;


    } catch (error) {
        console.log(error)
    }
}

function removeSearchContact() {
    searchContact.value = null
}

function handleContactSearch(e: KeyboardEvent) {
    const target = e.target as HTMLInputElement;

    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        fetchContact();
    }
}

function sideBar(event: MouseEvent) {
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

    messages.value = [];

    
}


</script>


<template>
    <LoadingIcon size="lg" color="blue" :class="initialLoad ? 'hidden' : 'absolute'" class=" left-1/2 top-1/2 ">Fetching
        messages...
    </LoadingIcon>
    <section :class="[
        isDarkMode ? 'bg-black text-white' : 'bg-white text-black',
        initialLoad ? 'flex' : 'hidden'
    ]" class=" flex-row">
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
                    <input ref="contactSearchRef" id="search-contact" type="text" placeholder="Search Contact"
                        @keydown="handleContactSearch" class="w-auto h-10 px-4 bg-gray-400 rounded-lg text-black" />
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

                <div :class="searchContact === null ? 'hidden' : 'flex'"
                    class="h-auto w-full bg-blue-100/10 rounded-lg p-1 flex-col">
                    <div class="flex justify-between w-full">
                        <span>Search...</span>
                        <X :size="20" @click="removeSearchContact"
                            class="hover:scale-150 hover:text-red-400 duration-300 cursor-pointer" />
                    </div>
                    <div class="w-full h-0.5 rounded-lg my-2 bg-white" />
                    <div v-for="contact in searchContact" :key="contact.user_id" :id="contact.user_id"
                        @click="sideBar($event)"
                        class="flex flex-row items-center p-1 my-1 bg-gray-900/50 rounded-lg hover:bg-gray-900/65">
                        <Aperture :size="20" class="mx-1" />
                        <span>{{ contact.firstName + " " + contact.lastName }}</span>
                    </div>

                </div>

                <!-- 
                Loop through all conversations using v-for. 
                For each conversation:
                    - The :key helps Vue track each item efficiently.
                    - The :receiverID uses a shorthand if-else (ternary) to pick the other participant:
                            conversation.participant[0].userID === currentUser ? conversation.participant[1].userID : conversation.participant[0].userID means:
                    If participant[0] is the current user, use participant[1]'s ID, otherwise use participant[0]'s ID. -->
                <div v-for="conversation in conversationData" :key="conversation._id" :id="conversation.contactID"
                    :receiverID="conversation.participant[0].userID === currentUser
                        ? conversation.participant[1].userID
                        : conversation.participant[0].userID"
                    class="flex w-full h-15 bg-gray-900/50 rounded-lg my-1 mb-2 hover:bg-gray-900 duration-150 items-center pl-2"
                    @click="handleClick(
                        $event,
                        conversation.contactID,
                        conversation.participant[0].userID === currentUser
                            ? conversation.participant[1].userID
                            : conversation.participant[0].userID
                    )">

                    <div v-if="conversation.participant[0].userID !== currentUser"
                        class="relative flex justify-between w-full">
                        <span>{{ conversation.participant[0].firstName }}</span>
                        <span v-if="false"
                            class="absolute right-1 -top-4 h-1 w-1 animate-ping rounded-full bg-red-500"></span>
                        <span v-if="false" class="absolute right-1 -top-4 h-2 w-2 rounded-full bg-red-400"></span>
                        <BellOff v-if="conversation.participant[0].mute.muteStatus" :size="20"
                            class="flex items-center mr-2" />
                    </div>

                    <div v-else class="relative flex justify-between w-full">
                        <span>
                            {{ conversation.participant[1].firstName }} </span>
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

                <div ref="messageContainer" @scroll="handleScroll"
                    class="flex flex-col rounded-lg h-screen overflow-y-auto">
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

                        <!-- Message Status -->
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
