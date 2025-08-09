export function deleteMessage(messageId: string) {
  if (
    typeof messageId !== 'string' || messageId.trim() === ''
  ) {
    return;
  }

  const data = { messageId: messageId }
  return data;
}

