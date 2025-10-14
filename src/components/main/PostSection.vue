<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import { Image, Heart, MessageSquare, Share2 } from "lucide-vue-next";
import { posts, type Post, type User } from "@/stores/profile/postMock";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

const currentUser: User = {
    id: "u1",
    email: "Hunter",
    avatarUrl: "./avatar/Avatar_1.png",
};

const newPost = ref<Partial<Post>>({
    caption: "",
    imageUrl: "",
    type: "text",
});

const imagePreview = ref<string | null>(null);

function handleImageUpload(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files[0]) {
        const file = target.files[0];
        newPost.value.imageUrl = URL.createObjectURL(file);
        newPost.value.type = "image";
        imagePreview.value = newPost.value.imageUrl;
    }
}

function removeImage() {
    newPost.value.imageUrl = "";
    newPost.value.type = "text";
    imagePreview.value = null;
}


export type PostData = {
    _id?: string;
    author: User;
    imageUrl?: string;
    caption: string;
    type: "text" | "image" | "video" | "link";
    likes: number;
    shared?: {
        isSharedPost: boolean;
        id: string;
        author: User;
        sharedAt?: string;
        shareCount?: number;
    };
    tags?: string[];
    aiScore?: Record<string, number>;
    mentions?: User[];
    commentCount?: number;
    visibility?: "public" | "friends" | "private"; // control who can see post
    isEdited: boolean;
    createdAt?: string;
    updatedAt?: string;
};

type JWTPayload = {
    user_id: number;
    email?: string;
    username: string;
    author?: User
}

async function submitPost() {
    if (!newPost.value.caption && !newPost.value.imageUrl) return;

    const JWT = localStorage.getItem("jwt_token");
    if (!JWT) return;

    const decodedJWT: JWTPayload = jwtDecode(JWT);

    const post = {
        author: decodedJWT.author, // or decodedJWT.author depending on your payload
        caption: newPost.value.caption ?? "",
        imageUrl: newPost.value.imageUrl ?? "",
    };

    try {
        await axios.post("http://localhost:3000/post/create", [post], {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${JWT}`,
            },
        });

        // Reset post form
        newPost.value = { caption: "", imageUrl: "", type: "text" };
        imagePreview.value = null;

        console.log("✅ Post successfully created!");
    } catch (error) {
        console.error("❌ Failed to create post:", error);
    }
}

function showComment(postId: string) {
    console.log("Open comments for post:", postId);
}

const autoResizeTextarea = ref<HTMLTextAreaElement | null>(null)

const autoResize = () => {
    const el = autoResizeTextarea.value
    if (el) {
        el.style.height = 'auto' // Reset height
        el.style.height = `${el.scrollHeight}px` // Set to scrollHeight
    }
}

// Optional: resize when caption is changed programmatically
watch(() => newPost.value.caption, autoResize)

onMounted(() => {
    autoResize()
})
</script>


<template>
    <!-- Create Post Section -->
    <section class="mb-8 border border-gray-800 rounded-2xl p-4">
        <div class="flex items-start gap-3">
            <img :src="currentUser.avatarUrl" alt="avatar" class="w-10 h-10 rounded-full border-2 border-purple-800" />

            <div class="flex-1 ">
                <textarea v-model="newPost.caption" placeholder="What's on your mind?"
                    class="w-full bg-transparent text-sm text-gray-100 border border-gray-700 rounded-lg p-3 focus:outline-none focus:border-purple-600 resize-none overflow-hidden"
                    rows="1"></textarea>

                <div class="flex items-center justify-between mt-3">
                    <div class="flex items-center gap-3">
                        <label class="cursor-pointer flex items-center gap-1 text-gray-400 hover:text-blue-400 text-sm">
                            <input type="file" accept="image/*" @change="handleImageUpload" class="hidden" />
                            <Image class="w-4 h-4" />
                            Photo
                        </label>
                    </div>

                    <button @click="submitPost"
                        class="px-4 py-1.5 bg-purple-700 text-white text-xs font-semibold rounded-lg hover:bg-purple-800 transition">
                        Post
                    </button>
                </div>

                <!-- Preview -->
                <div v-if="imagePreview" class="mt-3 relative">
                    <img :src="imagePreview" alt="preview"
                        class="rounded-lg max-h-56 object-cover border border-gray-700" />
                    <button @click="removeImage"
                        class="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1 hover:bg-black/80">
                        ✕
                    </button>
                </div>
            </div>
        </div>
    </section>
</template>