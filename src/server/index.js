const express = require('express');
const app = express();
const server = require('http').createServer(app); 
const p2p = require("socket.io-p2p-server").Server;
const io  = require('socket.io')(server);
const PORT = process.env.PORT || 8080;

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


io.use(p2p);// allow peer to use funtionality as server.

//central center
io.on('connection',function (socket) {
  console.log(` ${socket.id} is connecting `);
  //verify user
  let sendMessageToChatFromUser;
  let typingStatusFromUser;
  let sendFileToChatFromUser;
  socket.on(VERIFY_USER, (nickname, callback) => {
    logined(nickname, connectedUser)
      ? callback({ user: null, logined: true })
      : callback({
          user: createUser({ name: nickname, socketId: socket.id }),
          logined: false,
        });
  });
  //User connected
  socket.on(USER_CONNECTED, (user) => {
    user.socketId = socket.id;
    connectedUser = addUser(connectedUser, user);
    socket.user = user;
    sendMessageToChatFromUser = sendMessageToChat(user.name);
    typingStatusFromUser = updateTypingToChat(user.name);
    sendFileToChatFromUser= sendFileTochat(user.name)
    io.emit(USER_CONNECTED, connectedUser);
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
  socket.on(COMMUNITY_CHAT, (callback) => {
    callback(communityChat);
  });

  socket.on(MESSAGE_SENT, ({ chatId, message }) => {
    sendMessageToChatFromUser(chatId,message);
  });

  socket.on(TYPING, ({ chatId, isTyping }) => {
    typingStatusFromUser(chatId, isTyping);
  });

  socket.on(PRIVATE_CHAT, ({ receiver, user, activeChat }) => {
    if (receiver in connectedUser) {
      const receiverSocket = connectedUser[receiver].socketId;
      if (activeChat === null || activeChat.id === communityChat.id) {
        const newChat = createChatbox({
          name: `${receiver}&${user}`,
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

});

// Peer host
const sendMessageToChat = (sender) => {
  return (chatId, message) => {
    io.emit(
      `${MESSAGE_RECEIVED}-${chatId}`,
      createMessage({ message, sender})
    );
  };
};

const sendFileTochat = (sender)=>{
  return(chatId,data)=>{
    const {fileName, buffer,type}= data;
    //console.log("this is chat ID  " + chatId);
    io.emit(`${FILE_RECEIVED}-${chatId}`,
      createLink({fileName, buffer, sender, type }))
    console.log(createLink({fileName, buffer, sender,type })) ;
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

app.use(express.static(__dirname+"/../../build"))

server.listen(PORT, () => {
  console.log(`App is running on port ${PORT}`);
});