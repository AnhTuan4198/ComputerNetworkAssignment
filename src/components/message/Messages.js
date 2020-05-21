import React, { Component } from 'react';
import '../../styles/message/Messages.css'
import '../../styles/chat/ChatConsole.css';

class Messages extends Component {
    constructor(props){
        super(props)
        this.messageList=React.createRef();
    }
    componentDidMount(){
        this.scrollDown();
    }
    componentDidUpdate(){
      this.scrollDown();
    }
    scrollDown=()=>{
      const scrollHeight = this.messageList.current.scrollHeight;
      const height = this.messageList.current.clientHeight;
      const maxScrollTop = scrollHeight - height;
      this.messageList.current.scrollTop = maxScrollTop > 0 ? maxScrollTop : 0;
    }
    render() {
        
        const {user,messages,typingUsers} = this.props
        const messList = messages.map((mess) => {
          return (
            <div
              key={mess.id}
              className={`message ${mess.sender === user.name ? "right" : ""}`}
            >
                <div className="content">{mess.message}</div>
                <div className="info">
                  <div className="Time">{mess.time}</div>
                  <div className="sender">{mess.sender}</div>
                </div>
            </div>
          );
        });
        const typingList = typingUsers.map((typingUser) => {
          return (
            <div key={typingUser} className="typing-status">
              {`${typingUser}`}
              <span> </span>
              <span>i</span>
              <span>s</span>
              <span> </span>
              <span>t</span>
              <span>y</span>
              <span>p</span>
              <span>i</span>
              <span>n</span>
              <span>g</span>
              <span>.</span>
              <span>.</span>
              <span>.</span>
            </div>
          );
        });
        return (
          <div className="container">
            <div className="thread" ref={this.messageList}>
              {messList}
              {typingList}
            </div>
          </div>
        );
    }
}

export default Messages;