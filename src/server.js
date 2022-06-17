const express = require("express");
const cors = require('cors');
const createUser = require('./routes/create-user');
require('dotenv').config();

const createServer = () => {
    const app = express();
    app.use(express.json());
    app.use(cors());
    app.use(express.static('public'));
    app.post("/user", createUser);
    return app
}

module.exports = createServer