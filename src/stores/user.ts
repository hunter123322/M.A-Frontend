import { ref } from "vue";
export type User = {
  user_id: number
  firstName: string
  middleName: string
  lastName: string
  age: number
  username?: string
  password: string
}

export type MyProfileData = {
  user_id: number;
  user_bio: string;
  user_follower: number;
  user_avatar: number;
  user_nickname: string;
  user_following: number;
};

export const user = ref<User | null>(null);
export const myProfileData = ref<MyProfileData | null>(null)
