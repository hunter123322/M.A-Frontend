import { ref } from 'vue';
import type { CommentType } from '@/types/homepage.type';


export const commentsReply = ref<CommentType[]>([])

export const comments = ref<CommentType[]>([])