import axios from "axios";
import { ref } from "vue";
import type { JWTPayload } from "@/types/homepage.type";
import { jwtDecode } from "jwt-decode";
import type { Post } from "@/types/homepage.type";

let likeTimeout: NodeJS.Timeout | null = null;
let requestInProgress = false;

export class PostHandler {
    static async handleLike(post: Post) {
        const JWT = localStorage.getItem("jwt_token");
        if (!JWT) return;

        const decodedJWT: JWTPayload = jwtDecode(JWT);

        if (requestInProgress) return; // prevent spamming

        // toggle UI immediately (optimistic update)
        post.isLiked = !post.isLiked;
        post.likes += post.isLiked ? 1 : -1;

        // clear existing timer if any
        if (likeTimeout) clearTimeout(likeTimeout);

        // wait 2 seconds before sending
        likeTimeout = setTimeout(async () => {
            try {
                requestInProgress = true;
                const url = post.isLiked
                    ? "http://localhost:3000/post/like"
                    : "http://localhost:3000/post/unlike";

                await axios.post(url, { user: decodedJWT.author, postID: post._id }, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${JWT}`,
                    },
                });
                requestInProgress = false;
                likeTimeout = null;
            } catch (err) {
                console.error(err);
                // rollback if request fails
                post.likes += post.isLiked ? -1 : 1;
                post.isLiked = !post.isLiked;
            }
        }, 1000);
    }
}