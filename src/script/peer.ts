// import { socket } from '@/';

// let peerConnection: RTCPeerConnection | null = null;

// export const startCall = async (roomId: string) => {
//   // Create RTCPeerConnection
//   peerConnection = new RTCPeerConnection();

//   // Add local tracks
//   if (audioStream.value) {
//     audioStream.value.getTracks().forEach(track =>
//       peerConnection!.addTrack(track, audioStream.value!)
//     );
//   }
//   if (videoStream.value) {
//     videoStream.value.getTracks().forEach(track =>
//       peerConnection!.addTrack(track, videoStream.value!)
//     );
//   }

//   // Remote stream handler
//   peerConnection.ontrack = (event) => {
//     if (videoRef.value) {
//       videoRef.value.srcObject = event.streams[0];
//     }
//   };

//   // ICE candidates -> send to server
//   peerConnection.onicecandidate = (event) => {
//     if (event.candidate) {
//       socket.emit("webrtcSignalRoom", { 
//         roomId, 
//         signal: { candidate: event.candidate } 
//       });
//     }
//   };

//   // Join the signaling room
//   socket.emit("joinRoom", roomId);

//   // Create offer
//   const offer = await peerConnection.createOffer();
//   await peerConnection.setLocalDescription(offer);

//   // Send offer to server/other peers
//   socket.emit("webrtcSignalRoom", { 
//     roomId, 
//     signal: { sdp: offer } 
//   });
// };

// // When receiving signaling messages from server
// socket.on("webrtc-signal", async ({ signal }) => {
//   if (!peerConnection) return;

//   if (signal.sdp) {
//     await peerConnection.setRemoteDescription(new RTCSessionDescription(signal.sdp));
//     if (signal.sdp.type === "offer") {
//       const answer = await peerConnection.createAnswer();
//       await peerConnection.setLocalDescription(answer);
//       socket.emit("webrtcSignalRoom", { roomId: "room-123", signal: { sdp: answer } });
//     }
//   } else if (signal.candidate) {
//     await peerConnection.addIceCandidate(new RTCIceCandidate(signal.candidate));
//   }
// });
