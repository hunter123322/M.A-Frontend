export function editMessage(messageId: string, editedMessage: string) {
  console.log("editMessage");

  if (
    typeof messageId !== 'string' || !messageId.trim() ||
    typeof editedMessage !== 'string' || !editedMessage.trim()
  ) {
    console.warn("Invalid messageId or editedMessage");
    return;
  }

  const data = { messageId: messageId, editedMessage: editedMessage };
  return data;
}