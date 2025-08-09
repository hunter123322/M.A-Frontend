const messages = [
    {
        _id: "000000000000000000000001",
        senderID: "userA",
        receiverID: "userB",
        conversationID: "convAB",
        content: "iloveyouuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu",
        contentType: "text",
        reactions: [],
        status: "sent",
        hide: false,
        createdAt: "2025-08-07T08:00:00.000Z",
        updatedAt: "2025-08-07T08:00:00.000Z"
    },
    {
        _id: "000000000000000000000002",
        senderID: "userB",
        receiverID: "userA",
        conversationID: "convAB",
        content: "Almost done. Should be ready in 10 mins.",
        contentType: "text",
        reactions: [
            { userID: "userA", emoji: "👍" }
        ],
        status: "delivered",
        hide: false,
        createdAt: "2025-08-07T08:01:10.000Z",
        updatedAt: "2025-08-07T08:01:20.000Z"
    },
    {
        _id: "000000000000000000000003",
        senderID: "userA",
        receiverID: "userB",
        conversationID: "convAB",
        content: "Awesome!",
        contentType: "text",
        reactions: [],
        status: "seen",
        hide: false,
        createdAt: "2025-08-07T08:02:00.000Z",
        updatedAt: "2025-08-07T08:02:00.000Z"
    },
    {
        _id: "000000000000000000000004",
        senderID: "userB",
        receiverID: "userA",
        conversationID: "convAB",
        content: "screenshot.png",
        contentType: "image",
        reactions: [
            { userID: "userA", emoji: "🔥" }
        ],
        status: "seen",
        hide: false,
        createdAt: "2025-08-07T08:03:45.000Z",
        updatedAt: "2025-08-07T08:03:45.000Z"
    },
    {
        _id: "000000000000000000000005",
        senderID: "userA",
        receiverID: "userB",
        conversationID: "convAB",
        content: "Looks good. Add a border on the top.",
        contentType: "text",
        reactions: [],
        status: "delivered",
        hide: false,
        createdAt: "2025-08-07T08:04:30.000Z",
        updatedAt: "2025-08-07T08:04:30.000Z"
    },
    {
        _id: "000000000000000000000006",
        senderID: "userB",
        receiverID: "userA",
        conversationID: "convAB",
        content: "Sure, doing it now.",
        contentType: "text",
        reactions: [],
        status: "sent",
        hide: false,
        createdAt: "2025-08-07T08:05:15.000Z",
        updatedAt: "2025-08-07T08:05:15.000Z"
    },
    {
        _id: "000000000000000000000007",
        senderID: "userB",
        receiverID: "userA",
        conversationID: "convAB",
        content: "draft_v2.mp4",
        contentType: "video",
        reactions: [],
        status: "sending",
        hide: false,
        createdAt: "2025-08-07T08:06:30.000Z",
        updatedAt: "2025-08-07T08:06:30.000Z"
    },
    {
        _id: "000000000000000000000008",
        senderID: "userA",
        receiverID: "userB",
        conversationID: "convAB",
        content: "Got it. Reviewing now.",
        contentType: "text",
        reactions: [],
        status: "delivered",
        hide: false,
        createdAt: "2025-08-07T08:07:20.000Z",
        updatedAt: "2025-08-07T08:07:20.000Z"
    },
    {
        _id: "000000000000000000000009",
        senderID: "userA",
        receiverID: "userB",
        conversationID: "convAB",
        content: "audio_feedback.mp3",
        contentType: "audio",
        reactions: [
            { userID: "userB", emoji: "🎧" }
        ],
        status: "sent",
        hide: false,
        createdAt: "2025-08-07T08:08:45.000Z",
        updatedAt: "2025-08-07T08:08:45.000Z"
    },
    {
        _id: "00000000000000000000000a",
        senderID: "userB",
        receiverID: "userA",
        conversationID: "convAB",
        content: "Perfect. I’ll finalize everything.",
        contentType: "text",
        reactions: [],
        status: "seen",
        hide: false,
        createdAt: "2025-08-07T08:10:00.000Z",
        updatedAt: "2025-08-07T08:10:00.000Z"
    },
    {
        _id: "000000000000000000000001",
        senderID: "userA",
        receiverID: "userB",
        conversationID: "convAB",
        content: "Hey! Did you finish the task?",
        contentType: "text",
        reactions: [],
        status: "sent",
        hide: false,
        createdAt: "2025-08-07T08:00:00.000Z",
        updatedAt: "2025-08-07T08:00:00.000Z"
    },
    {
        _id: "000000000000000000000002",
        senderID: "userB",
        receiverID: "userA",
        conversationID: "convAB",
        content: "Almost done. Should be ready in 10 mins.",
        contentType: "text",
        reactions: [
            { userID: "userA", emoji: "👍" }
        ],
        status: "delivered",
        hide: false,
        createdAt: "2025-08-07T08:01:10.000Z",
        updatedAt: "2025-08-07T08:01:20.000Z"
    },
    {
        _id: "000000000000000000000003",
        senderID: "userA",
        receiverID: "userB",
        conversationID: "convAB",
        content: "Awesome!",
        contentType: "text",
        reactions: [],
        status: "seen",
        hide: false,
        createdAt: "2025-08-07T08:02:00.000Z",
        updatedAt: "2025-08-07T08:02:00.000Z"
    },
    {
        _id: "000000000000000000000004",
        senderID: "userB",
        receiverID: "userA",
        conversationID: "convAB",
        content: "screenshot.png",
        contentType: "image",
        reactions: [
            { userID: "userA", emoji: "🔥" }
        ],
        status: "seen",
        hide: false,
        createdAt: "2025-08-07T08:03:45.000Z",
        updatedAt: "2025-08-07T08:03:45.000Z"
    },
    {
        _id: "000000000000000000000005",
        senderID: "userA",
        receiverID: "userB",
        conversationID: "convAB",
        content: "Looks good. Add a border on the top.",
        contentType: "text",
        reactions: [],
        status: "delivered",
        hide: false,
        createdAt: "2025-08-07T08:04:30.000Z",
        updatedAt: "2025-08-07T08:04:30.000Z"
    },
    {
        _id: "000000000000000000000006",
        senderID: "userB",
        receiverID: "userA",
        conversationID: "convAB",
        content: "Sure, doing it now.",
        contentType: "text",
        reactions: [],
        status: "sent",
        hide: false,
        createdAt: "2025-08-07T08:05:15.000Z",
        updatedAt: "2025-08-07T08:05:15.000Z"
    },
    {
        _id: "000000000000000000000007",
        senderID: "userB",
        receiverID: "userA",
        conversationID: "convAB",
        content: "draft_v2.mp4",
        contentType: "video",
        reactions: [],
        status: "sending",
        hide: false,
        createdAt: "2025-08-07T08:06:30.000Z",
        updatedAt: "2025-08-07T08:06:30.000Z"
    },
    {
        _id: "000000000000000000000008",
        senderID: "userA",
        receiverID: "userB",
        conversationID: "convAB",
        content: "Got it. Reviewing now.",
        contentType: "text",
        reactions: [],
        status: "delivered",
        hide: false,
        createdAt: "2025-08-07T08:07:20.000Z",
        updatedAt: "2025-08-07T08:07:20.000Z"
    },
    {
        _id: "000000000000000000000009",
        senderID: "userA",
        receiverID: "userB",
        conversationID: "convAB",
        content: "audio_feedback.mp3",
        contentType: "audio",
        reactions: [
            { userID: "userB", emoji: "🎧" }
        ],
        status: "sent",
        hide: false,
        createdAt: "2025-08-07T08:08:45.000Z",
        updatedAt: "2025-08-07T08:08:45.000Z"
    },
    {
        _id: "00000000000000000000000a",
        senderID: "userB",
        receiverID: "userA",
        conversationID: "convAB",
        content: "Perfect. I’ll finalize everythingaaaaaaa.",
        contentType: "text",
        reactions: [],
        status: "seen",
        hide: false,
        createdAt: "2025-08-07T08:10:00.000Z",
        updatedAt: "2025-08-07T08:10:00.000Z"
    }
];

export default messages;
