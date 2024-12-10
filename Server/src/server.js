import { app, server, io } from "./lib/socket.js";

const PORT = 4000;

app.get("/", (req, res) => {
    res.send("server is up baby");
});

const userSocketMap = {};
const userRoomMap = {};

io.on("connection", (socket) => {
    console.log(`socket connected: ${socket.id}`);
    socket.on("join", ({ roomNo, name }) => {
        userSocketMap[socket.id] = name;
        userRoomMap[socket.id] = roomNo;

        socket.join(roomNo);

        io.in(roomNo).fetchSockets().then((sockets) => {
            const usersInRoom = sockets.map((socket) => ({
                userName: userSocketMap[socket.id],
                socketId: socket.id
            }));

            socket.emit("onJoin", usersInRoom);
            socket.broadcast.to(roomNo).emit("userJoined", {
                userName: userSocketMap[socket.id],
                socketId: socket.id
            })
        }).catch((err) => {
            console.log(err);
        })
    })
    socket.on("disconnect", () => {
        console.log("User disconnected", socket.id);
        const roomNo = userRoomMap[socket.id];
        delete userSocketMap[socket.id];
        delete userRoomMap[socket.id];
        socket.broadcast.to(roomNo).emit("userLeft", socket.id);
    });
});

server.listen(PORT, () => {
    console.log(`Server is up at ${PORT} baby!`);
});