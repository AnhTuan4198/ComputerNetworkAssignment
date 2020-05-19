import React, { Component } from 'react';

class Messages extends Component {
    constructor(props){
        super(props)
        this.container=React.createRef();
    }
    componentDidMount(){
        this.scrollDown();
    }
    scrollDown=()=>{
      this.container.current.scrollDown=this.container.current.scrollHeight;
    }
    render() {
        
        const {user,messages,typingUsers} = this.props
        const messList = messages.map((mess) => {
          return (
            <div
              key={mess.id}
              className={`message ${mess.sender === user.name ? "right":""}`}
            >
                <div className="content">{mess.message}</div>
                <div className="info">
                  <div className="Time">{mess.time}</div>
                  <div className="sender">{mess.sender}</div>
                </div>
                {console.log(mess.sender)}
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
          <div className="container" ref={this.container}>
            <div className="thread">
                {messList}
                {typingList}
            </div>
          </div>
        );
    }
}

export default Messages;