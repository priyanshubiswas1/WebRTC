import { create } from "zustand";
import { io } from "socket.io-client";

const BASE_URL = "http://localhost:4000/";

export const useAuthStore = create((set, get) => ({
    socket: null,
    onlineUsers: [],
    connectSocket: async (params) => {
        if (get().socket?.connected)
            return;
        const newSocket = io(BASE_URL);
        set({ socket: newSocket });
        newSocket.connect();
        newSocket.emit("join", params);

        newSocket.on("onJoin", (usersInRoom) => {
            set({ onlineUsers: usersInRoom });
        })

        newSocket.on("userJoined", (socketId) => {
            set((state) => ({
                onlineUsers: [...state.onlineUsers, socketId]
            }))
        })

        newSocket.on("userLeft", (socketId) => {
            console.log(`User left: ${socketId}`);

            set((state) => {
                const updatedUsers = state.onlineUsers.filter(user => user.socketId !== socketId);
                return { onlineUsers: updatedUsers };
            });

            // Log the updated state
            setTimeout(() => {
                console.log('Updated onlineUsers:', get().onlineUsers);
            }, 0);
        });
    },
    disconnectSocket: () => {
        const { socket } = get();
        if (socket?.connected) {
            socket.disconnect();
            set({ socket: null, onlineUsers: [] });
        }
    }
}));