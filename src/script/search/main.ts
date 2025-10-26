import { useRouter } from "vue-router";
import axios from "axios";
import type { Post, MyProfileData } from "@/types/homepage.type";
import { myProfileData } from "@/stores/user";
import { posts } from "@/stores/profile/postMock";
import { profilePreview } from "@/stores/profile/profile.preview";
import { currentPage } from "@/stores/nav/main";
import { personResults } from "@/stores/search/personResult";


type ProfileData = MyProfileData & {
    followed: boolean
}

const router = useRouter();

function goToProfile(text: string) {
    router.push({
        path: '/profile',
        query: { user: `${text}` }
    });
}

export async function search(searchContent: string) {
    if (!searchContent) return;
    personResults.value = []

    try {

        // goToProfile(searchContent);

        const token = localStorage.getItem('jwt_token')
        const headers: Record<string, string> = {
            'Content-Type': 'application/json'
        }

        if (token) {
            headers['Authorization'] = `Bearer ${token}`
        }

        const { status, data } = await axios.get(`http://localhost:3000/search/user?user=${searchContent}`, {
            headers,
            withCredentials: true
        });

        console.table(data);

        personResults.value = data.profile as ProfileData[];

    } catch (error) {

    }
}