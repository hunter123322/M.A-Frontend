import type { Socket } from "socket.io-client";

export class Notification {
    static async listener(socket: Socket) {
        socket.on("Notification", (data) => {
            Notification.iuHandler(data);
        });
    }

    private static iuHandler(data: any) {
        console.log("📩 New Notification:", data);

    }
}
