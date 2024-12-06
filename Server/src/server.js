import { app, server, io } from "./lib/socket.js";

const PORT = 4000;

app.get("/", (req, res) => {
    res.send("server is up baby");
});

server.listen(PORT, () => {
    console.log(`Server is up at ${PORT} baby!`);
});