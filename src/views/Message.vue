<template>
  <div class="flex flex-col h-dvh bg-gray-900 text-gray-100">
    <!-- Header -->
    <header :class="isMessageEvent ? 'hidden' : 'flex'"
      class="p-4 border-b border-gray-800 items-center justify-between">
      <h1 class="text-lg font-bold">Messages</h1>
      <button class="p-2 rounded-full bg-gray-800 hover:bg-gray-700">
        <MessageSquareDashed class="w-5 h-5 text-gray-300" />
      </button>
    </header>

    <Contact v-show="!isMessageEvent" />

    <div v-show="isMessageEvent" class="h-screen">
      <header class="h-10% flex flex-row p-4 rounded-t-lg border border-gray-700 items-center justify-between">
        <h1 class="text-lg font-bold">{{ contactName }}</h1>
        <button class="p-2 rounded-full bg-gray-800 hover:bg-gray-700">
          <X @click="[removeSeenMessage(), isMessageEvent = false ]" class="w-5 h-5 text-gray-300" />
        </button>
      </header>
      <MessageComponent class="h-[90%] w-auto" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { X, MessageSquareDashed } from 'lucide-vue-next';
import Contact from '@/components/Contact.vue';
import MessageComponent from '@/components/auth/MessageComponent.vue';
import { isMessageEvent, unseenMessage } from '@/stores/message';
import { contactName } from '@/stores/contact';
import { useReceiver } from '@/stores/receiver';


function removeSeenMessage() {
  const userID = useReceiver().currentReceiverID.value
  const index = unseenMessage.value.findIndex(u => u.userID === userID)

  if (index !== -1) {
    unseenMessage.value.splice(index, 1) // remove the entry
  }

}


</script>
