import React, { Component } from 'react';
import io from 'socket.io-client';
import {USER_CONNECTED,LOG_OUT} from './actions/event'
import LoginForm from './components/LoginForm';
import ChatContainer from './chat/ChatContainer';
import './styles/app/Layout.css'


const socketURL = "http://192.168.56.1:8080";
class Layout extends Component {
    constructor(props){
        super( props );
        this.state  = {
            socket:null,
            user:null
        }
    }

    componentWillMount(){
        this.initSocket();
    }
    /// INIT SOCKET CONNECTION
    initSocket= ()=>{
        const socket = io(socketURL);
        socket.on('connect',()=>{
            console.log('Connected')
        })
        this.setState({socket});
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
        const { socket ,user} =this.state
        return (
          <div className="Layout-container">
            {
                user?
                <ChatContainer socket={socket} user={user} logout={this.logout}/>:
                <LoginForm socket={socket} setUser={this.setUser} />
            }
          </div>
        );
    }
}

export default Layout;