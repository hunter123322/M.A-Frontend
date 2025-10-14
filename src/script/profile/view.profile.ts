import { myProfileData, type MyProfileData } from "@/stores/user";
import axios from "axios";


export async function initProfile() {
    try {
        const token = localStorage.getItem('jwt_token')
        const headers: Record<string, string> = {
            'Content-Type': 'application/json'
        }

        if (token) {
            headers['Authorization'] = `Bearer ${token}`
        }
        const userProfile = await axios.get<{ userProfile: MyProfileData }>('http://localhost:3000/user/profile/init', {
            headers,
            withCredentials: true
        });

        if (!userProfile || userProfile.status !== 200) return
        myProfileData.value = userProfile.data.userProfile
    } catch (error) {

    }
}