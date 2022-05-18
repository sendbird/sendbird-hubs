const express = require("express");
const cors = require('cors');
const createRoom = require('./routes/create-room');
const joinRoom = require('./routes/join-room');

const createServer = () => {
    const app = express();
    app.use(express.json());
    app.use(cors());
    app.post("/room", createRoom);
    app.post("/room/join", joinRoom);
    return app
}

module.exports = createServer