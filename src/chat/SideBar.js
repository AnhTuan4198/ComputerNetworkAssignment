import React, { Component } from 'react';
import '../styles/SideBar.css'

class SideBar extends Component {
    constructor(props){
        super(props)
    }
    render() {
        const {user,logout,chats,activeChat,setActivechat}= this.props;
        return (
          <div className="Sidebar-container">
            <div className="Sidebar-heading">
              <div className="App-name">Cooll App</div>
              <div className="menu"> menu go here</div>
            </div>
            <div className="search">
              <i className="search-icon">

              </i>
              <input placeholder="Search" type="text" />
              <div className="plus"></div>
            </div>
            <div className="Sidebar-user-list" ref="users"
                onClick={(e)=>{
                    (e.target===this.refs.user && setActivechat(null))
                }}
            >
                {
                    chats.map(chat =>{
                        if(chat.name){
                            const lastMessage=chat.messages[chat.messages.length -1];
                            const user = chat.users.find(({name})=>{
                                return name !== this.props.name
                            }) || {name:"Community"}
                            const className=(activeChat && activeChat.id === chat.id )?'active':" "
                            return (
                            <div key={chat.id} className={`user ${className}`} onClick={()=>setActivechat(chat)}>
                                <div className="user-ava">{user.name[0].toUperCase()}</div>
                                <div className="user-info">
                                    <div className="user-name">{user.name}</div>
                                    {lastMessage && <div className="lastMessage">{lastMessage.message}</div>}
                                </div>
                            </div>
                            )
                        }
                        return null
                    })
                }
            </div>
            <div className="cureent-user">
                <div className="current-user-name">{user.name}</div>
                <div id="logout" onClick={()=>{logout()}}>Logout here</div>
            </div>
          </div>
        );
    }
}

export default SideBar;