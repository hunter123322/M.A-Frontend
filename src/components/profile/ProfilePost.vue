    <script setup lang="ts">
    import { ref } from 'vue';
    import {
        MessageSquare, User, Heart,
        Settings, Edit, ChevronRight, Plus
    } from 'lucide-vue-next';
    import { posts, type Post } from '@/stores/profile/postMock';
    import { sharedPost } from '@/stores/profile/shareMock';
    import { comments, commentsReply, type Comment } from '@/stores/profile/commentMock';

    const openComment = ref("");
    const openCommentReply = ref("");
    let activeComment: string | null = null;
    let activeCommentReply: string | null = null;

    const sortedComment = ref<Comment[]>([]);
    const sortedCommentReply = ref<Comment[]>([]);

    const commentReplyCount = ref(0)

    function commentHandler(ID: string, isCommentReply: boolean = false, post?: Post) {
        if (isCommentReply) {
            if (activeCommentReply === ID) {
                commentReplyCount.value++

            } else {
                activeCommentReply = ID;
                openCommentReply.value = ID;
                filterCommentReply(ID);
                console.log(sortedCommentReply.value);
            }
        } else {
            if (activeComment === ID) {
                activeComment = null;
                openComment.value = "";
            } else {
                filterComment(ID)
                activeComment = ID;
                openComment.value = ID;
            }
        }
        console.log(sortedCommentReply.value);
    }

    function filterComment(ID: string) {
        sortedCommentReply.value = [];
        sortedComment.value = comments.value.filter(e => {
            return e.postID === ID;
        });
        sortedComment.value.forEach(e => {
            e._id
        })
    }

    function filterCommentReply(ID: string) {
        sortedCommentReply.value = commentsReply.value.filter(e => {
            return e.commentID === ID
        })
    }
</script>


<template>
    <h2 class="text-xl font-bold text-white flex items-center justify-between">
        <span class="border-b-2 border-pink-500 pb-1">My Posts</span>
        <ChevronRight class="w-5 h-5 text-gray-400" />
    </h2>

    <!-- Posts Feed -->
    <div v-for="post in posts" :key="post.id" :id="post.id"
        class="bg-sky-950 rounded-lg overflow-hidden border border-gray-800">
        <div class="px-4 pt-4 flex items-center gap-3">
            <img :src="post.author.avatarUrl" alt="avatar" class="w-10 h-10 rounded-full border-2 border-purple-800" />
            <div>
                <span class="font-semibold text-xs">{{
                    post.author.email
                }}</span>
                <p class="text-xs text-brand-subtle">{{ post.timestamp }}</p>
            </div>
        </div>

        <img :class="post.imageUrl === '' ? 'hidden' : ''" :src="post.imageUrl" alt="post image"
            class="w-full h-auto max-h-[70vh] object-cover" />

        <!-- Shared post  -->
        <div :class="post.shared?.isSharedPost ? 'flex flex-col ml-2' : 'hidden'" v-for="share in sharedPost"
            :key="share.id" :id="share.id"
            class="bg-blue-900 rounded-l-lg overflow-hidden border border-gray-800 w-auto">
            <div :class="post.shared?.id === share.id ? 'flex' : 'hidden'" class="p-4 items-center gap-3">
                <img :src="share.author.avatarUrl" alt="avatar"
                    class="w-10 h-10 rounded-full border-2 border-purple-800" />
                <div>
                    <span class="font-semibold text-xs">{{
                        share.author.email
                    }}</span>
                    <p class="text-xs text-brand-subtle">{{ share.timestamp }}</p>
                </div>
            </div>

            <img :class="share.imageUrl === '' ? 'hidden' : ''" :src="share.imageUrl" alt="post image"
                class="w-full h-auto max-h-[70vh] object-cover" />

            <div class="p-4">
                <p class="text-xs mb-4">{{ share.caption }}</p>
            </div>
        </div>

        <div class="p-4">
            <p class="text-xs mb-4">{{ post.caption }}</p>
            <div class="flex items-center text-brand-subtle space-x-6">
                <button class="flex items-center gap-2 hover:text-pink-500 transition-colors">
                    <Heart class="w-5 h-5" />
                    <span class="text-xs font-medium">{{ post.likes }}</span>
                </button>
                <button class="flex items-center gap-2 hover:text-blue-400 transition-colors">
                    <MessageSquare class="w-5 h-5" @click="commentHandler(post.id, false, post)" />
                    <span class="text-xs font-medium">
                        {{ post.commentCount }}
                    </span>
                </button>
                <button class="flex items-center gap-2 hover:text-green-400 transition-colors ml-auto">
                    <Share2 class="w-5 h-5" />
                    <span class="text-xs">Share</span>
                </button>
            </div>
        </div>

        <!-- Comment Section -->
        <div :class="openComment === post.id ? '' : 'hidden'" class="p-1 border-t border-gray-700 space-y-4">
            <div v-for="comment in sortedComment" :key="comment._id" :id="comment._id">
                <div v-if="comment.postID === post.id" class="flex items-start gap-3">
                    <img :src="comment.author.avatarUrl" class="w-8 h-8 rounded-full border border-purple-700" />
                    <div class="flex-1">
                        <div class="bg-gray-800/50 rounded-xl p-3">
                            <span class="font-semibold text-xs">{{
                                comment.author.email
                                }}</span>
                            <p class="text-xs text-gray-200">{{ comment.text }}</p>
                        </div>
                        <div class="flex items-center gap-4 text-xs text-gray-400 mt-1">
                            <button class="hover:text-pink-500 flex items-center gap-1" @click="comment.likes++">
                                <Heart class="w-3 h-3" />
                                {{ comment.likes }}
                            </button>
                            <button class="hover:text-blue-400" @click="comment.showReply = !comment.showReply">
                                Reply
                            </button>
                        </div>

                        <div>
                            <span v-if="sortedCommentReply.length >= commentReplyCount"
                                @click="commentHandler(comment._id, true)">Show more...</span>
                            <span v-else
                                @click="[commentReplyCount = 1, openCommentReply = '', activeComment = null]">Show
                                less...</span>
                        </div>

                        <!-- Replies -->
                        <div class="flex flex-col-reverse">
                            <div v-for="commentReply in sortedCommentReply
                                .sort((a, b) => new Date(a.createdAt ?? 0).getTime() - new Date(b.createdAt ?? 0).getTime())
                                .slice(0, commentReplyCount)" :key="commentReply._id" :id="commentReply._id"
                                v-show="openCommentReply === comment._id" class=" mt-3 space-y-2">

                                <div v-if="commentReply.commentID === comment._id" class="flex items-start gap-2">
                                    <img :src="commentReply.author.avatarUrl"
                                        class="w-6 h-6 rounded-full border border-purple-600" />
                                    <div class="bg-gray-800/40 rounded-xl p-2 flex-1">
                                        <span class="font-semibold text-xs">{{
                                            commentReply.author.email
                                        }}</span>
                                        <p class="text-xs text-gray-300">{{ commentReply.text }}</p>
                                        <div class="flex items-center gap-4 text-xs text-gray-400 mt-1">
                                            <button class="mt-1 text-[10px] hover:text-pink-400 flex items-center gap-1"
                                                @click="commentReply.likes++">
                                                <Heart class="w-3 h-3" />
                                                {{ commentReply.likes }}
                                            </button>
                                            <button class="hover:text-blue-400"
                                                @click="comment.showReply = !comment.showReply">
                                                Reply
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Reply Input -->
                        <div v-if="comment.showReply" class="ml-8 mt-2 flex gap-2">
                            <input v-model="comment.replyText" placeholder="Write a reply..."
                                class="flex-1 px-3 py-1 text-xs rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:border-purple-500" />
                            <button class="text-xs bg-purple-700 px-3 rounded-lg" @click="">
                                Send
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>