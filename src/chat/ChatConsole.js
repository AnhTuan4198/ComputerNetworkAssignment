import React, { Component } from 'react';
import '../styles/chat/ChatConsole.css'
import Messages from '../components/message/Messages';
import MessageInput from '../components/message/MessagesInput';
class ChatConsole extends Component {
    render() {
        const {activeChat,user,sendMessage,sendTyping}=this.props
        return (
            <div className="Chat-Console-container">
                <div className="console-heading">
                    {activeChat.name}
                </div>
                <Messages
                    user={user}
                    messages={activeChat.messages}
                    typingUsers={activeChat.typingUsers}
                />
                <MessageInput
                    sendMessage={
                        (message) => {
                            sendMessage(activeChat.id,message);
                        }
                    }
                    sendTyping={
                        (isTyping)=>{
                            sendTyping(activeChat.id,isTyping);
                        }
                    }
                />
            </div>
        );
    }
}

export default ChatConsole;