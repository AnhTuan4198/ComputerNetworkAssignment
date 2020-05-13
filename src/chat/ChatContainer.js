import React, { Component } from 'react';
import SideBar from './SideBar';
import ChatConsole from './ChatConsole';
import '../styles/ChatContainer.css'
import {
  MESSAGE_SENT,
  TYPING,
  COMMUNITY_CHAT,
  MESSAGE_RECEIVED,
} from "../actions/event";
class ChatContainer extends Component {
    constructor(props){
        super(props)
        this.state={
            chats:[],
            activeChat:null
        }
    }
    componentDidMount(){
        const {socket}= this.props
        socket.emit(COMMUNITY_CHAT,this.resetChat)
    }
    //reset chat 
    resetChat=(chat)=>{
        return this.addChat(chat,true)
    }
    //addChat
    addChat=(chat,reset)=>{
        const {socket} = this.props
        const {chats} = this.state
        const newChatList= reset? [chat]: [...chats,chat]
        this.setState({chats:newChatList,activeChat:reset?chat:this.state.activeChat});

        const messageEvent = `${MESSAGE_RECEIVED}-${chat.id}`;
        const typingEvent  = `${TYPING}-${chat.id}`
        socket.on(messageEvent,this.addMessagetoChat(chat.id))
        socket.on(messageEvent,this.updateTyping(chat.id))
    }

    addMessagetoChat=(chatId)=>{
        return (message)=>{
            const {chats}= this.state;
            let newChatList=chats.map(chat=>{
                if(chat.id===chatId){
                    chat.messages.push(message)
                }
                return chat
            })
            this.setState({chats:newChatList})
        }
    }
    updateTyping=(chatId)=>{
        return ({isTyping , user})=>{
            if(user !== this.props.user){
                const {chats}= this.state;
                let newChatList=chats.map(chat=>{
                    if(chat.id === chatId){
                        if(isTyping && !chat.typingUsers.includes(user)){
                            chat.typingUsers.push(user);
                        }else if(!isTyping && chat.typingUsers.includes(user))
                            chat.typingUsers.filter(u => u !== user)
                    }
                    return chat;
                })
                this.setState({chats:newChatList})
            }
        }
    }
    setActivechat=(activeChat)=>{
        this.setState({activeChat:activeChat});
    }
    sendTyping=(chatId,message)=>{
        const {socket} =this.props;
        socket.emit(MESSAGE_SENT,{chatId,message});
    }
    sendMessage=(chatId,isTyping)=>{
        const {socket} = this.props;
        socket.emit(TYPING,{chatId,isTyping});
    }
    render() {
        const {user ,logout} = this.props;
        const { chats, activeChat} = this.state;
        return (
          <div className="Chat-container">
            <div className="side-bar">
              <SideBar
                user={user}
                logout={logout}
                chats={chats}
                activeChat={activeChat}
                setActivechat={this.setActivechat}
              />
            </div>
            <div className="welcome-window">
              {activeChat !== null ? (
                <ChatConsole 
                    user={user}
                    activeChat={activeChat}
                    sendTyping={this.sendTyping}
                    sendMessage={this.sendMessage}
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