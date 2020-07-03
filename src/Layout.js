import React, { Component } from 'react';
import io from 'socket.io-client';
import {USER_CONNECTED,LOG_OUT} from './actions/event'
import LoginForm from './components/LoginForm';
import ChatContainer from './chat/ChatContainer';
import './styles/app/Layout.css';
import p2p from 'socket.io-p2p';

const socketURL = "/";
class Layout extends Component {
    constructor(props){
        super( props );
        this.state  = {
            socket:null,
            p2psocket:null,
            user:null
        }
    }

    componentWillMount(){
        this.initSocket();
    }
    /// INIT SOCKET CONNECTION
    initSocket= ()=>{
        const socket = io(socketURL);
        var opts = { peerOpts: { trickle: false }, autoUpgrade: false,usePeerConnection:true };
        const p2psocket = new p2p(socket,opts);
        socket.on('connect',()=>{
            console.log('Connected')
        })
        this.setState({socket,p2psocket});
    }
    // SETUSER FUNCITON
    setUser= (user)=>{
        const {socket} = this.state;
        socket.emit(USER_CONNECTED,user);
        this.setState({user})
    }
    // logout user 
    logout = () => {
        const { socket } =  this.state;
        socket.emit(LOG_OUT,this.state.user.name);
        this.setState({user:null})
    }
    render() {
        const { socket ,user,p2psocket} =this.state;
       // console.log(this.state);
        return (
          <div className="Layout-container">
            {user ? (
              <ChatContainer
                p2psocket={p2psocket}
                socket={socket}
                user={user}
                logout={this.logout}
              />
            ) : (
              <LoginForm socket={socket} setUser={this.setUser} />
            )}
          </div>
        );
    }
}

export default Layout;