const io  = require('./index.js').io;
const {USER_CONNECTED,VERIFY_USER, LOG_OUT} =require('../actions/event');
const { createUser, createChatbox, createMessage} = require('../actions/actions')
//console.log(io); 
let connectedUser = [];
module.exports = function(socket){
    console.log(` ${socket.id } is connecting `);
    //verify user
    socket.on(VERIFY_USER,(nickname,callback)=>{
        //console.log(nickname);
        logined(nickname,connectedUser)?
        callback({user:null,logined:true}):
        callback({user:createUser({name:nickname}),logined:false
        })
    })
    //User connected 
    socket.on(USER_CONNECTED,(user)=>{
        connectedUser = addUser(connectedUser,user);
        socket.user=user;
        io.emit(USER_CONNECTED,connectedUser);
        console.log(connectedUser)
    })
}

function addUser (userList,user){
    const newList = Object.assign({},userList);
    newList[user.name]=user;
    return newList
}

function removeUSer(userName,userList){
    const newList = Object.assign({},userList);
    delete newList[userName];
    return newlisit
}

function logined(user, userList){
    return user in userList
}