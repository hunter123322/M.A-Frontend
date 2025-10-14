<script setup lang="ts">
import { ref } from "vue";
import { Copy, Pencil, Trash2, Smile } from "lucide-vue-next";
import { isMessageEvent } from "@/stores/message";

const showEmojiPopup = ref(false);

// Handle each button's action
const handleReact = () => {
    showEmojiPopup.value = !showEmojiPopup.value;
};

const handleCopy = () => {
    console.log("Copy clicked");
};

const handleEdit = () => {
    console.log("Edit clicked");
};

const handleDelete = () => {
    console.log("Delete clicked");
};
</script>

<template>
    <section :class="isMessageEvent ? 'flex' : 'hidden'" class="absolute bg-gray-500/50 rounded-lg p-1 flex-col gap-1">

        <div
            class="flex items-center gap-2 p-2 px-4 rounded-md transition-colors duration-300 hover:bg-gray-700 cursor-pointer">
            <Smile :size="20" @click="handleReact" />
            <h1>React</h1>
        </div>

        <div
            class="flex items-center gap-2 p-2 px-4 rounded-md transition-colors duration-300 hover:bg-gray-700 cursor-pointer">
            <Copy :size="20" />
            <h1>Copy</h1>
        </div>

        <div
            class="flex items-center gap-2 p-2 px-4 rounded-md transition-colors duration-300 hover:bg-gray-700 cursor-pointer">
            <Pencil :size="20" />
            <h1>Edit</h1>
        </div>

        <div
            class="flex items-center gap-2 p-2 px-4 text-red-500 rounded-md transition-colors duration-300 hover:bg-gray-700 cursor-pointer">
            <Trash2 :size="20" />
            <h1>Delete</h1>
        </div>
    </section>
</template>