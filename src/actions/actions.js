const { v4: uuidv4 } = require("uuid");

// create message function
//@param object  {message:stirng, sender: string}
//return object{ id:string, message: string ,: sender: string ,time : string}

const getTime=(date)=>{
    return `${date.getHours()}:${(('0'+date.getMinutes()).slice(-2))}`;
}

const createMessage = function ( {message="",sender=""} = { }) {
    return {
      id: uuidv4(),
      message,
      sender,
      time: getTime(new Date(Date.now)),
    };
} 


// create user function 
// @param object {name:string }
//return object {id:string,name:string}

const createUser =  ({name=""}={})=>({
    id:uuidv4(),
    name
}) 

// create conversation
//@param object{ name:String , message:list , users:list}
//return object{id:string, message:list , users:List, name :string }

const createChatbox = ({name = "Comunity", messages =[], users=[] }= {}) => ({
    id:uuidv4(),
    messages,
    users,
    name,
    typingUsers:[]
})



module.exports ={
    createUser,
    createChatbox,
    createMessage
}