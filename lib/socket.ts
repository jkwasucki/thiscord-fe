import { io } from "socket.io-client";
const socket = io('https://thiscord-backend-vycpo.ondigitalocean.app', {
  transports: ['websocket'],
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
});


export default socket

