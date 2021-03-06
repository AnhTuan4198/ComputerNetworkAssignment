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

import{createMessage,createLink} from "../actions/actions"

class ChatContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chats: [],
      activeChat: null,
      targetPeer:null
    };
    this.sendPrivateChat=this.sendPrivateChat.bind(this);
    this.setActivechat = this.setActivechat.bind(this);
    
  }
  
  componentDidMount() {
    const { peer,socket } = this.props;
    let { activeChat } = this.state;
    this.initSocket(socket);
    console.log(`i am in receiving message`);
    peer.on("connection",  (sender)=> {
      let connected ; 
      const { chats } = this.state;
      chats.forEach(chat=>{
        for(let i=0 ; i < chat.users.length ; i++){
          if (chat.users[i].peerId === sender.peer) {
            connected = chat;
          }
        }
      }) 
        if(connected){
          sender.on("data",(data)=>{
            switch(data.dataType){
              case"text":
                this.addMessagetoChat(connected.id)(data);
                break
              case"file":
                this.addLinkToChat(connected.id)(data);
              default:
                break
            }
          });
        }
    });

  }

  
  initSocket(socket){
    socket.on(PRIVATE_CHAT,this.addChat);
  }
  sendPrivateChat(receiver){
    const {socket,user}=this.props;
    const {activeChat}=this.state;
    socket.emit(PRIVATE_CHAT,{receiver,user,activeChat})
  }
  //reset chat
  resetChat = (chat) => {
    return this.addChat(chat, true);
  };
  //addChat
  addChat = (chat, reset=false) => {
     const { socket, user, peer } = this.props;
     const { chats, activeChat } = this.state;

     const newChatList = reset ? [chat] : [...chats, chat];
     this.setState({
       chats: newChatList,
       activeChat: reset ? chat : this.state.activeChat,
     });
     const typingEvent = `${TYPING}-${chat.id}`;
     socket.on(typingEvent, this.updateTyping(chat.id));
  };

  addMessagetoChat = (chatId) => {
    return (message) => {
      const { chats } = this.state;
      let newChatList = chats.map((chat) => {
        if (chat.id === chatId) {
          chat.messages.push(message);
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
            if (isTyping && !chat.typingUsers.includes(user) ) {
              chat.typingUsers.push(user);
            } else if (!isTyping && chat.typingUsers.includes(user) )
              chat.typingUsers = chat.typingUsers.filter((name) => name !== user);
          }
          return chat;
        });
        this.setState({ chats: newChatList });
      }
    };
  };

 async setActivechat  (activeChat)  {
    const { user, peer } = this.props;
     this.setState({ activeChat });
    let targetUser = activeChat.users.find((member) => {
      return member.name !== user.name;
    });
    if (targetUser) {
      let targetPeer = await peer.connect(targetUser.peerId);
      targetPeer.on("open", () => {
        console.log(`${user.peerId} have connected to ${targetUser.peerId}`);
      });
      this.setState({ targetPeer });
    }
  };

  sendFile = (chatId,data)=>{
    const {user} = this.props;
    const {targetPeer} =this.state;
    let newFileLink = createLink({
      fileName:data.fileName,
      buffer:data.buffer,
      sender:user.name,
      type:data.type
    })
    this.addLinkToChat(chatId)(newFileLink);
    targetPeer.send(newFileLink);
  };

  sendMessage = (chatId, message) => {
    const { user,peer } = this.props;
    const {targetPeer} =this.state;
    let newMessage = createMessage({message ,sender: user.name});
    this.addMessagetoChat(chatId)(newMessage);
    targetPeer.send(newMessage);
  };

  sendTyping = (chatId, isTyping) => {
    const { socket } = this.props;
    socket.emit(TYPING, { chatId, isTyping });
  };

  render() {
    const { user, logout, socket } = this.props;
    const { chats, activeChat } = this.state;
    
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
              receiveMessage={this.receiveMessage}
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