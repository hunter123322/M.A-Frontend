<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'; // Import lifecycle hooks
import {
    MessageSquare, User, Heart,
    Settings, Edit, ChevronRight, Plus,
    X,
    ExternalLink
} from 'lucide-vue-next';
import { myProfileData } from '@/stores/user';
import ProfilePost from '@/components/profile/ProfilePost.vue';
import PostSection from '@/components/main/PostSection.vue';
import { profilePreview } from '@/stores/profile/profile.preview';

type UserData = {
    id: number;
    email: string;
    bio: string;
    avatar: string;
    interests: string[];
    posts: number;
};

const showPost = ref(false)
const pageLoad = ref(false)

// Define the handler function
const checkScrollToBottom = () => {
    // Window.scrollY (or document.documentElement.scrollTop): How far the user has scrolled from the top.
    const scrollPosition = window.scrollY || document.documentElement.scrollTop;

    // document.documentElement.offsetHeight (or document.body.offsetHeight): The full height of the entire page content.
    const documentHeight = document.documentElement.offsetHeight;

    // window.innerHeight: The height of the viewport (the visible area of the browser window).
    const viewportHeight = window.innerHeight;

    // The user is at the bottom when:
    // (Scroll Position + Viewport Height) is approximately equal to the Document Height.
    // We use a small tolerance (e.g., 5 pixels) because of potential browser rendering differences.
    if (scrollPosition + viewportHeight >= documentHeight - 5) {
        console.log("Youre in the buttom");
    }
};


// Add the event listener when the component is mounted (appears on the page)
onMounted(() => {
    // Attach the function to the window's scroll event
    window.addEventListener('scroll', checkScrollToBottom);
});

// Remove the event listener when the component is destroyed (leaves the page)
onUnmounted(() => {
    // Crucial for performance and preventing memory leaks in single-page applications
    window.removeEventListener('scroll', checkScrollToBottom);
});

</script>

<template id="profile-template">
    <div class="pb-20">
        <header class="md:mt-0 p-4 pt-8 bg-gray-800/50 backdrop-blur-sm sticky top-0 z-10 border-b border-gray-700">

            <div class="flex relative items-center space-x-4">

                <div class="relative">
                    <img :src="`./avatar/Avatar_${profilePreview?.user_avatar}.png`" alt="User Avatar"
                        class="w-20 h-20 rounded-full object-cover border-4 border-pink-500 shadow-xl shadow-pink-500/20" />
                    <button
                        class="absolute bottom-0 right-0 bg-gray-900 border border-gray-700 p-1 rounded-full text-pink-400 hover:text-white hover:bg-pink-600 transition-all">
                        <Plus class="w-4 h-4" />
                    </button>
                </div>

                <div class="space-y-1">
                    <p class="text-xl font-extrabold text-white">{{ profilePreview?.user_nickname }}</p>
                    <p class="text-xs text-gray-400">Followers: {{ profilePreview?.user_follower }}
                        | Following: {{ profilePreview?.user_following }}</p>
                    <button
                        class="flex items-center text-xs font-medium text-purple-300 bg-purple-900/50 border border-purple-600/50 px-3 py-1 rounded-full hover:bg-purple-800 transition-colors">
                        Edit Profile
                        <Edit class="w-3 h-3 ml-1" />
                    </button>
                </div>


            </div>
            
            <button v-show="myProfileData !== profilePreview" class="absolute top-0 right-0 p-2 m-1 rounded-full bg-gray-800 hover:bg-gray-600">
                <ExternalLink @click="" class="w-5 h-5 text-gray-300" />
            </button>

            <p class="text-xs text-gray-300 mt-4 italic leading-relaxed">{{ profilePreview?.user_bio }}</p>

            <!-- <div class="mt-4 flex flex-wrap gap-2">
                <span v-for="interest in mockUser.interests" :key="interest"
                    class="text-xs font-mono text-pink-300 bg-pink-900/50 px-3 py-1 rounded-full border border-pink-600/50">
                    #{{ interest }}
                </span>
            </div> -->
            <PostSection v-show="showPost" class="mt-8 h-[calc(50%)]" />
            <div class="flex">
                <span class="bg-blue-900 px-4 py-2 rounded-lg cursor-pointer mt-8" v-show="!showPost"
                    @click="showPost = true">Add Post</span>
                <span class="bg-red-500 px-4 py-2 rounded-lg cursor-pointer" v-show="showPost"
                    @click="showPost = false">Close</span>
            </div>

        </header>

        <h2 class="text-xl mt-4 mx-4 md:mx-0 font-bold text-white flex items-center justify-between">
            <span class="border-b-2 border-pink-500 pb-1">My Posts</span>
            <ChevronRight class="w-5 h-5 text-gray-400" />
        </h2>
        <section class="pt-4 space-y-6">
            <ProfilePost />
        </section>
    </div>
</template>