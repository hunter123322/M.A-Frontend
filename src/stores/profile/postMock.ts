import { ref } from 'vue';
import type { Post } from '@/types/homepage.type';

export const posts = ref<Post[]>([])
export const profilePosts = ref<Post[]>([])