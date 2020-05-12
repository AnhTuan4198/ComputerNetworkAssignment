const app = require('http').createServer();
const io = module.exports.io = require('socket.io')(app);
const Manager = require('./SocketManager');
const PORT = process.env.PORT || 8080;

io.on('connect',Manager);
//io.emit('connec')
//console.log(io);

app.listen(PORT,()=>{
    console.log(`App is running on port ${PORT}`);
})