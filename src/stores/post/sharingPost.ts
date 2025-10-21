import { ref } from 'vue';
import type { Post } from '@/types/homepage.type';

export const isSharing = ref(false)
export const sharingPost = ref<Post | null>(null)