import React, { useEffect, useState } from 'react';
import './messaging.css';
import sendIcon from '../../assets/images/send.png';
import photo from '../../assets/images/photo.png';
import { ApiService } from '../../services/apiService';

const SERVER_URL = '127.0.0.1:8001';

interface MessagingProps {
    chatId: number;
    userId: number;
    participant: {
        username: string;
    };
    onWebSocketOpen: any;
}

const Messaging: React.FC<MessagingProps> = ({ chatId, userId, participant, onWebSocketOpen }) => {
    const req = new ApiService();
    const token = window.sessionStorage.getItem('token')
    const [chatMessages, setChatMessages] = useState<any[]>([]);
    const [message, setMessage] = useState('');
    const [isSending, setIsSending] = useState(false);
    const chatSocket = new WebSocket(`ws://${SERVER_URL}/ws/chat/${chatId}/?token=${token}`);

    useEffect(() => {

        const getInitialMessages = async () => {
            try {
                const response = await req.get(`/chat/get-chat-messages/?chat_id=${chatId}`);
                setChatMessages(response.chatMessages);
            } catch (error) {
                console.error('Error fetching chat messages:', error);
            }
        };
        getInitialMessages();

        chatSocket.onmessage = (e) => {
            const receivedMessage = JSON.parse(e.data);
            let div = document.createElement('div')

            if(receivedMessage.sender === userId){
                div.setAttribute('class', 'sent-message')
            }else {
                div.setAttribute('class', 'received-message')
            }

            let mp = document.createElement('p')
            mp.setAttribute('class', 'message-text')
            mp.innerHTML = receivedMessage.message

            let tp = document.createElement('p')
            tp.setAttribute('class', 'chat-time')
            tp.innerHTML = getTime(receivedMessage.date)

            div.appendChild(mp)
            div.appendChild(tp)

            let ui:any = document.getElementById('comm')
            ui.appendChild(div)

        };

        chatSocket.onopen = () => {
            console.log('CONNECTED');
            onWebSocketOpen()
        };

        chatSocket.onclose = () => {
            console.log('WEBSOCKET DISCONNECTED');
            alert("Disconnected!! Please refresh")
        };

    }, [chatId]);

    const handleSendMessage = () => {
        if (message.trim() && !isSending) {
            setIsSending(true);
            try {
                chatSocket.send(JSON.stringify({ message }));
                setMessage('');
            } catch (error) {
                console.error('Error sending message:', error);
            } finally {
                setIsSending(false);
            }
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter') {
            handleSendMessage();
        }
    };


    const getTime = (dateTime: string) => {
        const options: Intl.DateTimeFormatOptions = {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
            timeZone: 'Africa/Lagos',
        };
        return new Date(dateTime).toLocaleString('en-US', options);
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setMessage(event.target.value);
    };


    return (
        <div className="chat-message-content-container">
            <div className="chat-partner-details-container">
                <div className="chat-partner-details">
                    <img src={photo} alt="" />
                    <div>
                        <p className="chat-partner-name">{participant?.username}</p>
                        <p className="chat-partner-status">Online</p>
                    </div>
                </div>
            </div>
            <div className="chat-box">
                <div id="comm" className="rx-trx">
                    {chatMessages.map((message, index) => (
                        <div
                            className={message.sender === userId ? 'sent-message' : 'received-message'}
                            key={index}
                        >
                            <p className="message-text">{message?.message}</p>
                            <p className="chat-time">{getTime(message?.date)}</p>
                        </div>
                    ))}
                </div>
                <div className="chat-message-input">
                    <input
                        id="chat-message-input"
                        type="text"
                        placeholder="Write your message"
                        value={message}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                    />
                    <img src={sendIcon} alt="" onClick={handleSendMessage} />
                </div>
            </div>
        </div>
    );
};

export default Messaging;