import { ref } from 'vue'

type SearchContact = {
    user_id: number,
    firstName: string,
    lastName: string,
    middleName?: string,
    age?: string
}

export const contactName = ref<string | undefined>(undefined)
export const newContact = ref<SearchContact | null>(null)
