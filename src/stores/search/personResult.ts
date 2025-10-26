import type { PersonResult } from "@/types/homepage.type";
import type { MyProfileData } from "@/types/homepage.type";
import { ref } from "vue";

type ProfileData = MyProfileData & {
    followed: boolean
}

export const personResults = ref<ProfileData[]>([
    {
        user_id: 101,
        user_nickname: 'SarahDev',
        user_avatar: 1,
        user_follower: 2,
        user_following: 4,
        user_bio: 'Full-stack engineer focusing on clean architecture and high-performance APIs.',
        followed: true
    }
]);
