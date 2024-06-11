import React, { useEffect, useState } from 'react'
import { user } from '../Join/Join'
import socketIo from "socket.io-client"
import './Chat.css'
import sendLogo from "../../images/send.png"
import Message from '../Message/Message'
import ReactScrollToBottom from "react-scroll-to-bottom"
import closeIcon from "../../images/closeIcon.png"

let socket;
const ENDPOINT = "https://chatting-app-two-mu.vercel.app/"
const Chat = () => {

    const [ id, setid ] = useState("");
    const [ messages, setMessages ] = useState([]);

    const send = () => {
        const message = document.getElementById('chatInput').value;
        socket.emit('message', { message, id })
        document.getElementById('chatInput').value = "";
    }

    
    useEffect( () => {

        socket = socketIo(ENDPOINT, { transports: ['websocket'] })

        socket.on('connect', () => {
            alert("Connected")
            setid(socket.id);
        })

        socket.emit('Joined', {user}) // emit means to send data to server


        // in server index.js we used destructure method by passing user directly.... here we will use simple method by passing data
        socket.on('Welcome', (data) => {
            setMessages([...messages, data]);
            console.log(data.user, data.message);
        })
        // socket.on('Welcome', ({user, message}) => {
        //     console.log(`${user} ${message}`);
        // }) above one destructue method

        socket.on('userJoined', (data) => {
            setMessages([...messages, data]);
            console.log(data.user, data.message);
        } )


        socket.on('leave', (data) => {
            setMessages([...messages, data]);
            console.log(data.user, data.message);
        } )

        

        return () => {
            socket.emit('Disconnect');
            socket.off();
        }
    }, [] )


    useEffect(() => {
      socket.on('sendMessage', (data) => {
        setMessages([...messages, data]);
        console.log( data.user, data.message, data.id );
      })
    
      return () => {
        socket.off();
      }
    }, [messages])
    

  return (
    <div className="chatPage">
        <div className="chatContainer">
            <div className="header">
                <h2>CHAT BOX</h2>
                <a href="/">
                    <img src={closeIcon} alt="Close" />
                </a>
            </div>
            <ReactScrollToBottom className="chatBox">
                {messages.map( (item, i) => <Message user={ item.id === id ? '' : item.user } message={item.message} classs={ item.id === id ? 'right' : 'left'} /> )}
            </ReactScrollToBottom>
            <div className="inputBox">
                <input onKeyPress={(e) => e.key == 'Enter' ? send() : null} type="text" id="chatInput" />
                <button onClick={send} className="sendBtn">
                    <img src={sendLogo} alt="Send" />
                </button>
            </div>
        </div>
    </div>
  )
}

export default Chat