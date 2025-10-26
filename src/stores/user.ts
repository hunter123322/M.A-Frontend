import { ref } from "vue";
import type { MyProfileData } from "@/types/homepage.type";

export type User = {
  user_id: number
  firstName: string
  middleName: string
  lastName: string
  age: number
  username?: string
  password: string
}

export const user = ref<User | null>(null);
export const myProfileData = ref<MyProfileData | null>(null)

