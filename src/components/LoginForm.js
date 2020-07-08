import React, { Component } from 'react';
import { VERIFY_USER } from "../actions/event";
import '../styles/loginform/Loginform.css'

class LoginForm extends Component {
    constructor(props){
        super(props)
        this.state={
            nickname:'',
            error:null
        }
        this.handleSubmit=this.handleSubmit.bind(this);
        this.handlOnchange=this.handlOnchange.bind(this);
    }
    handleSubmit = (e)=>{
        e.preventDefault();
        const {socket,peerId} = this.props;
        const {nickname}=this.state;
        socket.emit(VERIFY_USER,nickname,peerId,this.setUser)
    }
    handlOnchange=(e)=>{
        this.setState({[e.target.name]:e.target.value})
    }
    setUser=({user,logined})=>{
        if(logined){
            this.setError("Nickname already taken")
        }else{
            this.setError("");
            this.props.setUser(user);
        }
    }   
    setError=(error)=>{
        this.setState({error:error})
    }
    render() {
        const {nickname , error} = this.state;
        const {peerId}=this.props;
        //console.log(peerId)
        return (
          <div className="LoginArea">
            <form onSubmit={this.handleSubmit} id="Login-form">
                <h2>Welcome</h2>
                <label htmlFor="nickname"><h2>Don't have nickname?</h2></label>
                <input
                    id="nickname" 
                    name="nickname"
                    type="text"
                    placeholder="Get cool nickname here "
                    autoComplete="off"
                    onChange={this.handlOnchange}
                />
                <div id="error">{error? error:null}</div>
                <button disabled={this.state.nickname.length<1} className="btn" type="submit">GO!!</button>
            </form>
          </div>
        );
    }
}

export default LoginForm;