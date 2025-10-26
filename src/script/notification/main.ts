import axios from "axios";
import type { JWTPayload, NotificationType, Post } from "@/types/homepage.type";
import { isPostPreview } from "@/stores/profile/post.preview";

export async function getNotificationLink(notification: NotificationType) {
    try {
        const JWT = localStorage.getItem("jwt_token");
        if (!JWT) return;

        const { status, data } = await axios.post<Post>("http://localhost:3000/notification/read/one", notification, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${JWT}`,
            },
        });

        if (status !== 200 || !data) throw new Error("Failed to get the comment")

        console.log(data);

        isPostPreview.value = data
    } catch (error) {
        console.log(error)
    }
}