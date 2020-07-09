const { v4: uuidv4 } = require("uuid");

// create message function
//@param object  {message:stirng, sender: string}
//return object{ id:string, message: string ,: sender: string ,time : string}

const getTime=(date)=>{
    return `${date.getHours()}:${(('0'+date.getMinutes()).slice(-2))}`;
}

const createMessage = function ({message = "",sender = "",dataType="text"} = {}) {
    return {
      id: uuidv4(),
      message,
      sender,
      dataType,
      time: getTime(new Date(Date.now())),
    };
} 

const createLink = function ({fileName="new file",buffer=[],sender='',type,dataType="file"}={}){
    return {
        id:uuidv4(),
        fileName,
        buffer,
        sender,
        type,
        dataType,
        time: getTime(new Date(Date.now())),
    };
}
// create user function 
// @param object {name:string }
//return object {id:string,name:string}

const createUser =  ({name="",socketId=null,peerId=null}={})=>({
    id:uuidv4(),
    name,
    socketId,
    peerId
}) 

// create conversation
//@param object{ name:String , message:list , users:list}
//return object{id:string, message:list , users:List, name :string }

const createChatbox = ({name = "Community", messages =[], users=[] }= {}) => ({
    id:uuidv4(),
    messages,
    users,
    name,
    typingUsers:[]
})



module.exports ={
    createUser,
    createChatbox,
    createMessage,
    createLink
}