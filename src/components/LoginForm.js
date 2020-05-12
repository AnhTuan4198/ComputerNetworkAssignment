import React, { Component } from 'react';
import { VERIFY_USER } from "../actions/event";

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
        const {socket} = this.props;
        const {nickname}=this.state;
        console.log(nickname)
        socket.emit(VERIFY_USER,nickname,this.setUser)
    }
    handlOnchange=(e)=>{
        this.setState({[e.target.name]:e.target.value})
    }
    setUser=({user,logined})=>{
        console.log(user,logined)
        if(logined){
            this.setError("Nickname already taken")
        }else{
            this.props.setUser(user);
            this.setError('')
        }
    }   
    setError=(error)=>{
        this.setState({error:error})
    }
    render() {
        const {nickname , error} = this.state
        return (
          <div>
            <form onSubmit={this.handleSubmit}>
                <label htmlFor="nickname"><h2>got a nickname?</h2></label>
                <input
                    id="nickname" 
                    name="nickname"
                    type="text"
                    placeholder="My cool nickname "
                    onChange={this.handlOnchange}
                />
                <div id="error">{error? error:null}</div>
                <button type="submit">GO</button>
            </form>
          </div>
        );
    }
}

export default LoginForm;