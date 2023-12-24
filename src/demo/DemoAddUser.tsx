import React, {useEffect, useState} from 'react';
import {BACKEND_URL} from "../constants/contants";
import {DemoChatObject} from "./DemoMessageSender";

const DemoAddUser: React.FC = () => {

    const [newUser, setNewUser] = useState<string>('');
    const [chats, setChats] = useState<DemoChatObject[]>([]);
    const [selectedChat, setSelectedChat] = useState<DemoChatObject | null>(null);

    useEffect(() => {
        const token = localStorage.getItem('access_token');

        if (!token) {
            console.log('No access token found');
            return;
        }

        const fetchChats = async () => {
            try {
                const response = await fetch(BACKEND_URL + '/api/chat/exchanges', {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log('Chats from user:', data);
                    setChats(data);

                    if (data.length > 0) {
                        setSelectedChat(data[0]);
                    }
                } else {
                    console.error('Failed to fetch chats:', response.statusText);
                }
            } catch (error) {
                console.error('Error fetching queues:', error);
            }
        };

        fetchChats();
    }, []);


    const handleSend = async () => {
        if (newUser.trim() !== '') {
           try {
                const token = localStorage.getItem("access_token");
                const url = `${BACKEND_URL}/api/chat/add?chatId=${selectedChat?.chat.id}&email=${newUser}`;
                const response = await fetch(url, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    console.log('Added new User');
                } else {
                    console.error('Could not add new user:', response.statusText);
                }
            } catch (error) {
                console.error('error:', error);
            }

            setNewUser('');
        }
    };



    return (
        <div>
            <h2>Add new User</h2>
            <div>
                <label>Select Chat:</label>
                <select
                    value={selectedChat ? selectedChat.chat.id: ''}
                    onChange={(e) => {
                        const selectedId = parseInt(e.target.value);
                        const selected = chats?.find((chat) => chat.chat.id === selectedId);
                        setSelectedChat(selected || null);
                    }} >
                    {chats?.map((chat) => (
                        <option key={chat.chat.id} value={chat.chat.id}>
                            {chat.chat.chatName}
                        </option>
                    ))}
                </select>
            </div>
            <input type="text" value={newUser} onChange={(e) => setNewUser(e.target.value)} />
            <button onClick={handleSend}>Send</button>
        </div>
    );
};

export default DemoAddUser;