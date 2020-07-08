const express = require('express');
const app = express();
const server = require('http').createServer(app); 
const io  =module.exports.io= require('socket.io')(server);
const PORT = process.env.PORT || 8080;
const CORS =require('cors');
app.use(CORS);
const SocketManager = require("./SocketManager");
io.on("connection", SocketManager);
app.use(express.static(__dirname + "/../../build"));

server.listen(PORT,"191.16.20.6");