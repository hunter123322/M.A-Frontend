import { ref } from "vue";

type Participant = {
    userID: number,
    firstName: string,
    lastName: string,
    nickname: string,
    mute: { muteStatus: false, timeFrame: "" },
    createdAt?: string,
    updatedAt?: string
}

type Contacts = {
    contactID: string,
    _id?: number,
    createdAt?: string,
    updatedAt?: string,
    participant: Participant[]
}

const currentConversationID = ref<string | null>(null)
const conversationData = ref<Contacts[]>([])

export function useConversation() {
    return { currentConversationID, conversationData }
}