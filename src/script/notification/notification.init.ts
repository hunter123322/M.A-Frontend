import { notificationCount, notifications, rawNotifications } from "@/stores/notification/notification.store";
import type { NotificationType } from "@/types/homepage.type";
import axios from "axios";

export async function notificationHandler(): Promise<void> {
    try {
        const token = localStorage.getItem("jwt_token");
        const headers: Record<string, string> = {
            "Content-Type": "application/json",
        };

        if (token) headers["Authorization"] = `Bearer ${token}`;

        const response = await axios.get<NotificationType[]>(
            "http://localhost:3000/notification/init",
            {
                headers,
                withCredentials: true,
                validateStatus: () => true, // prevent axios from throwing on non-200
            }
        );

        if (response.status !== 200 || !response.data) {
            console.warn("Failed to fetch notifications:", response.status);
            return;
        }

        // ✅ safely update your reactive data store
        rawNotifications.value = response.data;

        // ✅ apply any local logic (e.g., filtering, sorting, display)
        notificationHelper();

    } catch (error: any) {
        console.error("Error in notificationHandler:", error?.message || error);
    }
}

function notificationHelper() {
    const groupedMap = new Map<string, NotificationType[]>();
    const result: NotificationType[] = [];

    for (const notif of rawNotifications.value) {
        const key = `${notif.categories}-${notif.engagementID}`;

        if (notif.categories === 'like') {
            if (!groupedMap.has(key)) {
                groupedMap.set(key, []);
            }
            groupedMap.get(key)?.push(notif);
        } else {
            result.push(notif);
        }
    }

    // Process grouped "like" notifications _id
    for (const [_, group] of groupedMap.entries()) {
        if (group.length === 1) {
            result.push(group[0]); // No need to group single items
        } else {
            const actors = group.map(g => g.actor.username);
            const sortedGroup = group.sort((a, b) => {
                const ta = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                const tb = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                return tb - ta;
            });
            const latest = sortedGroup[0];

            const [first, ...others] = actors;
            let content = '';
            if (others.length === 0) {
                content = `${first} liked your post.`;
            } else {
                content = `${first} and ${others.length} other${others.length > 1 ? 's' : ''} liked your post.`;
            }

            result.push({
                ...latest,
                content,
            });
        }
    }
    console.log(result);

    notifications.value = result

    // ! Sort final result by createdAt descending
    // notifications.value = result.sort((a, b) => {
    //     const ta = a.createdAt ? new Date(a.createdAt).getTime() : 0;
    //     const tb = b.createdAt ? new Date(b.createdAt).getTime() : 0;
    //     return tb - ta;
    // });
}