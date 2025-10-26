import type { Post } from "@/types/homepage.type";
import { ref } from "vue";

export const isPostPreview = ref<Post | null>(null)