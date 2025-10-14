<script setup lang="ts">
import { Settings, Sun, Moon, BellOff, X, Aperture } from 'lucide-vue-next';
import axios from 'axios';
import { ref } from 'vue';
import { useTheme } from '@/stores/theme';
import { useMessages } from '@/stores/message';
import { useReceiver } from '@/stores/receiver';
import { useConversation } from '@/stores/conversation';
import { useReqData } from '@/stores/getMessageData';
import { socket } from '@/script/socket.event';

const { messages, removeMessage } = useMessages();
const { currentReceiverID } = useReceiver();
const { currentConversationID, conversationData } = useConversation();
const { returnMessageData } = useReqData();
const currentUser = localStorage.getItem("user_id")

// Types 
type SearchContact = {
    user_id: number,
    firstName: string,
    lastName: string,
    middleName?: string,
    age?: string
}

const { isDark, toggleDarkMode } = useTheme();

const contactSearchRef = ref<HTMLInputElement | null>(null);
const searchContact = ref<SearchContact[] | null>(null);

// Hanlde Contact
function handleClick(event: MouseEvent, conversationID: string, receiverID: string) {
    console.log(receiverID, messages.value);

    const div = event.currentTarget as HTMLElement;
    const span = div.querySelector("span");
    const spanText = span?.textContent ?? "";

    const contactPerson = document.getElementById("contact-person");
    if (!contactPerson) return;
    const targetSpan = contactPerson.querySelector("span");
    const sideBar = document.getElementById("right-nav") as HTMLElement;

    if (!targetSpan) return;
    targetSpan.textContent = spanText;
    sideBar.classList.remove("hidden");

    messages.value = returnMessageData.value.filter(
        msg => msg.conversationID === conversationID
    );

    // Assign the receiverID
    // Prevent to load the same ID
    if (currentReceiverID.value === receiverID) return;

    // Assign the new receiverID
    currentReceiverID.value = receiverID;

    // Preventing to join in the same room
    if (currentConversationID.value === conversationID) return;

    // Prevent from joining multiple rooms at once by leaving the room
    socket.emit("leaveRoom", currentConversationID.value);

    // Assign the new conversationID
    currentConversationID.value = conversationID;

    // Join in new conversationID
    socket.emit("joinConversation", currentConversationID.value);
}

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
    <section :class="isDark ? 'bg-black' : 'bg-white'" class="flex flex-col h-screen w-1/4 pr-3">
        <div :class="isDark ? 'bg-blue-400/40' : 'bg-blue-300'" class="h-1/4 w-full rounded-lg mb-2 p-1">
            <div id="profile-section" class="m-1 p-2 flex flex-row items-center">
                <Aperture :size="50" :color="isDark ? 'white' : 'black'" />
                <h1 class="font-semibold text-xl px-2">Aldrin Belardo</h1>
                <button class="ml-20 cursor-pointer w-auto h-auto" @click="toggleDarkMode">
                    <Settings :size="35" :color="isDark ? 'white' : 'black'" />
                </button>
            </div>
            <div class="flex ml-3 align-bottom items-center ">
                <input ref="contactSearchRef" id="search-contact" type="text" placeholder="Search Contact"
                    @keydown="handleContactSearch" class="w-auto h-10 px-4 bg-gray-400 rounded-lg text-black" />
                <label class="relative inline-block w-14 h-8 ml-6 cursor-pointer">
                    <input type="checkbox" v-model="isDark" class="sr-only peer">
                    <span :class="isDark ? 'hidden' : 'flex'">
                        <Sun :size="30" />
                    </span>
                    <span :class="isDark ? 'flex' : 'hidden'">
                        <Moon :size="30" />
                    </span>
                </label>
            </div>
            <span class="flex mt-2 ml-4">Active</span>
        </div>

        <div :class="isDark ? 'bg-blue-400/40' : 'bg-blue-300'"
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
    </section>
</template>