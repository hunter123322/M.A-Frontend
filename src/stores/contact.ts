import { ref } from 'vue'

type SearchContact = {
  user_id: number;
  firstName: string;
  lastName: string;
  middleName?: string;
  age?: number;
  user_avatar?: string | number;
  user_bio?: string;
  user_follower: number;
  user_following: number;
  user_nickname: string;
};


export const contactName = ref<string | undefined>(undefined)
export const newContact = ref<SearchContact | null>(null)
