import { io } from "socket.io-client";

// 🔥 Backend base URL (NOT frontend 5173)
const SOCKET_URL = import.meta.env.VITE_API_URL;

// 🔥 Create ONE global socket instance
export const socket = io(SOCKET_URL, {
  withCredentials: true,
  autoConnect: true,
});

// Optional: basic connection logs (useful for debugging)
socket.on("connect", () => {
  console.log("🟢 Socket connected:", socket.id);
});

socket.on("disconnect", () => {
  console.log("🔴 Socket disconnected");
});
