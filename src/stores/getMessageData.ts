// src/store/chatData.ts
import { ref } from 'vue';

type DataToBeSent = {
  conversationID: string;
  createdAt: string;
};

type TestMessage = {
    _id: string;
    senderID: number;
    receiverID: number;
    conversationID: string;
    content: string;
    contentType: string;
    reactions: {
        userID: string;
        emoji: string;
    }[];
    status: string;
    hide: boolean;
    createdAt: string;
    updatedAt: string;
}

const getMessageReqData = ref<DataToBeSent>({
  conversationID: 'convAB',
  createdAt: '',
});

const returnMessageData = ref<TestMessage[]>([])

export function useReqData() {
  return {
    getMessageReqData,
    returnMessageData
  };
}