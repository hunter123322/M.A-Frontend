<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import {
    Search,
    User as UserIcon, // Renamed to avoid clash with the custom 'User' type
    MessageSquare,
    Heart,
    FileText,
    X,
    Image as ImageIcon, // Lucide Image icon
    Video, // Lucide Video icon
    Link as LinkIcon
} from 'lucide-vue-next';
import { personResults } from '@/stores/search/personResult';
import { search } from '@/script/search/main';

// --- TYPES (Based on your request) ---
type User = {
    id: number;
    username: string;
    avatarUrl: number; // Assuming this is an index or ID for an image asset
};

type PostData = {
    _id?: string;
    author: User;
    imageUrl?: string;
    caption: string;
    type: "text" | "image" | "video" | "link";
    likes: number;
    shared?: {
        isSharedPost: boolean;
        post: string;
    };
    tags?: string[];
    commentCount?: number;
    sharesCount?: number;
    visibility?: "public" | "friends" | "private";
    isEdited: boolean;
    createdAt?: string;
    updatedAt?: string;
};

// --- MOCK DATA (Using the new types) ---
const mockPostResults: PostData[] = [
    {
        author: { id: 9, username: 'HunterDev', avatarUrl: 5 },
        caption: 'Optimised Express.js routing using middleware chaining. The benefits are brilliant! #ExpressJS #SoftwareEng',
        type: 'text',
        likes: 450,
        commentCount: 22,
        isEdited: false,
        createdAt: '2023-10-24T10:00:00Z'
    },
    {
        author: { id: 2, username: 'CodeEnthusiast', avatarUrl: 8 },
        caption: 'Check out this new component I built for handling form state in Vue 3. Clean and reactive.',
        type: 'text',
        likes: 1200,
        commentCount: 98,
        isEdited: true,
        createdAt: '2023-10-23T15:30:00Z'
    }
];



// Reactive state for the search feature
const searchTerm = ref('');
// State to track the active filter: 'post', 'person', or 'comment'
const searchFilter = ref<'post' | 'person'>('person');

// --- SCROLL TO BOTTOM LOGIC ---

const checkScrollToBottom = () => {
    const scrollPosition = window.scrollY || document.documentElement.scrollTop;
    const documentHeight = document.documentElement.offsetHeight;
    const viewportHeight = window.innerHeight;

    if (scrollPosition + viewportHeight >= documentHeight - 5) {
        console.log("Youre in the buttom - Search Page");
    }
};

onMounted(() => {
    window.addEventListener('scroll', checkScrollToBottom);
});

onUnmounted(() => {
    window.removeEventListener('scroll', checkScrollToBottom);
});

// --- END SCROLL LOGIC ---

// Utility function to get the correct icon for post type
const getPostIcon = (type: PostData['type']) => {
    switch (type) {
        case 'image': return ImageIcon;
        case 'video': return Video;
        case 'link': return LinkIcon;
        case 'text':
        default: return FileText;
    }
}

</script>

<template>
    <div class="min-h-screen bg-gray-900 text-white p-4 pb-20 font-sans">

        <!-- Header -->
        <header class="md:hidden sticky top-0 z-10 py-4 bg-gray-900/90 backdrop-blur-md border-b border-gray-800">
            <h1 class="text-3xl font-extrabold text-pink-500">
                Global Search
            </h1>
        </header>

        <!-- Search Input Section -->
        <div class="mt-8 mb-6 md:mt-0">
            <div class="relative">
                <!-- Search Input Field -->
                <input v-model="searchTerm" type="search" placeholder="Search posts, people, or comments..."
                    class="w-full pl-12 pr-10 py-3 text-lg bg-gray-800/70 border border-gray-700 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all outline-none text-white placeholder-gray-500 shadow-xl shadow-gray-900/50"
                    @keyup.enter="search(searchTerm)" />
                <!-- Search Icon -->
                <Search
                    class="w-6 h-6 text-pink-500 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none" />
                <!-- Clear Button -->
                <button v-if="searchTerm" @click="searchTerm = ''"
                    class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-pink-500 transition-colors">
                    <X class="w-5 h-5" />
                </button>
            </div>
        </div>

        <!-- Filter Selection -->
        <div class="flex space-x-2 border-b border-gray-700 pb-2 mb-8">
            <button @click="searchFilter = 'person'" :class="[
                'px-4 py-2 text-sm font-medium rounded-full transition-all',
                searchFilter === 'person'
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/20'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700/50 hover:text-white',
            ]">
                <UserIcon class="w-4 h-4 inline mr-1 -mt-0.5" /> People
            </button>

            <button @click="searchFilter = 'post'" :class="[
                'px-4 py-2 text-sm font-medium rounded-full transition-all',
                searchFilter === 'post'
                    ? 'bg-pink-600 text-white shadow-lg shadow-pink-500/20'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700/50 hover:text-white',
            ]">
                <FileText class="w-4 h-4 inline mr-1 -mt-0.5" /> Posts
            </button>
        </div>

        <!-- Search Results -->
        <section class="mt-10">
            <h2 class="text-xl font-bold border-b border-gray-700 pb-2 mb-6">
                Showing Results for: <span class="text-pink-400 capitalize">{{ searchTerm }}</span>
            </h2>

            <!-- Placeholder if search term is too short -->
            <div v-if="searchTerm.length < 4" class="text-center py-16 text-gray-500">
                <Search class="w-12 h-12 mx-auto mb-4 text-gray-700" />
                <p>Start typing to find content.</p>
                <p class="text-sm mt-1">Refine your search using the filters above.</p>
            </div>


            <!-- Dynamic Post Results -->
            <div v-if="searchTerm.length >= 2 && searchFilter === 'post'" class="space-y-4">
                <div v-for="post in mockPostResults" :key="post._id || post.author.id + post.caption.substring(0, 10)"
                    class="bg-gray-800 p-4 rounded-xl border border-pink-700/30 hover:border-pink-500 transition-colors cursor-pointer">

                    <div class="flex items-start space-x-3 mb-2">
                        <!-- Post Author/Avatar -->
                        <img :src="`./avatar/Avatar_1.png`" alt="Author Avatar"
                            class="w-8 h-8 rounded-full object-cover border-2 border-gray-700" />

                        <div class="flex-1">
                            <p class="font-semibold text-pink-400">{{ post.author.username }}</p>
                            <p class="text-xs text-gray-500 flex items-center space-x-1">
                                <span>{{ post.createdAt ? new Date(post.createdAt).toLocaleDateString() : 'Today'
                                    }}</span>
                                <component :is="getPostIcon(post.type)" class="w-3 h-3 text-gray-500 ml-1" />
                            </p>
                        </div>
                    </div>

                    <!-- Caption/Content Snippet -->
                    <p class="text-sm text-gray-300 leading-relaxed line-clamp-2">
                        {{ post.caption }}
                    </p>

                    <!-- Metrics -->
                    <div class="flex justify-end space-x-4 text-xs mt-3 text-gray-500">
                        <span class="flex items-center">
                            <Heart class="w-3 h-3 inline mr-1 text-red-500" /> {{ post.likes.toLocaleString() }}
                        </span>
                        <span class="flex items-center">
                            <MessageSquare class="w-3 h-3 inline mr-1 text-blue-500" /> {{ post.commentCount || 0 }}
                        </span>
                    </div>
                </div>
            </div>

            <!-- Dynamic Person Results -->
            <div v-if="searchFilter === 'person' && searchTerm.length > 4" class="space-y-4">
                <div v-for="person in personResults" :key="person.user_id"
                    class="bg-gray-800 p-4 rounded-xl border border-purple-700/30 flex items-center justify-between hover:border-purple-500 transition-colors cursor-pointer">
                    <div class="flex items-center space-x-3">
                        <!-- Person Avatar -->
                        <img :src="`./avatar/Avatar_${person.user_avatar}.png`" alt="Person Avatar"
                            class="w-10 h-10 rounded-full object-cover border-2 border-purple-500/50" />

                        <div>
                            <p class="font-semibold text-lg text-purple-300">{{ person.user_nickname }}</p>
                            <p class="text-xs text-gray-400 line-clamp-1">Bio: {{ person.user_bio }}</p>
                            <p class="text-xs text-gray-500 line-clamp-1">Followers: {{ person.user_follower }} |
                                Following:
                                {{ person.user_following }}</p>

                        </div>
                    </div>
                    <!-- Follow Button -->
                    <button :class="[
                        'text-xs px-3 py-1 rounded-full transition-colors font-medium',
                        person.followed
                            ? 'bg-gray-700 text-white border border-gray-600 hover:bg-gray-600'
                            : 'text-white bg-purple-700 hover:bg-purple-600'
                    ]" @click="console.log(person.followed ? 'Unfollowing' : 'Following', person.user_nickname)">
                        {{ person.followed ? 'Following' : 'Follow' }}
                    </button>
                </div>
            </div>
        </section>
    </div>
</template>
