// streaming.ts
import { ref } from 'vue'
import type { Ref } from 'vue'
import { socket } from '@/script/socket.event'
import Peer from 'simple-peer'

// Use a type for MediaDevice to align with your preferences, Hunter.
type MediaDevice = 'camera' | 'screen' | null

// Your existing global state
export const videoRef = ref<HTMLVideoElement | null>(null) // remote
export const localVideoRef = ref<HTMLVideoElement | null>(null) // local
export const audioStream = ref<MediaStream | null>(null)
export const videoStream = ref<MediaStream | null>(null)
export const isCameraOn = ref<boolean>(false)
export const isSpeakerOn = ref<boolean>(false)
export const isSharingScreen = ref<boolean>(false)
export const endCall = ref<boolean>(true)
export const isMicOn = ref<boolean>(false)
export const callDuration = ref<number>(0)
const remoteStream = new MediaStream()
let timer: number | null = null

// ---------------------------
// GLOBAL METHODS
// ---------------------------

/**
 * Updates the local video element with the combined stream.
 * This is the central point for rendering local media.
 */
const updateLocalVideo = () => {
  const combinedStream = new MediaStream()
  if (audioStream.value) {
    audioStream.value.getAudioTracks().forEach((track) => combinedStream.addTrack(track))
  }
  if (videoStream.value) {
    videoStream.value.getVideoTracks().forEach((track) => combinedStream.addTrack(track))
  }
  if (localVideoRef.value) {
    localVideoRef.value.srcObject = combinedStream
    localVideoRef.value.muted = !isSpeakerOn.value
  }
}

/**
 * Stops all tracks in a given media stream and sets the ref to null.
 * @param streamRef The ref to the media stream to stop.
 */
const stopStream = (streamRef: Ref<MediaStream | null>) => {
  if (streamRef.value) {
    streamRef.value.getTracks().forEach((track) => track.stop())
    streamRef.value = null
  }
}

/**
 * Initializes both camera and microphone, sets up streams, and updates the local video.
 */
export const startCall = async () => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    videoStream.value = new MediaStream([stream.getVideoTracks()[0]])
    audioStream.value = new MediaStream([stream.getAudioTracks()[0]])

    isCameraOn.value = true
    isMicOn.value = true
    endCall.value = false

    updateLocalVideo()
    startTimer()
  } catch (err) {
    console.error('Error starting call:', err)
    endCall.value = true
  }
}

export const toggleMic = () => {
  isMicOn.value = !isMicOn.value
  if (audioStream.value) {
    audioStream.value.getAudioTracks().forEach((track) => (track.enabled = isMicOn.value))
  }
}

export const toggleSpeaker = () => {
  isSpeakerOn.value = !isSpeakerOn.value
  if (localVideoRef.value) {
    localVideoRef.value.muted = !isSpeakerOn.value
  }
}

export const toggleCamera = async () => {
  stopStream(videoStream)

  if (isSharingScreen.value) {
    isSharingScreen.value = false
    // Notify server to stop screen share producer
  }

  if (!isCameraOn.value) {
    try {
      videoStream.value = await navigator.mediaDevices.getUserMedia({ video: true })
      isCameraOn.value = true
      // Notify server to start camera producer
    } catch (err) {
      console.error('Error toggling camera on:', err)
      isCameraOn.value = false
    }
  } else {
    isCameraOn.value = false
    // Notify server to stop camera producer
  }
  updateLocalVideo()
}

export const toggleScreenShare = async () => {
  stopStream(videoStream)

  if (isCameraOn.value) {
    isCameraOn.value = false
    // Notify server to stop camera producer
  }

  if (!isSharingScreen.value) {
    try {
      videoStream.value = await navigator.mediaDevices.getDisplayMedia({ video: true })
      isSharingScreen.value = true
      // Notify server to start screen share producer
      videoStream.value.getVideoTracks()[0].onended = () => {
        isSharingScreen.value = false
        videoStream.value = null
        updateLocalVideo()
        // Notify server to stop screen share producer
      }
    } catch (err) {
      console.error('Error toggling screen share on:', err)
      isSharingScreen.value = false
    }
  } else {
    isSharingScreen.value = false
    // Notify server to stop screen share producer
  }
  updateLocalVideo()
}

export const endAllStreams = () => {
  stopStream(audioStream)
  stopStream(videoStream)

  if (localVideoRef.value) {
    localVideoRef.value.srcObject = null
  }

  isCameraOn.value = false
  isSharingScreen.value = false
  isMicOn.value = false
  endCall.value = true

  if (socket && socket.connected) {
    socket.disconnect()
  }

  stopTimer()
  callDuration.value = 0
}

export const startTimer = () => {
  if (timer) return
  timer = window.setInterval(() => {
    callDuration.value++
  }, 1000)
}

export const stopTimer = () => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}
