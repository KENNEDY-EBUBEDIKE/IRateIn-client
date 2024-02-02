import React, { useState } from 'react';
import Modal from './modal'
import './addChat.css';
import chat_icon2 from "../../assets/images/message-circle-chat2.png";
import plus_icon from "../../assets/images/solid-interface-plus.png";


const AddChat: React.FC = () => {

    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return(
        <div className="no-chats">
            <div className="info">
                <img src={chat_icon2} alt="" />
                <div>
                    <p className="chat">No Chats</p>
                    <p className="no-chat-details">You have not received or sent anyone a message.</p>
                </div>
            </div>
            <div className="add-person">
                <button onClick={openModal}>
                    <img alt="" src={plus_icon} />
                    Add a person
                </button>

            </div>

            <Modal isOpen={isModalOpen} onClose={closeModal} />

        </div>
    );
};

export default AddChat