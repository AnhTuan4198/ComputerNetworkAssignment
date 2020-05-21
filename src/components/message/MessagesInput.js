import React, { Component } from 'react';
import {RiMailSendLine } from 'react-icons/ri'
import '../../styles/message/MessagesInput.css';

class MessagesInput extends Component {
    constructor(props){
        super(props)
        this.state = {
            message:"",
            isTyping:false
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handlChange = this.handlChange.bind(this); 
    }
    handleSubmit(e){
        e.preventDefault();
        this.sendMessage();
        this.setState({message:""})
    }

    sendMessage(){
        const {message}=this.state;
        this.props.sendMessage(message);
    }
    sendTyping(){
        this.lastUpdate= Date.now();
        const {isTyping} = this.state
        if(!isTyping){
            this.setState({isTyping:true})
            this.props.sendTyping(true);
            this.startCheckTyping();
        }
    }

    startCheckTyping(){
        console.log("Typing");
        this.typingInterval = setInterval(()=>{
            if(Date.now() - this.lastUpdate > 300){
                this.setState({isTyping:false})
                this.stopCheckTyping();
            }
        },3000)
    }
    stopCheckTyping(){
        console.log("Stop Typing");
        if(this.typingInterval){
            clearInterval(this.typingInterval);
            this.props.sendTyping(false);
        }
    }
    handlChange=(e)=>{
         this.setState({[e.target.name]:e.target.value})
    }
    render() {
        
        return (
          <div className="Message-input">
            <form className ='form' onSubmit={this.handleSubmit}>
              <input
                id="message"
                name="message"
                type="text"
                autoComplete='off'
                value={this.state.message}
                placeholder="Type some thing interresting here"
                onKeyUp={(e) => {
                  e.keyCode !== 13 && this.sendTyping();
                }}
                onChange={this.handlChange}
              />
              <button className='btn' disabled={this.state.message.length < 1} type="submit">
                <RiMailSendLine/>
              </button>
            </form>
          </div>
        );
    }
}

export default MessagesInput;