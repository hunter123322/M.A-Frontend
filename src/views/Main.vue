<script setup lang="ts">
import { ref, onMounted, nextTick } from "vue";
import PostSection from "@/components/main/PostSection.vue";
// import { posts } from "@/stores/profile/postMock";

import {
    MessageCircle,
    Phone,
    Heart,
    MessageSquare,
    Share2,
    CircleEllipsis, SendHorizontal
} from "lucide-vue-next";
import { socket } from "@/script/socket.event";
import ProfilePost from "@/components/profile/ProfilePost.vue";

type User = {
    id: string;
    email: string;
    avatarUrl: string;
};

type Reply = {
    id: string;
    text: string;
    likes: number;
    author: User;
};

type Comment = {
    id: string;
    text: string;
    likes: number;
    author: User;
    replies: Reply[];
    showReply?: boolean;
    replyText?: string;
};

type Post = {
    id: string;
    author: User;
    imageUrl: string;
    caption: string;
    likes: number;
    comments: Comment[];
    timestamp: string;
};

const posts = ref<Post[]>([
    {
        id: "1",
        author: {
            id: "u1",
            email: "Merlyn",
            avatarUrl: "./avatar/Avatar_2.png",
        },
        imageUrl: "./avatar/Avatar_2.png",
        caption: "HAHAHA cute",
        likes: 125,
        comments: [
            {
                id: "c1",
                text: "Wow, that looks amazing! 🌅",
                likes: 5,
                author: {
                    id: "u2",
                    email: "Jenna",
                    avatarUrl: "https://placehold.co/100x100/F72585/FFFFFF?text=J",
                },
                replies: [
                    {
                        id: "r1",
                        text: "Right? Makes me want to travel!",
                        likes: 2,
                        author: {
                            id: "u3",
                            email: "Chris",
                            avatarUrl:
                                "https://placehold.co/100x100/4361EE/FFFFFF?text=C",
                        },
                    },
                ],
            },
        ],
        timestamp: "2 hours ago",
    },
    {
        id: "2",
        author: {
            id: "u2",
            email: "Jenna",
            avatarUrl: "https://placehold.co/100x100/F72585/FFFFFF?text=J",
        },
        imageUrl: "https://placehold.co/600x400/161B22/FFFFFF?text=City+Lights",
        caption: "Exploring the city lights. What a view!",
        likes: 230,
        comments: [
            {
                id: "c2",
                text: "That skyline is insane 🤯",
                likes: 12,
                author: {
                    id: "u1",
                    email: "Alex",
                    avatarUrl: "https://placehold.co/100x100/7209B7/FFFFFF?text=A",
                },
                replies: [],
            },
        ],
        timestamp: "5 hours ago",
    },
]);

const newComments = ref<Record<string, string>>({});
const isCommentId = ref<string[]>([])

function showComment(id: string) {

    if (isCommentId.value.includes(id)) {
        isCommentId.value = isCommentId.value.filter(item => item !== id)
    } else {
        isCommentId.value.push(id)
    }
    console.log(isCommentId.value);

}


const addComment = (postId: string) => {
    const text = newComments.value[postId]?.trim();
    if (!text) return;

    const post = posts.value.find((p) => p.id === postId);
    if (post) {
        post.comments.push({
            id: Date.now().toString(),
            text,
            likes: 0,
            author: {
                id: "me",
                email: "You",
                avatarUrl: "https://placehold.co/100x100/FFFFFF/000000?text=U",
            },
            replies: [],
        });
        newComments.value[postId] = "";
    }
};

const addReply = (postId: string, commentId: string, replyText?: string) => {
    const text = replyText?.trim();
    if (!text) return;

    const post = posts.value.find((p) => p.id === postId);
    const comment = post?.comments.find((c) => c.id === commentId);

    if (comment) {
        comment.replies.push({
            id: Date.now().toString(),
            text,
            likes: 0,
            author: {
                id: "me",
                email: "You",
                avatarUrl: "https://placehold.co/100x100/FFFFFF/000000?text=U",
            },
        });
        comment.replyText = "";
        comment.showReply = false;
    }
};

const isChatLoading = ref(false)
const isAudioLoading = ref(false)

const startChat = async () => {
    socket.emit("/chat/room/waiting", { age: 17, sex: "Male" })
    isChatLoading.value = true
}

const startAudio = async () => {
    isAudioLoading.value = true
    await new Promise(resolve => setTimeout(resolve, 2000)) // simulate async
    isAudioLoading.value = false
    // proceed to audio call logic here
}
const convID = ref<string | null>(null)
socket.on("/chat/room/id", async (data: string) => {
    console.log('/chat/room/id: ', data);
    convID.value = data
    searching.value = false
    isOnChat.value = true
    endCall.value = true
});
socket.on("/chat/room/receive/msg", (msg: Message) => {
    messages.value.push(msg);

})

interface Message {
    senderID: string;
    content: string;
    convID?: string | null
}

const endCall = ref(false);
const currentUser = localStorage.getItem("user_id")
const messages = ref<Message[]>([]);
const inputRef = ref<HTMLInputElement | null>(null);
const messageContainer = ref<HTMLDivElement | null>(null);

const sendMessage = () => {
    const value = inputRef.value?.value?.trim();
    if (!value) return;
    const msg = {
        senderID: currentUser,
        content: value,
        convID: convID.value
    }
    socket.emit("/chat/room/message", msg)

    inputRef.value!.value = "";
    nextTick(() => {
        messageContainer.value?.scrollTo({
            top: messageContainer.value.scrollHeight,
            behavior: "smooth",
        });
    });
};

function handleClose() {
    searching.value = false
    isOnChat.value = false;
    endCall.value = false;
    socket.emit("/chat/room/leave");
}

const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter") sendMessage();
};

const handleScroll = () => { };

const searching = ref(false)
const isOnChat = ref(false)

</script>

<template>
    <div :class="searching || isOnChat ? 'flex relative' : 'hidden'"
        class="flex-col bg-gray-900 h-dvh w-full z-41 items-center justify-between">
        <!-- Loading Dots Animation -->
        <div v-show="searching" class="absolute inset-0 flex flex-col-reverse items-center justify-center">
            <div class="container-dot top-1/4 absolute">
                <div v-for="n in 7" :key="n" class="ball"></div>
            </div>

            <div class="absolute bottom-1/10 w-full px-20 flex flex-row justify-center items-center">
                <button @click="handleClose()"
                    class="px-6 mx-8 py-2 rounded-lg bg-red-800 text-gray-200 font-medium hover:bg-red-500 active:scale-95 transition-all duration-150 shadow-md">
                    Close
                </button>
                <button
                    class="px-6 mx-8 py-2 rounded-lg bg-blue-700 text-white font-medium hover:bg-blue-600 active:scale-95 transition-all duration-150 shadow-md">
                    Accelerate
                </button>
            </div>

        </div>

        <!-- Chat Section -->
        <div class="bg-blue-900/30 flex flex-col w-full h-full">
            <!-- Streaming Section -->
            <Streaming />

            <!-- Chat Messages -->
            <div v-show="endCall" ref="messageContainer" @scroll="handleScroll"
                class="flex flex-col flex-1 overflow-y-auto p-4 space-y-3">
                <div v-for="msg in messages" :key="msg.content" class="flex"
                    :class="msg.senderID === currentUser ? 'justify-end' : 'justify-start'">
                    <div class="max-w-xs rounded-2xl px-4 py-2 text-sm break-words" :class="msg.senderID === currentUser
                        ? 'bg-blue-700 text-white'
                        : 'bg-gray-800 text-white'">
                        {{ msg.content }}
                    </div>
                </div>
            </div>

            <!-- Message Input -->
            <div :class="endCall ? 'flex' : 'hidden'" class="p-3 items-center gap-3 bg-gray-800 text-gray-200">
                <input id="message-input" ref="inputRef" type="text" placeholder="Say something..."
                    @keydown="handleKeyDown"
                    class="flex-1 px-4 py-2 text-sm rounded-lg outline-none focus:ring-2 transition bg-blue-600 text-white focus:ring-blue-400" />
                <SendHorizontal :size="22" class="cursor-pointer hover:scale-105 transition-transform"
                    @click="sendMessage" />
            </div>
        </div>
    </div>

    <div :class="searching || isOnChat ? 'hidden' : ''"
        class="mx-auto md:mt-15 p-4 md:pt-6 md:p-0 pb-20 space-y-8 text-white">
        <!-- Find Stranger Section -->
        <section class="bg-gray-900 rounded-2xl p-3 border border-gray-800 shadow-lg">
            <h2
                class="text-xl font-bold mb-2 text-transparent bg-clip-text bg-[linear-gradient(to_right,#F72585,#B5179E,#7209B7)]">
                Discover New People
            </h2>
            <p class="mb-6 sm:text-xs">
                Step out of your comfort zone. A new connection is just a click away.
            </p>

            <div class="flex flex-col sm:flex-row gap-4">
                <!-- Start Chatting -->
                <button @click="[startChat(), searching = true]"
                    class="relative flex-1 flex items-center justify-center gap-3 bg-gradient-to-r from-pink-500 to-purple-800 hover:opacity-90 transition-opacity duration-300 text-white font-semibold py-3 px-6 rounded-xl shadow-md disabled:opacity-60">
                    <MessageCircle class="w-5 h-5" />
                    <span>Start Chatting</span>
                </button>

                <!-- Audio Call -->
                <button @click="startAudio"
                    class="relative flex-1 flex items-center justify-center gap-3 bg-gray-700/60 hover:bg-gray-700 transition-colors duration-300 text-white font-semibold py-3 px-6 rounded-xl border border-gray-800 disabled:opacity-60"
                    :disabled="isAudioLoading">
                    <template v-if="isAudioLoading">
                        <LoadingSpinner />
                        <span>Calling...</span>
                    </template>
                    <template v-else>
                        <Phone class="w-5 h-5" />
                        <span>Audio Call</span>
                    </template>
                </button>
            </div>
        </section>

        <PostSection class="bg-sky-950" />

        <!-- Feeds Section -->
        <section class="space-y-6">
            <ProfilePost />
        </section>
    </div>
</template>

<style scoped>
.container-dot {
    width: 200px;
    height: 100px;
    padding-top: 100px;
    margin: 0 auto;
}

.ball {
    width: 10px;
    height: 10px;
    margin: 10px auto;
    border-radius: 50px;
}

.ball:nth-child(1) {
    background: #ffffff;
    -webkit-animation: right 1s infinite ease-in-out;
    -moz-animation: right 1s infinite ease-in-out;
    animation: right 1s infinite ease-in-out;
}

.ball:nth-child(2) {
    background: #ffffff;
    -webkit-animation: left 1.1s infinite ease-in-out;
    -moz-animation: left 1.1s infinite ease-in-out;
    animation: left 1.1s infinite ease-in-out;
}

.ball:nth-child(3) {
    background: #ffffff;
    -webkit-animation: right 1.05s infinite ease-in-out;
    -moz-animation: right 1.05s infinite ease-in-out;
    animation: right 1.05s infinite ease-in-out;
}

.ball:nth-child(4) {
    background: #ffffff;
    -webkit-animation: left 1.15s infinite ease-in-out;
    -moz-animation: left 1.15s infinite ease-in-out;
    animation: left 1.15s infinite ease-in-out;
}

.ball:nth-child(5) {
    background: #ffffff;
    -webkit-animation: right 1.1s infinite ease-in-out;
    -moz-animation: right 1.1s infinite ease-in-out;
    animation: right 1.1s infinite ease-in-out;
}

.ball:nth-child(6) {
    background: #ffffff;
    -webkit-animation: left 1.05s infinite ease-in-out;
    -moz-animation: left 1.05s infinite ease-in-out;
    animation: left 1.05s infinite ease-in-out;
}

.ball:nth-child(7) {
    background: #ffffff;
    -webkit-animation: right 1s infinite ease-in-out;
    -moz-animation: right 1s infinite ease-in-out;
    animation: right 1s infinite ease-in-out;
}

@-webkit-keyframes right {
    0% {
        -webkit-transform: translate(-15px);
    }

    50% {
        -webkit-transform: translate(15px);
    }

    100% {
        -webkit-transform: translate(-15px);
    }
}

@-webkit-keyframes left {
    0% {
        -webkit-transform: translate(15px);
    }

    50% {
        -webkit-transform: translate(-15px);
    }

    100% {
        -webkit-transform: translate(15px);
    }
}

@-moz-keyframes right {
    0% {
        -moz-transform: translate(-15px);
    }

    50% {
        -moz-transform: translate(15px);
    }

    100% {
        -moz-transform: translate(-15px);
    }
}

@-moz-keyframes left {
    0% {
        -moz-transform: translate(15px);
    }

    50% {
        -moz-transform: translate(-15px);
    }

    100% {
        -moz-transform: translate(15px);
    }
}

@keyframes right {
    0% {
        transform: translate(-15px);
    }

    50% {
        transform: translate(15px);
    }

    100% {
        transform: translate(-15px);
    }
}

@keyframes left {
    0% {
        transform: translate(15px);
    }

    50% {
        transform: translate(-15px);
    }

    100% {
        transform: translate(15px);
    }
}

.message-enter-active {
    transition: all 0.2s ease-out;
}

.message-enter-from {
    opacity: 0;
    transform: translateY(10px);
}
</style>