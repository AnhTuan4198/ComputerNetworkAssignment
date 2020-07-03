import React, { Component } from 'react';
import SideBar from './SideBar';
import ChatConsole from './ChatConsole';
import '../styles/chat/ChatContainer.css'
import {
  MESSAGE_SENT,
  TYPING,
  COMMUNITY_CHAT,
  MESSAGE_RECEIVED,
  PRIVATE_CHAT,
  FILE_SENT,
  FILE_RECEIVED
} from "../actions/event";
import p2p from "socket.io-p2p";


class ChatContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chats: [],
      activeChat: null,
    };
    this.sendPrivateChat=this.sendPrivateChat.bind(this);
  }
  componentDidMount() {
    const { socket} = this.props;
    this.initSocket(socket);
  }
  initSocket(socket){
    const {user,p2psocket} =this.props;
    //console.log(p2psocket);
    socket.emit(COMMUNITY_CHAT, this.resetChat);
    socket.on(PRIVATE_CHAT,this.addChat);
    socket.on('connect',()=>{
       socket.emit(COMMUNITY_CHAT, this.resetChat);
    })
  }
  sendPrivateChat(receiver){
    const {socket,user}=this.props;
    const {activeChat}=this.state;
    socket.emit(PRIVATE_CHAT,{receiver,user:user.name,activeChat})
  }
  //reset chat
  resetChat = (chat) => {
    return this.addChat(chat, true);
  };
  //addChat
  addChat = (chat, reset=false) => {
    const { socket, p2psocket } = this.props;
    const { chats } = this.state;

    const newChatList = reset ? [chat] : [...chats, chat];
    this.setState({
      chats: newChatList,
      activeChat: reset ? chat : this.state.activeChat,
    });

    const messageEvent = `${MESSAGE_RECEIVED}-${chat.id}`;
    const typingEvent = `${TYPING}-${chat.id}`;
    const fileEvent =`${FILE_RECEIVED}-${chat.id}`;

    socket.on(messageEvent, this.addMessagetoChat(chat.id));
    socket.on(typingEvent, this.updateTyping(chat.id));
    socket.on(fileEvent,this.addLinkToChat(chat.id));
  };

  addMessagetoChat = (chatId) => {
    return (message) => {
      //console.log(message);
      const { chats } = this.state;
      let newChatList = chats.map((chat) => {
        if (chat.id === chatId) {
          chat.messages.push(message);
          //console.log(chat.messages);
        }
        return chat;
      });
      this.setState({ chats: newChatList });
    };
  };

  addLinkToChat= (chatId)=>{
    return (file)=>{
      //console.log(file);
      let blob= new Blob(file.buffer,{type:file.type});
      let URLcreator = URL||window.webkitURL;
      let fileURL=URLcreator.createObjectURL(blob);
      const {chats}=this.state;
      let newChatList = chats.map(chat=>{
        if(chat.id==chatId){
          chat.messages.push({fileURL,id:file.id,sender:file.sender,link:true,fileName:file.fileName});
        }
        return chat
      });
      this.setState({chats:newChatList});
      
    }
  }

  updateTyping = (chatId) => {
    return ({ isTyping, user }) => {
      if (user !== this.props.user.name) {
        const { chats } = this.state;
        let newChatList = chats.map((chat) => {
          if (chat.id === chatId) {
            //console.log(chat.typingUsers.includes(user))
            if (isTyping && !chat.typingUsers.includes(user) ) {
              chat.typingUsers.push(user);
              //console.log(`there are typing people ${chat.typingUsers}`);
            } else if (!isTyping && chat.typingUsers.includes(user) )
              chat.typingUsers = chat.typingUsers.filter((name) => name !== user);
              //console.log(`there are typing people ${chat.typingUsers}`);
          }
          return chat;
        });
        this.setState({ chats: newChatList });
      }
    };
  };

  setActivechat = (activeChat) => {
    this.setState({ activeChat: activeChat });
  };

  sendFile = (chatId,data)=>{
    const {socket} = this.props;
    socket.emit(FILE_SENT,{chatId,data})
  };

  sendMessage = (chatId, message) => {
    const { socket } = this.props;
    socket.emit(MESSAGE_SENT, { chatId, message});
  };

  sendTyping = (chatId, isTyping) => {
    const { socket, p2psocket } = this.props;
    socket.emit(TYPING, { chatId, isTyping });
  };

  render() {
    const { user, logout, socket } = this.props;
    const { chats, activeChat } = this.state;
    //console.log(chats)
    //console.log(activeChat)
    return (
      <div className="Chat-container">
        <div className="side-bar">
          <SideBar
            user={user}
            logout={logout}
            chats={chats}
            activeChat={activeChat}
            setActivechat={this.setActivechat}
            openPrivateChat={this.sendPrivateChat}
            socket={socket}
          />
        </div>
        <div className="welcome-window">
          {activeChat !== null ? (
            <ChatConsole
              user={user}
              activeChat={activeChat}
              sendTyping={this.sendTyping}
              sendMessage={this.sendMessage}
              sendFile={this.sendFile}
            />
          ) : (
            <div>
              <h1>Welcome to chat app </h1>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default ChatContainer;            