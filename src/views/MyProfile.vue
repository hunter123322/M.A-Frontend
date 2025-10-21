    <script setup lang="ts">
    import { ref } from 'vue';
    import {
        MessageSquare, User, Heart,
        Settings, Edit, ChevronRight, Plus
    } from 'lucide-vue-next';
    import { myProfileData } from '@/stores/user';
    import ProfilePost from '@/components/profile/ProfilePost.vue';
    import PostSection from '@/components/main/PostSection.vue';

    type UserData = {
        id: number;
        email: string;
        bio: string;
        avatar: string;
        interests: string[];
        posts: number;
    };

    const mockUser = ref<UserData>(
        {
            id: Number(localStorage.getItem("user_id")),
            email: myProfileData.value?.user_nickname as string,
            bio: myProfileData.value?.user_bio as string,
            avatar: `./avatar/Avatar_${myProfileData.value?.user_avatar}.png`,
            interests: ['Vue 3', 'TypeScript', 'Express.js', 'AI Ethics', 'Sci-Fi'],
            posts: myProfileData.value?.user_follower as number,
        }
    );

    const showPost = ref(false)
    const pageLoad = ref(false)

</script>

<template id="profile-template">
    <div class="pb-20">
        <!-- Profile Header -->
        <header class="md:mt-15 p-4 pt-8 bg-gray-800/50 backdrop-blur-sm sticky top-0 z-10 border-b border-gray-700">

            <!-- Profile Info -->
            <div class="flex items-center space-x-4">
                <div class="relative">
                    <img :src="`./avatar/Avatar_${myProfileData?.user_avatar}.png`" alt="User Avatar"
                        class="w-20 h-20 rounded-full object-cover border-4 border-pink-500 shadow-xl shadow-pink-500/20" />
                    <button
                        class="absolute bottom-0 right-0 bg-gray-900 border border-gray-700 p-1 rounded-full text-pink-400 hover:text-white hover:bg-pink-600 transition-all">
                        <Plus class="w-4 h-4" />
                    </button>
                </div>

                <div class="space-y-1">
                    <p class="text-xl font-extrabold text-white">{{ myProfileData?.user_nickname }}</p>
                    <p class="text-xs text-gray-400">Followers: 1.2K | Posts: {{ myProfileData?.user_follower }}</p>
                    <button
                        class="flex items-center text-xs font-medium text-purple-300 bg-purple-900/50 border border-purple-600/50 px-3 py-1 rounded-full hover:bg-purple-800 transition-colors">
                        Edit Profile
                        <Edit class="w-3 h-3 ml-1" />
                    </button>
                </div>
            </div>

            <!-- Bio -->
            <p class="text-xs text-gray-300 mt-4 italic leading-relaxed">{{ myProfileData?.user_bio }}</p>

            <!-- Interests -->
            <div class="mt-4 flex flex-wrap gap-2">
                <span v-for="interest in mockUser.interests" :key="interest"
                    class="text-xs font-mono text-pink-300 bg-pink-900/50 px-3 py-1 rounded-full border border-pink-600/50">
                    #{{ interest }}
                </span>
            </div>
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
        <!-- Profile Posts Section -->
        <section class="p-4 space-y-6">
            <ProfilePost />
        </section>


    </div>
</template>