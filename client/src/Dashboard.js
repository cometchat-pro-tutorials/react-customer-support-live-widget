import React, {Component} from 'react';

import {CometChat} from '@cometchat-pro/chat';
import MDSpinner from "react-md-spinner";

const agentUID = '{AGENT_UID}';
const AGENT_MESSAGE_LISTENER_KEY = 'agent-listener'
const messageType = CometChat.MESSAGE_TYPE.TEXT;
const receiverType = CometChat.RECEIVER_TYPE.USER;

class Dashboard extends Component {

  state = {
    friends: [],
    selectedFriend: '',
    chat: [],
    chatIsLoading: false,
    friendsIsLoading:true
  }

  componentDidMount(){
    this.fetchAuth(agentUID).then(
      result => {
        console.log('auth token fetched', result);
        CometChat.login(result.authToken)
        .then( user => {
          console.log("Login successfully:", { user });
          this.fetchUsers().then(result => {
            this.setState({
              friends: result,
              friendsIsLoading: false
            })
          });
          
          CometChat.addMessageListener(
            AGENT_MESSAGE_LISTENER_KEY,
            new CometChat.MessageListener({
              onTextMessageReceived: message => {
                let {friends, selectedFriend, chat} = this.state;
                console.log("Incoming Message Log", { message });
                if(selectedFriend === message.sender.uid){
                  chat.push(message);
                  this.setState({
                    chat
                  })
                } else {
                  let filtered = friends.filter(function(friend) { return friend.uid === message.sender.uid; }); 
                  console.log(filtered);
                  if(!filtered.length){
                    friends.push(message.sender)
                    this.setState({
                      friends
                    })
                  }
                }
              }
            })
          );
       })
      },
      error => {
        console.log('Initialization failed with error:', error);
      }
    );
  }

  fetchAuth = async (uid) => {
    const response = await fetch(`/api/auth?uid=${uid}`)
    const result = await response.json()
    return result;
  }

  fetchUsers = async () => {
    const response = await fetch(`/api/users`)
    const result = await response.json()
    return result;
  }

  handleSubmit = event => {
    event.preventDefault();
    let message = this.refs.message.value;

    var textMessage = new CometChat.TextMessage(
      this.state.selectedFriend,
      message,
      messageType,
      receiverType
    );

    CometChat.sendMessage(textMessage).then(
      message => {
        let {chat} = this.state;
        console.log('Message sent successfully:', message);
        chat.push(message);
        this.setState({
          chat
        })
      },
      error => {
        console.log('Message sending failed with error:', error);
      }
    );
    this.refs.message.value='';
  }

  componentWillUnmount(){
    CometChat.removeMessageListener(AGENT_MESSAGE_LISTENER_KEY);
    CometChat.logout();
  }

  selectFriend(uid){
    this.setState({
      selectedFriend: uid
    }, ()=> {this.fetchPreviousMessage(uid)})
  }

  fetchPreviousMessage = (uid) => {
    this.setState({
      chat: [],
      chatIsLoading: true
    }, () => {
      var limit = 30;
      var messagesRequest = new CometChat.MessagesRequestBuilder().setUID(uid).setLimit(limit).build();
      messagesRequest.fetchPrevious().then(
        messages => {
          console.log("Message list fetched:", messages);
          this.setState({
            chat: messages,
            chatIsLoading: false
          })
        },
        error => {
          console.log("Message fetching failed with error:", error);
        }
      );
    });
  }

  render() {
    return(
      <div className='container-fluid'>
        <div className='row'>
          <div className='col-md-2'></div>
          <div className="col-md-8 h-100pr border rounded">
            <div className='row'>
              <div className='col-lg-4 col-xs-12 bg-light' style={{ height: 658 }}>
              <div className='row p-3'><h2>Recent Chat</h2></div>
              <div className='row ml-0 mr-0 h-75 bg-white border rounded' style={{ height: '100%', overflow:'auto' }}>
              <ContactBox {...this.state} />
              </div>
              </div>
              <div className='col-lg-8 col-xs-12 bg-light'  style={{ height: 658 }}>
                <div className='row p-3 bg-white'>
                  <h2>Who you gonna chat with?</h2>
                </div>
                <div className='row pt-5 bg-white' style={{ height: 530, overflow:'auto' }}>
                <ChatBox {...this.state} />
                </div>
                <div className="row bg-light" style={{ bottom: 0, width: '100%' }}>
                <form className="row m-0 p-0 w-100" onSubmit={this.handleSubmit}>
    
                <div className="col-9 m-0 p-1">
                  <input id="text" 
                    className="mw-100 border rounded form-control" 
                    type="text" 
                    name="text" 
                    ref="message"
                    placeholder="Type a message..."/>
                </div>
                <div className="col-3 m-0 p-1">
                  <button className="btn btn-outline-secondary rounded border w-100" 
                    title="Send" 
                    style={{ paddingRight: 16 }}>Send</button>
                </div>
                </form>
                </div>  
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

class ChatBox extends Component {
  render(){
    const {chat, chatIsLoading} = this.props;
    if (chatIsLoading) {
      return (
        <div className='col-xl-12 my-auto text-center'>
          <MDSpinner size='72'/>
        </div>
      )
    }
    else {
      return (
        <div className='col-xl-12'>
          { 
            chat
            .map(chat => 
              <div key={chat.id} className="message">
                <div className={`${chat.receiver !== agentUID ? 'balon1': 'balon2'} p-3 m-1`}>
                  {chat.text}
                </div>
              </div>)
          }  
        </div>
      )
    }
  }

}


class ContactBox extends Component {
  render(){
    const {friends, friendsIsLoading, selectedFriend} = this.props;
    if (friendsIsLoading) {
      return (
        <div className='col-xl-12 my-auto text-center'>
          <MDSpinner size='72'/>
        </div>
      )
    }
    else {
      return (
        <ul className="list-group list-group-flush w-100">
          { 
            friends
            .map(friend => 
              <li 
                key={friend.uid} 
                className={`list-group-item ${friend.uid === selectedFriend ? 'active':''}`} 
                onClick={() => this.selectFriend(friend.uid)}>{friend.name} </li>)
          }                
        </ul>
      )
    }
  }
}

export default Dashboard;