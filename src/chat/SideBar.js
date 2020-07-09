import React, { Component } from 'react';
import {USER_CONNECTED} from '../actions/event';
import '../styles/sidebar/SideBar.css'
import{ TiThMenuOutline} from 'react-icons/ti';
import {FiLogOut} from 'react-icons/fi';
import { IoIosPersonAdd } from "react-icons/io";
class SideBar extends Component {
    constructor(props){
        super(props)
        this.state={
            receiver:"",
            showUserList:false,
            ConnecttingUser:[]
        }
        this.handleChange=this.handleChange.bind(this);
        this.handleSubmit=this.handleSubmit.bind(this);
    }
    componentDidMount(){
      this.getConnectingList();
    }
    handleChange(e){
        this.setState({[e.target.name]:e.target.value})
        //console.log(this.state.receiver)
    }
    handleSubmit(e){
        e.preventDefault();
        //console.log(this.state.receiver);
        const {user} =this.props;
        const {connectedUser} =this.state;
        let receiver;
        connectedUser.forEach((cnuser)=>{
          if(cnuser[0]!==user.name){
            receiver = cnuser[1];
            console.log(receiver);
          }
        })
        this.props.openPrivateChat(receiver);
        this.setState({receiver:""})
    }
    getConnectingList(){
      const {socket}= this.props;
      socket.on(USER_CONNECTED,(connectedUser)=>{
        let newConnectingUserList= Object.entries(connectedUser);
        this.setState({ConnecttingUser:[...newConnectingUserList]})
      })
    }
    render() {
        //console.log(this.state.ConnecttingUser);
        const {
          user,
          logout,
          chats,
          activeChat,
          setActivechat,
        } = this.props;
        
        const {ConnecttingUser,receiver} = this.state;
        //console.log(ConnecttingUser);
        return (
          <div className="Sidebar-container">
            <div className="Sidebar-heading">
              <div className="App-name">Cool Chat App</div>
              <div className="heading-menu">
                <TiThMenuOutline />
              </div>
            </div>
            <div className="Sidebar-option">
              <div
                className="Show-Chat-List"
                onClick={() => {
                  this.setState({ showUserList: false });
                }}
              >
                Chat List
              </div>
              <div
                className="Show-Online-User"
                onClick={() => {
                  this.setState({ showUserList: true });
                }}
              >
                Online User
              </div>
            </div>
            <div className="Sidebar-search">
              <form onSubmit={this.handleSubmit} className="Search-form">
                <input
                  className="Search-input"
                  placeholder="Search for connecting user"
                  type="text"
                  name="receiver"
                  autoComplete="off"
                  value={this.state.receiver}
                  onChange={this.handleChange}
                />
                <button
                  className="plus"
                  type="submit"
                  disabled={receiver?this.state.receiver.name.length < 1:null}
                >
                  <IoIosPersonAdd />
                </button>
              </form>
            </div>
            <div className="Sidebar-list">
              {this.state.showUserList ? (
                <div className="Sidebar-user-list">
                    {ConnecttingUser.map((cnuser) => {
                      if(cnuser[0]!==user.name){
                        return (
                          <div
                            onClick={()=>{
                              this.setState({showUserList:false})
                              //console.log(cnuser[1])
                              this.props.openPrivateChat(cnuser[1]);
                            }
                          }
                          key={cnuser[1].id}
                          className="UserList-UserItem"
                          >
                          {cnuser[0]}
                          </div>
                          )
                      }
                    })
                    }
                </div>
              ) : (
                <div
                  className="Sidebar-chat-list" /*ref="users"*/
                  onClick={(e) => {
                    e.target === this.refs.user && setActivechat(null);
                  }}
                >
                  {chats.map((chat) => {
                    if (chat) {
                      const lastMessage =
                        chat.messages[chat.messages.length - 1];
                      const conversation =
                        chat.users.find((member) => {
                          return member.name !== user.name;
                        }) || "Community";
                        
                      const className =
                        activeChat && activeChat.id === chat.id ? "active" : "";
                      return (
                        <div
                          key={chat.id}
                          className={`user ${className}`}
                          onClick={() => setActivechat(chat)}
                        >
                          <div className="user-ava">
                            {conversation!=="Community"?conversation.name[0].toUpperCase():"C"}
                          </div>
                          <div className="user-info">
                            <div className="user-name">{conversation.name||"Community"}</div>
                            {lastMessage && (
                              <div className="lastMessage">
                                {lastMessage.message}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              )}
            </div>

            <div className="Sidebar-current-user">
              <div className="current-user-name">{user.name}</div>
              <div
                id="logout"
                onClick={() => {
                  logout();
                }}
              >
                <FiLogOut />
              </div>
            </div>
          </div>
        );
    }
}

export default SideBar;