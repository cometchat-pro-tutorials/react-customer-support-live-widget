import React, {Component} from 'react';
import {Widget, addResponseMessage, addUserMessage, dropMessages} from 'react-chat-widget';
import {CometChat} from '@cometchat-pro/chat';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom';

import Dashboard from './Dashboard';

import 'react-chat-widget/lib/styles.css';

const agentUID = '{AGENT_UID}';
const messageType = CometChat.MESSAGE_TYPE.TEXT;
const receiverType = CometChat.RECEIVER_TYPE.USER;
const CUSTOMER_MESSAGE_LISTENER_KEY = "client-listener";

var limit = 30;

class Home extends Component {
  componentDidMount() {
    addResponseMessage('Welcome our store!');
    addResponseMessage('Are you looking for anything in particular?');
    
    let uid = localStorage.getItem("cc-uid");
    // check for uid, if exist then get auth token and do all these stuff
   if ( uid !== null) {
    //  fetch auth token then login
     this.fetchAuth(uid).then(
       result => {
         console.log('auth token fetched', result);
         CometChat.login(result.authToken)
         .then( user => {
           console.log("Login successfully:", { user });
           CometChat.addMessageListener(
             CUSTOMER_MESSAGE_LISTENER_KEY,
             new CometChat.MessageListener({
               onTextMessageReceived: message => {
                 console.log("Incoming Message Log", { message });
                 addResponseMessage(message.text);
               }
             })
           );
           
           var messagesRequest = new CometChat.MessagesRequestBuilder().setUID(agentUID).setLimit(limit).build();
           messagesRequest.fetchPrevious().then(
             messages => {
               console.log("Message list fetched:", messages);
               messages.forEach(function(message) {
                 if(message.receiver !== agentUID){
                   addResponseMessage(message.text);
                  } else {
                    addUserMessage(message.text)
                  }
                });
              },
              error => {
                console.log("Message fetching failed with error:", error);
              }
            );
        })
       },
       error => {
         console.log('Initialization failed with error:', error);
       }
     );
   }
  }

  fetchAuth = async (uid) => {
    const response = await fetch(`/api/auth?uid=${uid}`)
    const result = await response.json()
    return result;
  }

  createUser = async () => {
    const response = await fetch(`/api/create`)
    const result = await response.json()
    return result;
  }

  handleNewUserMessage = newMessage => {
    console.log(`New message incoming! ${newMessage}`);
    var textMessage = new CometChat.TextMessage(
      agentUID,
      newMessage,
      messageType,
      receiverType
    );
    let uid = localStorage.getItem("cc-uid");

    if (uid === null) {
      this.createUser().then(
        result => {
          console.log('auth token fetched', result);
          localStorage.setItem("cc-uid",result.uid)
          CometChat.login(result.authToken)
          .then(user => {
            console.log("Login successfully:", { user });
            CometChat.sendMessage(textMessage).then(
              message => {
                console.log('Message sent successfully:', message);
              },
              error => {
                console.log('Message sending failed with error:', error);
              }
            );
            CometChat.addMessageListener(
              CUSTOMER_MESSAGE_LISTENER_KEY,
              new CometChat.MessageListener({
                onTextMessageReceived: message => {
                  console.log("Incoming Message Log", { message });
                  addResponseMessage(message.text);
                }
              })
            );
          })

      },
      error => {
        console.log('Initialization failed with error:', error);
      })
    } else {
      // we have uid, do send
  
      CometChat.sendMessage(textMessage).then(
        message => {
          console.log('Message sent successfully:', message);
        },
        error => {
          console.log('Message sending failed with error:', error);
        }
      );
    }
  };

  componentWillUnmount() {
    CometChat.removeMessageListener(CUSTOMER_MESSAGE_LISTENER_KEY);
    CometChat.logout();
    dropMessages();
  }

  render() {
    return (
      <div className='App'>
        <Widget
          handleNewUserMessage={this.handleNewUserMessage}
          title='My E-commerce Live Chat'
          subtitle='Ready to help you'
        />
      </div>
    );
  }
}

function App() {
  return (
    <Router>
      <div>
        <ul>
          <li>
            <Link to='/'>Home</Link>
          </li>
          <li>
            <Link to='/dashboard'>Admin Dashboard</Link>
          </li>
        </ul>
        <hr />
        <Route exact path='/' component={Home} />
        <Route path='/dashboard' component={Dashboard} />
      </div>
    </Router>
  );
}

export default App;
