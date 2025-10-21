import type { NotificationType } from "@/types/homepage.type";
import { ref } from "vue";

type CompressNotifType = NotificationType & {
    actorsIDs?: string[];
}

export const notificationCount = ref<number | null>(null)
export const rawNotifications = ref<NotificationType[]>([])
export const notifications = ref<CompressNotifType[]>([])

