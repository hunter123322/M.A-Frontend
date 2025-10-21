import { posts } from "@/stores/profile/postMock";
import { sharingPost, isSharing } from "@/stores/post/sharingPost";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import type { JWTPayload, Post } from "@/types/homepage.type";

export function handleSahre(postID: string) {
    const index = posts.value.findIndex(p => p._id === postID);
    if (index === -1) return; // Post not found
    sharingPost.value = posts.value[index]
    isSharing.value = true

}

export async function submitSharedPost(caption: string) {
    if (!sharingPost.value) return

    const JWT = localStorage.getItem("jwt_token");
    if (!JWT) return;

    const decodedJWT: JWTPayload = jwtDecode(JWT);

    let post: unknown;

    if (sharingPost.value.shared?.isSharedPost) {
        post = {
            author: decodedJWT.author,
            caption: caption,
            shared: {
                isSharedPost: true,
                post: sharingPost.value?.shared.post._id
            }
        };
    } else {
        post = {
            author: decodedJWT.author,
            caption: caption,
            shared: {
                isSharedPost: true,
                post: sharingPost.value?._id
            }
        };
    }



    try {
        const { status, data } = await axios.post("http://localhost:3000/post/share", post, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${JWT}`,
            },
        });

        posts.value.push(data);
    } catch (error) {
        console.error("❌ Failed to create post:", error);
    }
}