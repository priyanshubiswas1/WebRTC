import { app, server, io } from "./lib/socket.js";
import path from 'path';

const PORT = 4000;

const __dirname = path.resolve();
// Serve static files from the React app
app.use(express.static(path.join(__dirname, "../client/dist")));

app.get("/", (req, res) => {
    res.send("Server is up and running!");
});

const userSocketMap = {};
const userRoomMap = {};

io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on("join", ({ roomNo, name }) => {
        userSocketMap[socket.id] = name;
        userRoomMap[socket.id] = roomNo;

        socket.join(roomNo);

        // Notify users in the room
        io.in(roomNo).fetchSockets().then((sockets) => {
            const usersInRoom = sockets.map((socket) => ({
                userName: userSocketMap[socket.id],
                socketId: socket.id,
            }));

            socket.emit("onJoin", usersInRoom);
            socket.broadcast.to(roomNo).emit("userJoined", {
                userName: userSocketMap[socket.id],
                socketId: socket.id,
            });
        }).catch((err) => {
            console.error("Error fetching sockets:", err);
        });
    });

    socket.on("offer", ({ from, to, offer }) => {
        const id = Object.keys(userSocketMap).find(key => userSocketMap[key] === to);
        if (id) {
            io.to(id).emit("offer", { from, to, offer });
        } else {
            console.log("User not found for ID:", to);
        }
    });

    socket.on("answer", ({ from, to, answer }) => {
        const id = Object.keys(userSocketMap).find(key => userSocketMap[key] === to);
        if (id) {
            io.to(id).emit("answer", { from, to, answer });
        } else {
            console.log("User not found for ID:", to);
        }
    });

    socket.on("iceCandidate", ({ candidate, to }) => {
        const id = Object.keys(userSocketMap).find(key => userSocketMap[key] === to);
        if (id) {
            io.to(id).emit("iceCandidate", { candidate });
            console.log("IceCand ID:", id);
        }
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
        const roomNo = userRoomMap[socket.id];
        delete userSocketMap[socket.id];
        delete userRoomMap[socket.id];
        socket.broadcast.to(roomNo).emit("userLeft", socket.id);
    });
});

server.listen(PORT, () => {
    console.log(`Server is up at ${PORT}!`);
});
