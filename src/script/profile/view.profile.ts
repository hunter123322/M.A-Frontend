import { posts } from "@/stores/profile/postMock";
import { myProfileData } from "@/stores/user";
import type { Post, JWTPayload, CommentType, MyProfileData } from "@/types/homepage.type";
import axios from "axios";
import { ref } from "vue";
import { jwtDecode } from "jwt-decode";
import { comments } from "@/stores/profile/commentMock";
import { profilePreview } from "@/stores/profile/profile.preview";

let hasBeenCalled = false

export async function initProfile(ID?: number) {
    try {
        if (hasBeenCalled) return;

        const token = localStorage.getItem('jwt_token')
        const headers: Record<string, string> = {
            'Content-Type': 'application/json'
        }

        if (token) {
            headers['Authorization'] = `Bearer ${token}`
        }
        const userProfile = await axios.get<{ userProfile: MyProfileData, myPosts: Post[] }>("http://localhost:3000/user/profile/init", {
            headers,
            withCredentials: true
        });

        if (!userProfile || userProfile.status !== 200) return

        myProfileData.value = userProfile.data.userProfile
        profilePreview.value = userProfile.data.userProfile
        posts.value.unshift(...userProfile.data.myPosts)
        hasBeenCalled = true
    } catch (error) {

    }
}

export const formatTimeAgo = (dateStr: Date, isComment: boolean = false) => {
    const diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
    if (diff < 60) return `${Math.floor(diff)}s ${isComment ? '' : 'ago'}`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ${isComment ? '' : 'ago'}`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ${isComment ? '' : 'ago'}`;
    return `${Math.floor(diff / 86400)}d ${isComment ? '' : 'ago'}`
};

export const myNewComment = ref("")
export const commentQueryData = ref<CommentType | null>(null)
export const openCommentID = ref<string>("");
export const sortedComment = ref<CommentType[]>([]);

function updateCommentCount(postID: string, increment = 1) {
    const index = posts.value.findIndex(p => p._id === postID);
    if (index === -1) return; // Post not found

    // Update reactively — this triggers Vue reactivity
    posts.value[index].commentCount += increment;
}

export async function handleComment() {
    const JWT = localStorage.getItem("jwt_token");
    if (!JWT) return;

    const decodedJWT: JWTPayload = jwtDecode(JWT);

    const trimmed = myNewComment.value.trim();
    if (!trimmed) return; // prevent empty comments

    try {
        const { status, data } = await axios.post("http://localhost:3000/post/comment/create", {
            postID: openCommentID.value,
            text: myNewComment.value,
            author: decodedJWT.author,
            commentID: commentQueryData.value?._id ?? null
        }, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${JWT}`,
            },
        });
        myNewComment.value = ""; // clear input
        if (!data) throw new Error(data.message);
        console.log(data);

        comments.value.push(data.comment);
        sortedComment.value.push(data.comment)

        updateCommentCount(openCommentID.value)

    } catch (error) {
        console.error("Failed to send comment:", error);
    }

    commentQueryData.value = null;
};

let lastID: string = "";
export async function getComment(postID: string, toShowMore: boolean = false) {
    if (lastID === postID && !toShowMore) return;

    lastID = postID;

    const JWT = localStorage.getItem("jwt_token");
    if (!JWT) return;

    try {
        if (toShowMore) {
            const { status, data } = await axios.get("http://localhost:3000/post/comment/getMore", {
                params: {
                    postID: postID,
                    // Reverse the comment
                    lastCommentTimestamp: sortedComment.value[0].createdAt
                },
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${JWT}`,
                },
            });

            if (status !== 200) {
                throw new Error(data.message);
            }

            console.log(data);
            comments.value.push(...data);
            sortedComment.value.push(...data);
            sortedComment.value.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
            return;
        }
        const { status, data } = await axios.get("http://localhost:3000/post/comment/get", {
            params: {
                postID: postID
            },
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${JWT}`,
            },
        });

        if (status !== 200) {
            throw new Error(data.message);
        }
        console.log(data);
        comments.value = [...data];

    } catch (error) {
        console.log(error);
    }
}