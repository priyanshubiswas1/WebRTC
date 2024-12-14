import express from "express";
import http from "http";
import { Server } from "socket.io";
import path from 'path';

const app = express();

const __dirname = path.resolve();
// Serve static files from the React app
app.use(express.static(path.join(__dirname, "../client/dist")));

const server = http.createServer(app);
const io = new Server(server, {
    cors: true
    // {
    //     // origin: ["http://localhost:5173"],
    //     // origin: ["http://192.168.29.244:5173"],
    // }
});

export { app, io, server };