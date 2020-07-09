import React, { Component } from 'react';
import '../../styles/message/MessagesInput.css';
import '../../styles/message/FileInput.css';
class FileInput extends Component {
    constructor(props){
        super(props);
        this.state={
            fileName:'',
            buffer:[],
            type:''
        }
        this.handleSubmitfile=this.handleSubmitfile.bind(this);
        this.handleChangeFile=this.handleChangeFile.bind(this);
    }
    handleSubmitfile(e){
        e.preventDefault();
        this.props.sendFile({fileName:this.state.fileName,buffer:this.state.buffer,type:this.state.type});
        this.setState({
            fileName:'',
            buffer:[],
            type:''
        });
        this.props.showSendFileForm();
    }
    async handleChangeFile(){
        let input = document.querySelector("input[type=file]");
        console.log(input.files[0]);
        const reader = new FileReader();
        reader.onload = ()=> {
          this.setState({fileName:input.files[0].name, buffer: [reader.result],type:input.files[0].type});
          console.log(this.state);
        };
        reader.readAsArrayBuffer(input.files[0]);
    }
    render() {
        return (
          <div className="file-form">
            <form onSubmit={this.handleSubmitfile}>
              <button
                className="cancle-btn"
                onClick={this.props.showSendFileForm}
              >
                X
              </button>
              <input type="file" onChange={this.handleChangeFile}></input>
              <button className="btn" type="submit">
                Send
              </button>
            </form>
          </div>
        );
    }
}

export default FileInput;