<script setup lang="ts">
import { BellOff, X, Aperture } from 'lucide-vue-next';
import axios from 'axios';
import { ref } from 'vue';
import { messageSummary, unseenMessage, useMessages } from '@/stores/message';
import { currReceiverID, useReceiver } from '@/stores/receiver';
import { useConversation } from '@/stores/conversation';
import { useReqData } from '@/stores/getMessageData';
import { socket } from '@/script/socket.event';

const { messages } = useMessages();
const { currentReceiverID } = useReceiver();
const { currentConversationID, conversationData } = useConversation();
const { returnMessageData } = useReqData();
import { isMessageEvent } from '@/stores/message';
import { contactName, newContact } from '@/stores/contact';
const currentUser = Number(localStorage.getItem("user_id") || "");

// Types 
type SearchContact = {
    user_id: number;
    firstName: string;
    lastName: string;
    middleName?: string;
    age?: number;
    user_avatar: number;
    user_bio?: string;
    user_follower: number;
    user_following: number;
    user_nickname: string;
};




const contactSearchRef = ref<HTMLInputElement | null>(null);
const searchContact = ref<SearchContact[] | null>(null);

// Hanlde Contact
function handleClick(receiverID: number, conversationID?: string | null) {
    console.log(receiverID, conversationID);
    returnMessageData.value = JSON.parse(localStorage.getItem('messageData') || '[]')

    if (!conversationID && searchContact) {
        conversationID = null
        const contact = searchContact.value?.find(e => e.user_id === receiverID)

        if (contact) {
            newContact.value = contact;
            contactName.value = `${contact.firstName} ${contact.lastName}`
            console.log(`${contact.firstName} ${contact.lastName}`);

            conversationID = contact.user_id < currentUser ? `conv${contact.user_id}_${currentUser}` : `conv${currentUser}_${contact.user_id}`
        }

    } else {
        const filter = conversationData.value
            .find(e => e.participant[0].userID === receiverID || e.participant[1].userID === receiverID)

        contactName.value = filter
            ? (filter.participant[0].userID === receiverID
                ? `${filter.participant[0].firstName} ${filter.participant[0].lastName}`
                : `${filter.participant[1].firstName} ${filter.participant[1].lastName}`)
            : undefined;
    }

    messages.value = returnMessageData.value.filter(
        msg => msg.conversationID === conversationID
    );
    console.log(messages.value);
    isMessageEvent.value = true

    // Prevent to load the same ID
    if (currentReceiverID.value === receiverID) return;

    // Assign the new receiverID
    currentReceiverID.value = receiverID;

    // Preventing to join in the same room
    if (currentConversationID.value === conversationID) return;

    // Prevent from joining multiple rooms at once by leaving the room
    socket.emit("leaveRoom", currentConversationID.value);

    // Assign the new conversationID
    currentConversationID.value = conversationID ?? null;

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

    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        fetchContact();
    }
}

</script>

<template>
    <section class="flex flex-col h-full w-full p-4 md:p-0 py-4 bg-gray-900 text-gray-100">
        <!-- Search Bar -->
        <div class="w-full mb-3">
            <div class="flex items-center bg-gray-800 rounded-lg px-3 py-2 shadow-sm">
                <input ref="contactSearchRef" id="search-contact" type="text" placeholder="Search contact..."
                    @keydown="handleContactSearch"
                    class="flex-1 bg-transparent focus:outline-none text-xs placeholder-gray-400" />
            </div>
        </div>

        <!-- Main Body -->
        <div class="flex-1 w-full overflow-y-auto space-y-4">
            <!-- Search Results -->
            <div v-if="searchContact !== null" class="bg-gray-800 rounded-lg mx-3 p-3 shadow-md">
                <div class="flex justify-between items-center mb-2">
                    <span class="text-xs font-semibold text-gray-300">Search Results</span>
                    <X :size="20" @click="removeSearchContact"
                        class="hover:text-red-400 hover:scale-125 transform transition cursor-pointer" />
                </div>

                <!-- Search Contact Result -->
                <div class="space-y-2">
                    <div v-for="contact in searchContact" :key="contact.user_id" :id="contact.user_id.toString()"
                        @click="handleClick(contact.user_id)"
                        class="flex items-center gap-2 px-3 py-2 rounded-md bg-gray-700/50 hover:bg-gray-700 cursor-pointer transition">
                        <img :src="`./avatar/Avatar_${contact.user_avatar}.png`" alt="Avater"
                            class="w-10 h-10 rounded-full">
                        <span class="truncate">{{ contact.firstName }} {{ contact.lastName }}</span>
                    </div>
                </div>
            </div>

            <!-- Conversations -->
            <div class="space-y-2">
                <div v-for="conversation in conversationData" :key="conversation._id" :id="conversation.contactID"
                    :receiverID="conversation.participant[0].userID === currentUser
                        ? conversation.participant[1].userID
                        : conversation.participant[0].userID"
                    class="flex items-center justify-between px-3 py-3 rounded-lg bg-gray-800 hover:bg-gray-700 transition cursor-pointer"
                    @click="
                        [isMessageEvent = true,
                        handleClick(
                            conversation.participant[0].userID === currentUser
                                ? conversation.participant[1].userID
                                : conversation.participant[0].userID,
                            conversation.contactID
                        )]
                        ">

                    <!-- Left: Avatar + Name -->
                    <div class="flex items-center gap-3">
                        <div
                            class="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 flex items-center justify-center text-xs font-bold">
                            {{
                                conversation.participant[0].userID !== currentUser
                                    ? conversation.participant[0].firstName.charAt(0)
                                    : conversation.participant[1].firstName.charAt(0)
                            }}
                        </div>
                        <span class="text-xs font-medium">
                            {{
                                conversation.participant[0].userID !== currentUser
                                    ? conversation.participant[0].firstName
                                    : conversation.participant[1].firstName
                            }}
                        </span>
                    </div>

                    <!-- Right: Status + Icons -->
                    <div :class="unseenMessage.find(e => e.userID === conversation.participant[0].userID || e.userID === conversation.participant[1].userID) ? 'flex' : 'hidden'"
                        class="items-center gap-2 relative">
                        <!-- Unread message counter -->
                        <div class="bg-red-500 text-white text-xs p-1.5 rounded-full font-semibold">
                            {{unseenMessage.find(e => e.userID === conversation.participant[0].userID || e.userID ===
                                conversation.participant[1].userID)?.unseenMessage}}
                        </div>

                        <!-- Mute Icon -->
                        <BellOff v-if="
                            conversation.participant[0].userID !== currentUser
                                ? conversation.participant[0].mute.muteStatus
                                : conversation.participant[1].mute.muteStatus
                        " :size="18" class="text-gray-400" />

                    </div>
                </div>
            </div>

            <!-- Global unseen counter (example display somewhere in header) -->
        </div>
    </section>
</template>
