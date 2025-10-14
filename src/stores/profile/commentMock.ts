import { ref } from 'vue';
type User = {
    id: string;
    email: string;
    avatarUrl: string;
};

export type Comment = {
    _id: string;
    postID?: string;
    commentID?: string;
    text: string;
    likes: number;
    author: User;
    showReply?: boolean; // UI state for showing/hiding replies
    replyText?: string; // Pre-filled reply text
    mentions?: User[];
    createdAt?: string;
    updatedAt?: string;
};

export const commentsReply = ref<Comment[]>([
    {
        _id: "12",
        commentID: "1",
        text: "That sunset is beautiful! Where was this tasdasdasdaken?",
        likes: 20,
        createdAt: "2025-10-08T09:15:23.000Z",
        updatedAt: "2025-10-08T10:45:11.000Z",
        author: {
            id: "u6",
            email: "traveljunkie",
            avatarUrl: "https://example.com/avatars/traveljunkie.jpg",
        },
    },
    {
        _id: "13",
        commentID: "1",
        text: "I absolutely agree! Thrillers are the basdasdasdasdest. asdasdasd📖",
        likes: 8,
        createdAt: "2025-10-07T17:30:00.000Z",
        updatedAt: "2025-10-08T08:20:45.000Z",
        author: {
            id: "u7",
            email: "bookworm_22",
            avatarUrl: "https://example.com/avatars/bookworm_22.jpg",
        },
    },
])

export const comments = ref<Comment[]>(
    [
        {
            _id: "1",
            postID: "1",
            text: "Looks amazing! I need to visit the beach soon. 😎",
            likes: 12,
            author: {
                id: "u5",
                email: "beachlover89",
                avatarUrl: "./avatar/Avatar_2.png",
            },
        },
        {
            _id: "2",
            postID: "1",
            text: "That sunset is beautiful! Where was this taken?",
            likes: 20,
            author: {
                id: "u6",
                email: "traveljunkie",
                avatarUrl: "https://example.com/avatars/traveljunkie.jpg",
            },
        },
        {
            _id: "3",
            postID: "2",
            text: "I absolutely agree! Thrillers are the best. 📖",
            likes: 8,
            author: {
                id: "u7",
                email: "bookworm_22",
                avatarUrl: "https://example.com/avatars/bookworm_22.jpg",
            },
        },
        {
            _id: "4",
            postID: "2",
            text: "Which book is it? I’m looking for a good thriller.",
            likes: 3,
            author: {
                id: "u8",
                email: "reading_addict",
                avatarUrl: "https://example.com/avatars/reading_addict.jpg",
            },
            replyText: "Let me know which one you recommend! 😊",
        },
        {
            _id: "5",
            postID: "3",
            text: "That new gadget is a game-changer! What do you think of the performance?",
            likes: 35,
            author: {
                id: "u9",
                email: "techsavvy",
                avatarUrl: "https://example.com/avatars/techsavvy.jpg",
            },
        },
        {
            _id: "6",
            postID: "3",
            text: "I’ve been eyeing this! How long does the battery last?",
            likes: 5,
            author: {
                id: "u10",
                email: "gadgetguru",
                avatarUrl: "https://example.com/avatars/gadgetguru.jpg",
            },
        },
        {
            _id: "7",
            postID: "3",
            text: "Can you do a follow-up review in a few weeks? 🤞",
            likes: 12,
            author: {
                id: "u11",
                email: "techlover101",
                avatarUrl: "https://example.com/avatars/techlover101.jpg",
            },
            showReply: true,
            replyText: "Would love to hear more about it after some use!",
        },
        {
            _id: "8",
            postID: "4",
            text: "Killing it with those morning workouts! Keep it up! 💪",
            likes: 18,
            author: {
                id: "u12",
                email: "fitnessjunkie",
                avatarUrl: "https://example.com/avatars/fitnessjunkie.jpg",
            },
        },
        {
            _id: "9",
            postID: "4",
            text: "Love this routine! Do you have a specific diet to go with it?",
            likes: 10,
            author: {
                id: "u13",
                email: "healthnut",
                avatarUrl: "https://example.com/avatars/healthnut.jpg",
            },
        },
        {
            _id: "10",
            postID: "4",
            text: "Morning workouts are the best! I need to start getting up earlier. 😅",
            likes: 15,
            author: {
                id: "u14",
                email: "earlybird_fitness",
                avatarUrl: "https://example.com/avatars/earlybird_fitness.jpg",
            },
            mentions: [
                {
                    id: "u12",
                    email: "fitnessjunkie",
                    avatarUrl: "https://example.com/avatars/fitnessjunkie.jpg",
                },
            ],
        },
    ]
);
