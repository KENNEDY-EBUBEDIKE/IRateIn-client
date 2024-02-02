import React, {useEffect, useState} from 'react';
import './base.css';
import Inbox from "../inbox/inbox";
import AddChat from "../add-chat/addChat";
import { useLocation } from 'react-router-dom';
import {ApiService} from '../../services/apiService'

import home_logo from '../../assets/images/home.png';
import chat_icon from '../../assets/images/message-circle-chat.png';
import logout_icon from '../../assets/images/vuesax-outline-logout.png';
import search_icon from '../../assets/images/search-normal.png';
import location_pin from '../../assets/images/location-pin-alt-1.png';
import noti_icon from '../../assets/images/noti-icon.png';
import photo from '../../assets/images/photo.png';

import caret_down from '../../assets/images/solid-interface-caret-down.png';


const Base: React.FC = () => {
    const location = useLocation();
    const req = new ApiService()
    const authUser:string|null = window.sessionStorage.getItem('authUser')
    let user:any = null;
    const [chatsAvailable, setChatsAvailable] = useState(false)
    useEffect(() => {
        document.title = `Chat App`;
        getUserChats();
    }, [location]);

    if (authUser != null) {
        user = JSON.parse(authUser)
    }else {
        window.location.href = '/login';
    }

    const getUserChats = async ()=>{

        const response = await req.get('/chat/get-chats/');
        if(response.success){
            if(response.chats.length > 0){
                setChatsAvailable(true)
            }
        }
    }

    const logout = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const response = await req.logout('/users/logout/');
            if(response.success){
                window.sessionStorage.clear()
                window.location.href = '/login';
            }else{
                alert(response.error)
            }
        } catch (error) {
            console.log(error)
        }
    };

    return (

        <div className="general">
            <section className="sidebar-panel">
                <div className="sidebar">
                    <div className="home-grp">
                        <div className="home">
                            <img src={home_logo} alt="" />
                            <span>Home</span>
                        </div>
                        <a href=".">
                            <div className="messages">
                                <img src={chat_icon} alt="" />
                                <span>Messages</span>
                            </div>
                        </a>

                    </div>

                    <a href="." onClick={logout}>
                        <div className="logout">
                            <img src={logout_icon} alt="" />
                            <span> Log Out</span>
                        </div>
                    </a>

                </div>
            </section>

            <section className="main-panel">

                <div className="navbar">
                    <div className="search">
                        <div className="house-search">
                            <img src={search_icon} alt="" />
                                <label>
                                    <input type="text" placeholder="Search for house" />
                                </label>
                        </div>
                        <div className="location">
                            <span> location </span>
                            <img src={location_pin} alt="" />
                        </div>
                    </div>

                    <div className="settings">
                        <a href=".">
                            <img className="notification" src={noti_icon} alt="" />
                        </a>

                        <a href=".">
                            <div className="profile">
                                <div className="profile-details">
                                    <img src={photo} alt="" className="profile-photo" />
                                        <span> {user?.username} </span>
                                </div>
                                <img className="drop-down" src={caret_down} alt="" />
                            </div>
                        </a>
                    </div>
                </div>

                <div className="content">
                    {chatsAvailable? (
                        <Inbox />
                    ): (
                        <AddChat />
                    )}

                </div>
            </section>
        </div>

    );


};

export default Base;