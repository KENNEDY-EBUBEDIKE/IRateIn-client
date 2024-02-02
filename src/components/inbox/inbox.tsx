import React, {useEffect, useState} from 'react';
import './inbox.css';
import chat_icon from '../../assets/images/message-circle-chat.png';
import {useLocation} from "react-router-dom";
import {ApiService} from "../../services/apiService";
import search_icon from '../../assets/images/search-normal.png';
import photo from '../../assets/images/photo.png';
import Messaging from '../messaging/messaging'
import Modal from '../add-chat/modal'

const Inbox: React.FC = () => {

    const location = useLocation();
    const req = new ApiService()
    const [selection, setSelection]:any = useState(true);
    const [selectedChat, setSelectedChat]:any = useState();
    const [userChats, setUserChats]:any = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    const handleWebSocketOpen = () => {
        // When the WebSocket connection is opened, refresh the user chats
        getUserChats();
    };

    useEffect(() => {
        getUserChats();
    }, []);
    const getUserChats = async ()=>{

        const response = await req.get('/chat/get-chats/');
        if(response.success){
            setUserChats(response.chats);
        }
    }

    const loadMessage = (chat: any) => {
        setSelectedChat(chat);
        setSelection(false);
    };

    useEffect(() => {
        document.title = `Chat App - ${location.pathname.slice(1)}`;
    }, [location]);

    const getTime = (dateTime:string) => {
        const options: Intl.DateTimeFormatOptions = {
            // year: 'numeric',
            // month: 'numeric',
            // day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            // second: 'numeric',
            hour12: true,
            timeZone: 'Africa/Lagos',
        };

        return new Date(dateTime).toLocaleString('en-US', options);
    }

    return(
        <div className="content-container">
            <div className="inbox-panel">
                <div className="inbox-heading">
                    <div className="inbox-header">
                        <p>Inbox</p>
                        <button onClick={openModal}>Add Chat</button>
                        <div className="inbox-search">
                            <div className="inbox-search-bar">
                                <img src={search_icon} alt="" />
                                    <input type="text" placeholder="Search for message"/>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="message-tabs">
                    {userChats.map((chat:any, index:any) => (
                        <div className="message" key={index} onClick={() => loadMessage(chat)}>
                            <img src={photo} alt="" />
                            <div className="message-items">
                                <div className="message-content">
                                    <p className="sender">{chat?.participant?.username}</p>
                                    <p className="message-text">{chat?.last_message?.message}</p>
                                </div>
                                <p className="message-time">{getTime(chat?.last_message?.date)}</p>
                                {chat?.unread_mgs > 0 ? (
                                    <div className="unread-message-count">{chat?.unread_mgs}</div>
                                ):null}

                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {
                selection? (
                    <div className="conversation-panel">
                        <div className="no-conversation">
                            <img src={chat_icon} alt="" />
                            <p>Click on chat to read conversation</p>
                        </div>
                    </div>
                ): (
                    <Messaging
                        chatId={selectedChat?.chat_id}
                        userId={selectedChat?.user_id}
                        participant={selectedChat?.participant}
                        onWebSocketOpen={handleWebSocketOpen}
                    />
                )
            }
            <Modal isOpen={isModalOpen} onClose={closeModal} />
        </div>

    )


};

export default Inbox
