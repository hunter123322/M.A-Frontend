// src/store/receiver.ts
import { ref } from 'vue'

const _currentReceiverID = ref<number | null>(null)
export const currReceiverID = ref<number | null>(null)

export function useReceiver() {
  // Expose the reactive variable as a readonly property
  const currentReceiverID = _currentReceiverID

  return {
    currentReceiverID,
  }
}
