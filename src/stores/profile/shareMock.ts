import { ref } from 'vue';
import type { Post } from '@/types/homepage.type';

const sharingPost = ref<Post | null>(null)
export const sharedPost = ref<Post[]>([]);