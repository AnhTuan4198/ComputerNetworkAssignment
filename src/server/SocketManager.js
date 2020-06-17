const io  = require('./index.js').io;

const {
  USER_CONNECTED,
  VERIFY_USER,
  LOG_OUT,
  COMMUNITY_CHAT,
  USER_DISCONNECTED,
  MESSAGE_RECEIVED,
  MESSAGE_SENT,
  TYPING,
  PRIVATE_CHAT
} = require("../actions/event");
const { createUser, createChatbox, createMessage} = require('../actions/actions')

let connectedUser = {};
let communityChat = createChatbox();

module.exports = function(socket){
    console.log(` ${socket.id } is connecting `);
    const sendMessageToChat = (sender) => {
      return (chatId, message) => {
        socket.emit(
          `${MESSAGE_RECEIVED}-${chatId}`,
          createMessage({ message, sender })
        );
      };
    };

    const updateTypingToChat = (user) => {
      return (chatId, isTyping) => {
        socket.emit(`${TYPING}-${chatId}`, { user, isTyping });
      };
    };

    //verify user
    let sendMessageToChatFromUser;
    let typingStatusFromUser;
    socket.on(VERIFY_USER,(nickname,callback)=>{    
        logined(nickname,connectedUser)?
        callback({user:null,logined:true}):
        callback({user:createUser({name:nickname,socketId:socket.id}),logined:false
        })
    })
    //User connected 
    socket.on(USER_CONNECTED,(user)=>{
        //console.log(user);
        user.socketId = socket.id
        connectedUser = addUser(connectedUser,user);
        socket.user=user;
        sendMessageToChatFromUser = sendMessageToChat(user.name);
        typingStatusFromUser=updateTypingToChat(user.name);
        io.emit(USER_CONNECTED,connectedUser);
        //console.log(connectedUser)
    })
    // disconnected 

    socket.on('disconnect',()=>{
        if('user' in socket){
            connectedUser = removeUSer(socket.user.name,connectedUser);
            io.emit(USER_DISCONNECTED, connectedUser);
            //console.log(connectedUser);
        }
    })
    //USer logout
    socket.on(LOG_OUT,(userName)=>{
        connectedUser = removeUSer(userName, connectedUser);
        io.emit(USER_DISCONNECTED, connectedUser);
    })
    //
    socket.on(COMMUNITY_CHAT,(callback)=>{
        callback(communityChat);
    })

    socket.on(MESSAGE_SENT,({chatId,message})=>{
        sendMessageToChatFromUser(chatId,message);
    })

    socket.on(TYPING,({chatId,isTyping})=>{
        typingStatusFromUser(chatId,isTyping);
    })
    
    socket.on(PRIVATE_CHAT,({receiver,user,activeChat})=>{
        if(receiver in connectedUser){
            const receiverSocket = connectedUser[receiver].socketId;
            if(activeChat === null || activeChat.id === communityChat.id){
                const newChat=createChatbox({name:`${receiver}&${user}`,users:[receiver,user]})
                socket.to(receiverSocket).emit(PRIVATE_CHAT,newChat);
                socket.emit(PRIVATE_CHAT,newChat); 
            }else{
                socket.to(receiverSocket).emit(PRIVATE_CHAT, activeChat);
            }
        }
    })
}

//Add new user connecting 
function addUser (userList,user){
    const newList = Object.assign({},userList);
    newList[user.name]=user;
    return newList
}

//User disconnect or log-out
function removeUSer(userName,userList){
    const newList = Object.assign({},userList);
    delete newList[userName];
    return newList
}

// check connecting status of user
function logined(user, userList){
    return user in userList
}


