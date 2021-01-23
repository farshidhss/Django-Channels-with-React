import React, { Component } from 'react';
import { render } from 'react-dom';
import moment from 'moment/moment';
import MessageInput from './MessageInput';
import Message from './Message';

function getSocket() {
  const roomName = window.location.pathname.substr(1);
  const socketPath = `ws://${
    window.location.host
  }/ws/${
    roomName}`;

  return new WebSocket(
    socketPath,
  );
}

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      messages: [],
    };

    this.chatSocket = getSocket();
  }

  componentDidMount() {
    this.chatSocket.onmessage = (e) => {
      const data = JSON.parse(e.data);
      const message = { text: data.message, date: data.utc_time };
      message.date = moment(message.date).local().format('YYYY-MM-DD HH:mm:ss');

      this.setState((prevState) => ({ messages: prevState.messages.concat(message) }));
    };
  }

  render() {
    const { messages } = this.state;
    const messageInput = <MessageInput socket={this.chatSocket} />;

    const messageList = (
      <div>
        {messages.map((item) => (
          <div key={item.id}>
            <Message text={item.text} date={item.date} />
          </div>
        ))}
      </div>
    );

    return (
      <div>
        {messageList}
        {messageInput}
      </div>
    );
  }
}

export default App;

const container = document.getElementById('app');
render(<App />, container);
