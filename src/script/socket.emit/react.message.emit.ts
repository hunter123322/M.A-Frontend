export function reactMessage(messageId: string, reaction: string, userID: string) {
  return {
    messageID: messageId,
    messageReaction: reaction,
    userID: userID
  };
}
