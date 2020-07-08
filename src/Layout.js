import React, { Component } from 'react';
import io from 'socket.io-client';
import {USER_CONNECTED,LOG_OUT} from './actions/event'
import LoginForm from './components/LoginForm';
import ChatContainer from './chat/ChatContainer';
import './styles/app/Layout.css';
import Peer from "peerjs";

const socketURL = "http://191.16.20.6:8080";
class Layout extends Component {
    constructor(props){
        super( props );
        this.state  = {
            socket:null,
            peerId:null,
            peer:null,
            user:null
        }
        this.initSocket=this.initSocket.bind(this);
    }

    componentWillMount(){
        this.initSocket();
        
    }
    /// INIT SOCKET CONNECTION
     initSocket (){
      
          const socket = io(socketURL);
          const peer = new Peer('',{
            debug:true,
            host:'191.16.20.6',
            port:9000,
            path:'/chat-app'
          });
          //let peerId;
          peer.on('open',(id)=>{
            console.log(`My peer id is ${id} `);
            this.setState({peerId:id})
          })
          
          socket.on('connect',()=>{
            console.log(socket.id);
          })
          this.setState({socket,peer});   
    }
    // SETUSER FUNCITON
    setUser= (user)=>{
        const {socket} = this.state;
        socket.emit(USER_CONNECTED,user);
        this.setState({user});

    }
    // logout user 
    logout = () => {
        const { socket } =  this.state;
        socket.emit(LOG_OUT,this.state.user.name);
        this.setState({user:null})
    }
    render() {
        const { socket ,user,peerId,peer} =this.state;
        //console.log(this.state)
        return (
          <div className="Layout-container">
            {user ? (
              <ChatContainer
                peerId={peerId}
                peer={peer}
                socket={socket}
                user={user}
                logout={this.logout}
              />
            ) : (
              <LoginForm peerId={peerId} socket={socket} setUser={this.setUser} />
            )}
          </div>
        );
    }
}

export default Layout;