import React, { Component } from 'react';
import '../../styles/message/Messages.css'


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
              <div className="Time">{mess.time}</div>
              {mess.sender !== user.name && (
                <div className="sender">{mess.sender}</div>
              )}
            </div>
          );
        });
        const typingList = typingUsers.map((typingUser) => {
          return (
            <div key={typingUser} className="typing-status">
              {`${typingUser} is typing ...`}
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