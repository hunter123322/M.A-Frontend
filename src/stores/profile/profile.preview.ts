import { ref } from "vue";
import type { MyProfileData } from "@/types/homepage.type";

export const profilePreview = ref<MyProfileData | null>(null)