import React, { Component } from 'react';
import '../styles/chat/ChatConsole.css'
import Messages from '../components/message/Messages';
import MessageInput from '../components/message/MessagesInput';
import FileInput from '../components/message/FileInput';
class ChatConsole extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showSendFileForm: false,
    };
    this.showSendFileForm = this.showSendFileForm.bind(this);
  }
  

  showSendFileForm() {
    this.setState({ showSendFileForm: !this.state.showSendFileForm });
    console.log(this.state.showSendFileForm);
  }

  render() {
    const { activeChat, user, sendMessage, sendTyping, sendFile } = this.props;
    
    return (
      <div className="Chat-Console-container">
        <div className="console-heading">{activeChat?activeChat.name:"Anonymous"}</div>
        <Messages
          user={user}
          messages={activeChat.messages}
          typingUsers={activeChat.typingUsers}
        />
        <MessageInput
          sendMessage={(message) => {
            sendMessage(activeChat.id, message);
          }}
          sendTyping={(isTyping) => {
            sendTyping(activeChat.id, isTyping);
          }}
          showSendFileForm={this.showSendFileForm}
        />
        {this.state.showSendFileForm ? (
          <FileInput
            sendFile={(data) => {
              sendFile(activeChat.id, data);
            }}
            showSendFileForm={this.showSendFileForm}
          />
        ) : null}
      </div>
    );
  }
}

export default ChatConsole;