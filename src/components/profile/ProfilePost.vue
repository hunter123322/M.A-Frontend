<script setup lang="ts">
import { ref } from 'vue';
import {
    MessageSquare, User, Heart,
    Settings, Edit, ChevronRight, Plus,
    Share2,
    PlusCircle,
    CheckCircle
} from 'lucide-vue-next';
import { posts } from '@/stores/profile/postMock';
import type { Post, CommentType } from '@/types/homepage.type';
import { comments, commentsReply } from '@/stores/profile/commentMock';
import { formatTimeAgo, getComment, handleComment, myNewComment, commentQueryData, openCommentID, sortedComment } from '@/script/profile/view.profile';
import SharingPost from './SharingPost.vue';
import { handleSahre } from '@/script/post/postSharing';
import { isSharing } from '@/stores/post/sharingPost';
import { PostHandler } from '@/script/post/post';
import { profilePreview } from '@/stores/profile/profile.preview';

const openCommentIDReply = ref("");
let activeComment: string | null = null;
let activeCommentReply: string | null = null;

const commentCountRender = ref(0)
const sortedCommentReply = ref<CommentType[]>([]);
const commentReplyCount = ref(0)

async function commentHandler(ID: string, isCommentReply = false, post?: Post) {
    console.log(ID, isCommentReply, post);

    if (isCommentReply) {
        handleCommentReply(ID);
    } else {
        await handleMainComment(ID);
    }

}

/** Handles comment replies logic */
function handleCommentReply(ID: string) {
    if (activeCommentReply === ID) {
        commentReplyCount.value++;
        return;
    }

    activeCommentReply = ID;
    openCommentIDReply.value = ID;
    filterCommentReply(ID);
    console.log(sortedCommentReply.value);
}

/** Handles main comment logic */
async function handleMainComment(ID: string) {
    const isSameComment = activeComment === ID;

    if (isSameComment) {
        activeComment = null;
        openCommentID.value = "";
        return;
    }

    myNewComment.value = "";

    try {
        await getComment(ID);
    } catch {
        // ignore errors
    } finally {
        filterComment(ID);

    }
    sortedComment.value.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    activeComment = ID;
    openCommentID.value = ID;
}


function filterComment(ID: string) {
    sortedCommentReply.value = [];
    sortedComment.value = comments.value.filter(e => {
        return e.postID === ID;
    });
}

function filterCommentReply(ID: string) {
    sortedCommentReply.value = commentsReply.value.filter(e => {
        return e.commentID === ID
    })
}

function formatCaption(caption: string) {
    if (!caption) return '';

    let formatted = caption.replace(/\n/g, '<br>');

    formatted = formatted.replace(
        /#(\w+)/g,
        '<span class="text-blue-400 font-bold cursor-pointer">#$1</span>'
    );

    return formatted;
}

function formatComment(caption: string) {
    let formatted = caption.replace(/\n/g, '<br>');

    formatted = formatted.replace(
        /@([A-Za-z0-9._]+)/g,
        '<span class="text-sky-400 font-semibold cursor-pointer">@$1</span>'
    );

    return formatted;
}


function replyToComment(comment: CommentType) {
    myNewComment.value = `@${comment.author.username} `
    commentQueryData.value = comment
}
</script>


<template>
    <!-- Share Section -->
    <SharingPost :class="isSharing ? '' : 'hidden'" />

    <!-- Posts Feed -->
    <div v-for="post in [...posts].filter(e => {
        return e.author.id === profilePreview?.user_id
    }).sort((a, b) => new Date(b.createdAt || 0)
        .getTime() - new Date(a.createdAt || 0)
            .getTime())" :key="post._id" :id="post._id"
        class="bg-sky-950 rounded-lg overflow-hidden border border-gray-800">
        <div class="px-4 pt-4 flex items-center gap-3">
            <img :src="`./avatar/Avatar_${post.author.avatarUrl}.png`" alt="avatar"
                class="w-10 h-10 rounded-full border-2 border-purple-800" />
            <div class="mr-4">
                <span class="font-semibold text-xs">{{
                    post.author.username
                }}</span>
                <p class="text-xs text-brand-subtle">{{ formatTimeAgo(post.createdAt || new Date) }}</p>
            </div>
            <!-- <PlusCircle :size="20" class="hover:text-blue-600" /> -->
            <CheckCircle :size="20" class="hover:text-red-600" />
        </div>
        <p :class="[
            post.caption.length > 200 || post.imageUrl || post.shared?.isSharedPost
                ? 'text-xs'
                : 'text-xl font-semibold',
            'ml-3',
            'mt-4',
            'whitespace-pre-line'
        ]" v-html="formatCaption(post.caption)">
        </p>

        <img :class="post.imageUrl === '' || !post.imageUrl ? 'hidden' : ''" :src="post.imageUrl" alt="post image"
            class="w-full h-auto max-h-[70vh] object-cover mt-4" />

        <!-- Shared post  -->
        <div v-if="post.shared?.isSharedPost" :id="post.shared?.post._id"
            class="mt-3 mx-2 border border-gray-700/80 bg-gray-800/50 backdrop-blur-sm rounded-xl overflow-hidden hover:border-purple-700/60 transition-all duration-300">
            <!-- Header -->
            <div class="flex items-center gap-3 px-4 py-3 border-b border-gray-700/60">
                <img :src="`./avatar/Avatar_${post.shared?.post.author.avatarUrl}.png`" alt="avatar"
                    class="w-9 h-9 rounded-full ring-2 ring-purple-700/40" />
                <div>
                    <span class="font-semibold text-sm text-gray-100">
                        {{ post.shared?.post.author.username }}
                    </span>
                    <p class="text-[11px] text-gray-400 mt-[2px]">
                        {{ formatTimeAgo(post.shared.post.createdAt || new Date) }}
                    </p>
                </div>
            </div>

            <!-- Image -->
            <div v-if="post.shared?.post.imageUrl" class="w-full">
                <img :src="post.shared?.post.imageUrl" alt="shared post image"
                    class="w-full h-auto max-h-[65vh] object-cover" />
            </div>

            <!-- Caption -->
            <div class="px-4 py-3">
                <p :class="[
                    post.shared.post.caption.length > 200 || post.shared.post.imageUrl
                        ? 'text-xs'
                        : 'text-xl font-semibold',
                    'whitespace-pre-line'
                ]" v-html="formatCaption(post.shared.post.caption)">
                </p>
            </div>
        </div>


        <div class="p-4">
            <div class="flex items-center text-brand-subtle space-x-6">
                <button @click="PostHandler.handleLike(post)" class="flex items-center gap-2 transition-colors"
                    :class="post.isLiked ? 'text-pink-500' : 'hover:text-pink-500'">
                    <Heart class="w-5 h-5 transition-transform cursor-pointer"
                        :class="post.isLiked ? 'fill-pink-500 scale-110' : ''" />
                    <span class="text-xs font-medium">{{ post.likes }}</span>
                </button>
                <button class="flex items-center gap-2 hover:text-blue-400 transition-colors">
                    <MessageSquare class="w-5 h-5 cursor-pointer"
                        @click="[commentHandler(post._id, false, post), commentCountRender = 5]" />
                    <span class="text-xs font-medium">
                        {{ post.commentCount }}
                    </span>
                </button>
                <button class="flex items-center gap-2 hover:text-green-400 transition-colors ml-auto cursor-pointer"
                    @click="handleSahre(post._id)">
                    <Share2 class="w-5 h-5" />
                    <span class="text-xs">Share</span>
                </button>
            </div>
        </div>

        <!-- Comment Section -->
        <div :class="openCommentID === post._id ? '' : 'hidden'" class="p-1 border-t border-gray-700 space-y-4">
            <div v-for="comment in sortedComment" :key="comment._id" :id="comment._id">
                <div v-if="comment.postID === post._id" class="flex items-start gap-3">
                    <img :src="`./avatar/Avatar_${comment.author.avatarUrl}.png`"
                        class="w-8 h-8 rounded-full border border-purple-700" />
                    <div class="flex-1">
                        <div class="bg-gray-800/50 rounded-xl p-3">
                            <span class="font-semibold text-xs">{{
                                comment.author.username
                                }}</span>
                            <p class="text-xs text-gray-200" v-html="formatComment(comment.text)"></p>
                        </div>
                        <div class="flex items-center gap-4 text-xs text-gray-400 mt-1">
                            {{ formatTimeAgo(comment.createdAt, true) }}
                            <button class="hover:text-pink-500 flex items-center gap-1" @click="comment.likes++">
                                <Heart class="w-3 h-3" />
                                {{ comment.likes }}
                            </button>
                            <button class="hover:text-blue-400" @click="replyToComment(comment)">
                                Reply
                            </button>
                        </div>

                        <!-- Replies -->
                        <div class="flex flex-col-reverse">
                            <div v-for="commentReply in sortedCommentReply
                                .sort((a, b) => new Date(a.createdAt ?? 0)
                                    .getTime() - new Date(b.createdAt ?? 0)
                                        .getTime())
                                .slice(0, commentReplyCount)" :key="commentReply._id" :id="commentReply._id"
                                v-show="openCommentIDReply === comment._id" class=" mt-3 space-y-2">

                                <div v-if="commentReply.commentID === comment._id" class="flex items-start gap-2">
                                    <img :src="`./avatar/Avatar_${commentReply.author.avatarUrl}.png`""
                                        class=" w-6 h-6 rounded-full border border-purple-600" />
                                    <div class="bg-gray-800/40 rounded-xl p-2 flex-1">
                                        <span class="font-semibold text-xs">{{
                                            commentReply.author.username
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
                    </div>
                </div>
            </div>

            <!-- Show more -->
            <div v-show="post.commentCount !== 0">
                <button class="hover:text-blue-400">
                    <span v-if="post.commentCount > commentCountRender && sortedComment.length < post.commentCount"
                        @click="[commentCountRender += 5, getComment(post._id, true)]">
                        Show more...
                    </span>
                    <span v-else @click="[commentCountRender = 0, , sortedComment = [], openCommentID = '']">
                        Close Comment...
                    </span>
                </button>
            </div>

            <!-- Reply Input -->
            <div class="mx-4 mt-2 flex gap-2">
                <input v-model="myNewComment" @keyup.enter="handleComment" placeholder="Write a comment..."
                    class="flex w-full px-3 py-1 text-xs rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:border-purple-500" />
                <button class="text-xs bg-purple-700 px-3 rounded-lg" @click="handleComment">
                    Send
                </button>
            </div>

        </div>
    </div>
</template>