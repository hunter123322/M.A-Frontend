import axios from "axios";
import { ref } from "vue";
import type { JWTPayload } from "@/types/homepage.type";
import { jwtDecode } from "jwt-decode";
import type { Post } from "@/types/homepage.type";


export class PostHandler {
    static async handleLike(post: Post | null) {

        const JWT = localStorage.getItem("jwt_token");
        if (!JWT || !post) return;

        const decodedJWT: JWTPayload = jwtDecode(JWT);

        console.log("handleLike called");

        // toggle UI immediately (optimistic update)
        post.isLiked = !post.isLiked;
        post.likes += post.isLiked ? 1 : -1;

        try {
            const url = post.isLiked
                ? "http://localhost:3000/post/like"
                : "http://localhost:3000/post/unlike";

            await axios.post(url, { user: decodedJWT.author, postID: post._id }, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${JWT}`,
                },
            });
        } catch (err) {
            console.error(err);
            post.likes += post.isLiked ? -1 : 1;
            post.isLiked = !post.isLiked;
        }
    }
}