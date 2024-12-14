import { create } from "zustand";
import { io } from "socket.io-client";

const BASE_URL = "/";
// const BASE_URL = "http://localhost:4000/";
// const BASE_URL = "http://192.168.29.244:4000/";

export const useAuthStore = create((set, get) => ({
    socket: null,
    onlineUsers: [],
    name: "",
    friendName: "",
    calling: false,
    incall: false,
    calldisconnected: false,
    myStream: null,
    remoteStream: null,
    setMyStream: (stream) => {
        set({ myStream: stream });
    },
    setRemoteStream: (stream) => {
        set({ remoteStream: stream });
    },
    setCall: ({ calling, incall, calldisconnected, friendName }) => {
        set({ calling: calling, incall: incall, calldisconnected: calldisconnected, friendName: friendName });
    },
    connectSocket: async ({ roomNo, name }) => {
        if (get().socket?.connected)
            return;

        set({ name: name })

        const newSocket = io(BASE_URL);
        set({ socket: newSocket });
        newSocket.connect();
        newSocket.emit("join", { roomNo, name });

        newSocket.on("onJoin", (usersInRoom) => {
            set({ onlineUsers: usersInRoom });
        })

        newSocket.on("userJoined", (user) => {
            set((state) => ({
                onlineUsers: [...state.onlineUsers, user]
            }))
        })

        newSocket.on("userLeft", (socketId) => {
            console.log(`User left: ${socketId}`);

            set((state) => {
                const updatedUsers = state.onlineUsers.filter(user => user.socketId !== socketId);
                return { onlineUsers: updatedUsers };
            });
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