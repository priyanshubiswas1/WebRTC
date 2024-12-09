import { app, server, io } from "./lib/socket.js";

const PORT = 4000;

app.get("/", (req, res) => {
    res.send("server is up baby");
});

const userSocketMap = {};
const userRoomMap = {};

io.on("connection", (socket) => {
    console.log(`socket connected: ${socket.id}`);
    socket.on("join", (roomId) => {
        // userSocketMap[socket.id] = userName;
        userRoomMap[socket.id] = roomId;

        socket.join(roomId);

        io.in(roomId).fetchSockets().then((sockets) => {
            const usersInRoom = sockets.map((socket) => ({
                // userName: userSocketMap[socket.id];
                socketId: socket.id
            }));

            socket.emit("onJoin", usersInRoom);
            socket.broadcast.to(roomId).emit("userJoined", {
                // userName: userSocketMap[socket.id],
                socketId: socket.id
            })
        }).catch((err) => {
            console.log(err);
        })
    })
    socket.on("disconnect", () => {
        console.log("User disconnected", socket.id);
        const roomId = userRoomMap[socket.id];
        delete userRoomMap[socket.id];
        socket.broadcast.to(roomId).emit("userLeft", socket.id);
    });
});

server.listen(PORT, () => {
    console.log(`Server is up at ${PORT} baby!`);
});