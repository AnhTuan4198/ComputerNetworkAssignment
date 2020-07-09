const io  = require('./index.js').io;
//console.log(io);
const {
  USER_CONNECTED,
  VERIFY_USER,
  LOG_OUT,
  COMMUNITY_CHAT,
  USER_DISCONNECTED,
  MESSAGE_RECEIVED,
  MESSAGE_SENT,
  TYPING,
  PRIVATE_CHAT,
  FILE_SENT,
  FILE_RECEIVED,
} = require("../actions/event");

const {
  createUser,
  createChatbox,
  createMessage,
  createLink,
} = require("../actions/actions");

let connectedUser = {};
let communityChat = createChatbox();


module.exports = function(socket){
   console.log(` ${socket.id} is connecting `);
  let sendMessageToChatFromUser;
  let typingStatusFromUser;
  let sendFileToChatFromUser;
  socket.on(VERIFY_USER, (nickname,peerId, callback) => {
    logined(nickname, connectedUser)
      ? callback({ user: null, logined: true })
      : callback({
          user: createUser({ name: nickname, socketId: socket.id,peerId:peerId }),
          logined: false,
        });
  });
  //User connected
  socket.on(USER_CONNECTED, (user) => {
    //console.log(user);
    user.socketId = socket.id;
    connectedUser = addUser(connectedUser, user);
    socket.user = user;
    sendMessageToChatFromUser = sendMessageToChat(user.name);
    typingStatusFromUser = updateTypingToChat(user.name);
    sendFileToChatFromUser= sendFileTochat(user.name)
    io.emit(USER_CONNECTED, connectedUser);
    console.log(connectedUser);
  });

  socket.on("disconnect", () => {
    if ("user" in socket) {
      connectedUser = removeUSer(socket.user.name, connectedUser);
      io.emit(USER_DISCONNECTED, connectedUser);
    }
  });
  //USer logout
  socket.on(LOG_OUT, (userName) => {
    connectedUser = removeUSer(userName, connectedUser);
    io.emit(USER_DISCONNECTED, connectedUser);
  });
  //
  /*
  socket.on(COMMUNITY_CHAT, (callback) => {
    callback(communityChat);
  });
  */
  socket.on(MESSAGE_SENT, ({ chatId, message }) => {
    sendMessageToChatFromUser(chatId,message);
    
  });

  socket.on(TYPING, ({ chatId, isTyping }) => {
    typingStatusFromUser(chatId, isTyping);
  });

  socket.on(PRIVATE_CHAT, ({ receiver, user, activeChat }) => {
    console.log("This is receiver: "+receiver)
    if (receiver.name in connectedUser) {
      console.log(receiver.name +" and "+ user.name);
      const receiverSocket = connectedUser[receiver.name].socketId;
      if (activeChat === null || activeChat.id === communityChat.id) {
        const newChat = createChatbox({
          name: `${receiver.name}&${user.name}`,
          users: [receiver, user],
        });
        socket.to(receiverSocket).emit(PRIVATE_CHAT, newChat);
        socket.emit(PRIVATE_CHAT, newChat);
      } else {
        socket.to(receiverSocket).emit(PRIVATE_CHAT, activeChat);
      }
    }
  });

  socket.on(FILE_SENT,({chatId,data})=>{
    sendFileToChatFromUser(chatId, data);
  })
  
};

// Peer host

const sendMessageToChat = (sender) => {
  return (chatId, message) => {
    io.emit(
      `${MESSAGE_RECEIVED}-${chatId}`,
      createMessage({ message, sender })
    );
  };
};

const sendFileTochat = (sender)=>{
  return(chatId,data)=>{
    const {fileName, buffer,type}= data;
    //console.log("this is chat ID  " + chatId);
    io.emit(
      `${FILE_RECEIVED}-${chatId}`,
      createLink({ fileName, buffer, sender, type })
    );
    //console.log(createLink({fileName, buffer, sender,type })) ;
  };
};

const updateTypingToChat = (user) => {
  return (chatId, isTyping) => {
    io.emit(`${TYPING}-${chatId}`, { user, isTyping });
  };
};

//Add new user connecting
function addUser(userList, user) {
  const newList = Object.assign({}, userList);
  newList[user.name] = user;
  return newList;
}

//User disconnect or log-out
function removeUSer(userName, userList) {
  const newList = Object.assign({}, userList);
  delete newList[userName];
  return newList;
}

// check connecting status of user
function logined(user, userList) {
  return user in userList;
}